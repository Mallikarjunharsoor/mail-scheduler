import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';
import { EmailJob } from './models/EmailJob.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.ETHEREAL_USER && process.env.ETHEREAL_PASS
    ? { user: process.env.ETHEREAL_USER, pass: process.env.ETHEREAL_PASS }
    : undefined,
});


export async function sendEmail(job: EmailJob) {
  try {
    console.log("Sending email to:", job.recipient || job.to.join(","));

    const info = await transporter.sendMail({
      from: job.from,
      to: job.recipient || job.to.join(","),
      subject: job.subject,
      text: job.body,
      html: `<div>${job.body.replace(/\n/g, "<br/>")}</div>`,
    });
    await transporter.verify();

    console.log("Email sent!");
    console.log(info);

    return info;
  } catch (err) {
    console.error("MAIL ERROR:");
    console.error(err);
    throw err;
  }
}
