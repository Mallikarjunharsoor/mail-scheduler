import dotenv from "dotenv";
dotenv.config();
console.log(Object.keys(process.env).filter(key =>
  key.includes("SMTP") ||
  key.includes("ETHEREAL") ||
  key.includes("PORT")
));
import 'reflect-metadata';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import cors from 'cors';
import { DataSource } from 'typeorm';
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';
import { z } from 'zod';
import { EmailJob } from './models/EmailJob.js';
import { User } from './models/User.js';
import { authRoutes } from './auth.js';
import { sendEmail } from './mailer.js';
import jwt from "jsonwebtoken";



const app = express();
const port = Number(process.env.PORT || 4000);
const queueName = 'email-scheduler';
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const defaults = { delay: Number(process.env.DELAY_BETWEEN_SECONDS || 2), hourlyLimit: Number(process.env.MAX_EMAILS_PER_HOUR || 200) };

app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json({ limit: '1mb' }));

const databaseUrl = process.env.DATABASE_URL;
const dataSource = new DataSource(databaseUrl ? {
  type: databaseUrl.startsWith('mysql') ? 'mysql' : 'postgres', url: databaseUrl,
  entities: [EmailJob, User], synchronize: true,
} : { type: 'sqlite', database: 'db.sqlite', entities: [EmailJob, User], synchronize: true });
await dataSource.initialize();

console.log(" Database Connected");
console.log("Database Type:", dataSource.options.type);

const redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
redis.on('error', (error) => console.error('Redis connection error:', error.message));
const queue = new Queue(queueName, { connection: redis, defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, removeOnComplete: 1000, removeOnFail: 5000 } });
const emails = dataSource.getRepository(EmailJob);

const scheduleSchema = z.object({
  from: z.string().email(), to: z.array(z.string().email()).min(1).max(1000), subject: z.string().min(1).max(200), body: z.string().min(1),
  sendAt: z.string().datetime().optional(), delayBetweenSeconds: z.number().int().min(0).max(3600).optional(), hourlyLimit: z.number().int().min(1).max(10000).optional(),
});
const verifyAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mailSchedulerSecret"
    );

    (req as any).currentUser = decoded;

    next();
  } catch {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

app.use('/api/auth', authRoutes(dataSource));
app.get('/api/health', async (_req, res) => res.json({ ok: true, redis: (await redis.ping()) === 'PONG' }));
app.post('/api/schedule', verifyAuth, async (req, res) => {
  const parsed = scheduleSchema.parse(req.body); const ownerId = (req as any).currentUser.userId as string;
  const base = parsed.sendAt ? new Date(parsed.sendAt) : new Date();
  if (Number.isNaN(base.getTime())) return res.status(400).json({ error: 'Invalid send time.' });
  const now = Date.now(); const jobs: EmailJob[] = [];
  for (const [index, recipient] of [...new Set(parsed.to.map((item) => item.toLowerCase()))].entries()) {
    const sendAt = new Date(Math.max(now, base.getTime()) + index * (parsed.delayBetweenSeconds ?? defaults.delay) * 1000);
    const queueJobId = `email:${ownerId}:${crypto.randomUUID()}`;
    const entity = emails.create({ from: parsed.from, to: [recipient], recipient, subject: parsed.subject, body: parsed.body, sendAt, ownerId, queueJobId, status: 'scheduled', delayBetweenSeconds: parsed.delayBetweenSeconds ?? defaults.delay, hourlyLimit: parsed.hourlyLimit ?? defaults.hourlyLimit });
    await emails.save(entity);

console.log(" Email saved to DB");
console.log(entity);
    await queue.add(
  "send-email",
  { emailJobId: entity.id },
  {
    jobId: queueJobId,
    delay: Math.max(0, sendAt.getTime() - now),
  }
);

console.log(" Job added to queue");
    jobs.push(entity);
  }
  res.status(201).json({ scheduled: jobs.length, jobs });
});
app.get('/api/scheduled', verifyAuth, async (req, res) => res.json(await emails.find({ where: { ownerId: (req as any).currentUser.userId, status: 'scheduled' }, order: { sendAt: 'ASC' } })));
app.get('/api/sent', verifyAuth, async (req, res) => res.json(await emails.createQueryBuilder('email').where('email.ownerId = :ownerId', { ownerId: (req as any).currentUser.userId }).andWhere('email.status IN (:...statuses)', { statuses: ['sent', 'failed'] }).orderBy('email.updatedAt', 'DESC').getMany()));


async function acquireHourlySlot(sender: string, limit: number) {
  const windowStart = new Date(); windowStart.setUTCMinutes(0, 0, 0);
  const key = `rate:${sender}:${windowStart.toISOString()}`;
  const count = await redis.incr(key); if (count === 1) await redis.expire(key, 3700);
  if (count <= limit) return true;
  await redis.decr(key); return false;
}
function msToNextHour() { const date = new Date(); return 3600000 - (date.getUTCMinutes() * 60000 + date.getUTCSeconds() * 1000 + date.getUTCMilliseconds()) + 1000; }
const worker = new Worker(queueName, async (bullJob) => {
  const email = await emails.findOneBy({ id: bullJob.data.emailJobId });
  if (!email || email.status !== 'scheduled') return; 
  if (!(await acquireHourlySlot(email.from, email.hourlyLimit))) {
    await bullJob.moveToDelayed(Date.now() + msToNextHour(), bullJob.token!); return;
  }
  try { await sendEmail(email); email.status = 'sent'; email.sentAt = new Date(); email.lastError = undefined; await emails.save(email); }
  catch (error) { email.lastError = error instanceof Error ? error.message : String(error); await emails.save(email); throw error; }
}, { connection: redis, concurrency: Number(process.env.WORKER_CONCURRENCY || 5) });
worker.on('failed', async (job, error) => { if (job && job.attemptsMade >= 3) { const email = await emails.findOneBy({ id: job.data.emailJobId }); if (email && email.status === 'scheduled') { email.status = 'failed'; email.lastError = error.message; await emails.save(email); } } });
worker.on("ready", () => {
  console.log("Worker Ready");
});

worker.on("active", (job) => {
  console.log("Processing Job:", job.id);
});

worker.on("completed", (job) => {
  console.log("Job Completed:", job.id);
});

const errors: ErrorRequestHandler = (error, _req, res, _next) => { console.error(error); res.status(error instanceof z.ZodError ? 400 : 500).json({ error: error instanceof Error ? error.message : 'Unexpected server error' }); };
app.use(errors);
app.listen(port, () => console.log(`API and BullMQ worker listening on http://localhost:${port}`));
console.log("Current directory:", process.cwd());
console.log("Loaded PORT:", process.env.PORT);