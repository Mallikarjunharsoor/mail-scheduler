Mail Scheduler

A full-stack Mail Scheduler application built with React, TypeScript, Express, MySQL, Redis, BullMQ, TypeORM, JWT Authentication, Google OAuth, and Nodemailer.

The application allows authenticated users to schedule emails for future delivery, monitor scheduled emails, and view successfully sent emails through a modern dashboard.

Features
Backend
User Authentication (JWT)
Google OAuth Login
Schedule emails for future delivery
Persistent email storage using MySQL
BullMQ job queue
Redis-based queue management
Automatic retry for failed jobs
Hourly email rate limiting
Configurable delay between emails
Concurrent email processing using BullMQ workers
Email status tracking (Scheduled, Sent, Failed)
REST API architecture
TypeORM ORM
Zod request validation

Frontend
Secure Login
Google Login
Dashboard
Compose Email
Schedule Emails
View Scheduled Emails
View Sent Emails
Responsive Sidebar Navigation
Protected Routes
Tailwind CSS UI
Modern Responsive Design

Technology Stack
Frontend
React
TypeScript
Vite
Tailwind CSS
React Router
Axios
Backend
Node.js
Express.js
TypeScript
TypeORM
MySQL
Redis
BullMQ
Nodemailer
JWT
Google OAuth

Project Structure
mailScheduler/
 
    frontend/
        src/
        public/
        package.json
 
    backend/
        src/
        models/
        auth/
        mailer/
        package.json
 
    docker-compose.yml
    package-lock.json
    README.md


How to Run the Backend
1. Install Dependencies
cd backend
npm install
2. Start MySQL

Ensure MySQL Server is running.

Create a database named:

mail_scheduler
3. Start Redis

Run Redis locally.
4. Configure Environment Variables

Create a .env file inside the backend folder.
5. Start Backend
npm run dev

The backend starts
How to Run the Frontend

Install dependencies

cd frontend
npm install

Run

npm run dev

The frontend starts


Setting Up Ethereal Email
Create an Ethereal Email account.
Copy the generated username and password.


Architecture Overview
React Frontend
       │
       │ REST API
       ▼
Express Backend
       │
       ├──────── JWT Authentication
       │
       ├──────── MySQL (Persistence)
       │
       ├──────── Redis
       │
       ▼
BullMQ Queue
       │
       ▼
Worker
       │
       ▼
Nodemailer
       │
       ▼
SMTP Server
How Scheduling Works
User logs in.
User composes an email.
Backend validates the request.
Email details are stored in MySQL.
A BullMQ job is created.
Redis stores the queue.
At the scheduled time, the BullMQ worker processes the job.
Nodemailer sends the email.
The email status is updated to Sent or Failed.
Persistence on Restart

Before scheduling an email, every email is stored in the MySQL database.

BullMQ uses Redis to manage queued jobs.

If the server is restarted, queued jobs remain available and are processed once the backend and Redis are running again.