# ONB Mail Scheduler

Full-stack email scheduling assignment built with React + TypeScript, Express + TypeScript, PostgreSQL, Redis, BullMQ, Nodemailer/Ethereal, and Google OAuth.

## Run locally

1. Start the infrastructure: `docker compose up -d postgres redis`
2. Copy `backend/.env.example` to `backend/.env`, then add Google OAuth and Ethereal credentials.
3. In one terminal: `cd backend; npm install; npm run dev`
4. In a second terminal: `cd frontend; npm install; npm run dev`
5. Open `http://localhost:5173` and use Google sign-in.

Google OAuth must have `http://localhost:4000/api/auth/google/callback` registered as an authorized redirect URI. Create a free Ethereal test inbox at https://ethereal.email/create and add the resulting credentials to the backend environment file.

## Architecture

The API turns every recipient in a campaign into an individual durable `EmailJob` database row. It assigns a unique BullMQ `jobId` and puts a delayed job in Redis for each row. BullMQ's delayed job data plus the relational data survives API/worker restarts. The worker first checks that the row is still `scheduled`; after it succeeds it marks it `sent`, making duplicated delivery attempts harmless.

Each worker uses configurable `WORKER_CONCURRENCY`. The Redis `INCR` counter is keyed by sender and UTC hourly window, so it is atomic across workers and instances. If the configured limit is full, the BullMQ job is moved to the next hour rather than being discarded. Per-recipient jobs are initially spaced using the selected delay; this preserves campaign order while allowing safe worker throughput for different campaigns.

For a large campaign (1000+ recipients), the API writes jobs one at a time to avoid a giant in-memory schedule, while Redis retains the delayed queue. Production deployments should use PostgreSQL (`DATABASE_URL`) rather than the SQLite development fallback and run the API and worker as separate replicas if more throughput is needed.

## API

- `POST /api/schedule` schedules an email per recipient.
- `GET /api/scheduled` lists queue entries for the authenticated user.
- `GET /api/sent` lists sent and failed messages.
- `GET /api/health` verifies API + Redis health.

## Important trade-offs

- Ethereal is intentionally a test SMTP provider. It is not a delivery service.
- The OAuth access token here is a compact demo token; replace it with signed, expiring HTTP-only sessions before production.
- `synchronize` is convenient for the assignment; use migrations in production.
