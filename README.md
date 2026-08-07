# Mail Scheduler

A full-stack Mail Scheduler application built with **React, TypeScript, Express, MySQL, Redis, BullMQ, TypeORM, JWT Authentication, Google OAuth, and Nodemailer**.

The application allows authenticated users to schedule emails for future delivery, monitor scheduled emails, and view successfully sent emails through a modern dashboard.

---

# Features

## Backend

* User Authentication (JWT)
* Google OAuth Login
* Schedule emails for future delivery
* Persistent email storage using MySQL
* BullMQ job queue
* Redis-based queue management
* Automatic retry for failed jobs
* Hourly email rate limiting
* Configurable delay between emails
* Concurrent email processing using BullMQ workers
* Email status tracking (Scheduled, Sent, Failed)
* REST API architecture
* TypeORM ORM
* Zod request validation

---

## Frontend

* Secure Login
* Google Login
* Dashboard
* Compose Email
* Schedule Emails
* View Scheduled Emails
* View Sent Emails
* Responsive Sidebar Navigation
* Protected Routes
* Tailwind CSS UI
* Modern Responsive Design

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios

## Backend

* Node.js
* Express.js
* TypeScript
* TypeORM
* MySQL
* Redis
* BullMQ
* Nodemailer
* JWT
* Google OAuth
* Zod

---

# Project Structure

```text
mailScheduler/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── models/
│   ├── auth/
│   ├── mailer/
│   └── package.json
│
├── docker-compose.yml
├── package-lock.json
└── README.md
```

---

# How to Run the Backend

## 1. Install Dependencies

```bash
cd backend
npm install
```

## 2. Start MySQL

Ensure MySQL Server is running.

Create a database named:

```sql
mail_scheduler
```

---

## 3. Start Redis

Run Redis locally.

Example:

```bash
redis-server
```

---

## 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Example:

```env
PORT=4000

DATABASE_URL=mysql://root:password@localhost:3306/mail_scheduler

REDIS_URL=redis://127.0.0.1:6379

JWT_SECRET=yourSecret

ETHEREAL_USER=your_ethereal_username

ETHEREAL_PASS=your_ethereal_password

SMTP_HOST=smtp.ethereal.email

SMTP_PORT=587

SMTP_SECURE=false

GOOGLE_CLIENT_ID=your_client_id

GOOGLE_CLIENT_SECRET=your_client_secret

GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback

FRONTEND_URL=http://localhost:5173
```

---

## 5. Start Backend

```bash
npm run dev
```

The backend starts at

```
http://localhost:4000
```

---

# How to Run the Frontend

Install dependencies

```bash
cd frontend
npm install
```

Run

```bash
npm run dev
```

The frontend starts at

```
http://localhost:5173
```

---

# Setting Up Ethereal Email

1. Create an Ethereal Email account.
2. Copy the generated username and password.
3. Update the backend `.env` file with:

```env
ETHEREAL_USER=your_username
ETHEREAL_PASS=your_password
```

4. Restart the backend server.

The application uses Nodemailer to send emails through Ethereal SMTP for testing purposes.

---

# Architecture Overview

```
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
```

---

# How Scheduling Works

1. User logs in.
2. User composes an email.
3. Backend validates the request.
4. Email details are stored in MySQL.
5. A BullMQ job is created.
6. Redis stores the queue.
7. At the scheduled time, the BullMQ worker processes the job.
8. Nodemailer sends the email.
9. The email status is updated to **Sent** or **Failed**.

---

# Persistence on Restart

Before scheduling an email, every email is stored in the MySQL database.

BullMQ uses Redis to manage queued jobs.

If the server is restarted, queued jobs remain available and are processed once the backend and Redis are running again.

---

# Rate Limiting

The application implements hourly email rate limiting using Redis.

Each sender has an hourly quota.

When the limit is reached, remaining emails are delayed until the next available time window.

---

# Concurrency

BullMQ workers process multiple email jobs concurrently.

Worker concurrency can be configured using:

```env
WORKER_CONCURRENCY=5
```

This improves throughput while maintaining queue reliability.


# Backend Features Mapping

| Scheduler        
| Persistence      
| Rate Limiting    
| Concurrency      
| Authentication   
| Queue Processing 
| Retry Mechanism  

---

# Frontend Features Mapping

| Login            
| Google Login     
| Dashboard        
| Compose Email    
| Scheduled Emails 
| Sent Emails      
| Responsive UI    
| Protected Routes 

---

# Assumptions

* Redis is running before the backend starts.
* MySQL is available locally.
* Ethereal Email is used for SMTP testing.
* Google OAuth credentials are configured correctly.

---

# Trade-offs

* Ethereal Email is used instead of a production SMTP provider.
* Database synchronization is enabled for development.
* Local MySQL and Redis are used during development instead of managed cloud services.

---

# Future Improvements

* Email templates
* Attachments
* Email analytics
* Admin dashboard
* Pagination
* Search & Filters
* Docker deployment
* Kubernetes deployment
* Production SMTP integration
* Background monitoring dashboard

---

# Author

Mallikarjun

Developed as part of the Mail Scheduler Assignment using React, Express, BullMQ, Redis, MySQL, TypeScript, and Nodemailer.
