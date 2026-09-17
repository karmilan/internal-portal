# Internal Portal

A small authenticated internal portal. It provides secure login/logout, a protected portal, and an end-to-end announcements workflow backed by PostgreSQL.

## Overview

Users authenticate with email and password, then can view and create announcements. Authentication is server-controlled with a short-lived JWT stored in an HttpOnly cookie. Announcements persist in the database and are returned newest-first.

## Features

- Secure login and logout
- Protected `/portal` page
- Protected announcement API
- Create and view announcements
- PostgreSQL persistence through Prisma
- Server-side and client-side validation
- Loading, empty, validation, error, success, and disabled-submit states
- Responsive UI

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS
- **Backend:** Next.js Route Handlers, Zod, `jose` JWTs, `bcryptjs` password verification
- **Database:** PostgreSQL, Prisma ORM
- **Tooling:** npm, ESLint, Prisma CLI

## Getting Started

Requirements: Node.js, npm, and a PostgreSQL database. Neon works as the hosted PostgreSQL provider.

```bash
npm install
```

Create `.env.local` as described below, then initialize and seed the database:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/login`.

## Environment Variables

Create `.env.local` with values for your environment:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-long-random-secret"
```

- `DATABASE_URL` is used by Prisma and the PostgreSQL adapter.
- `JWT_SECRET` signs and verifies authentication JWTs.

`.env`, `.env.local`, and other local environment files must not be committed. [`.env.example`](.env.example) contains the required variable names without credentials.

## Database Setup

Prisma manages the PostgreSQL schema and migrations. The configured migration command is:

```bash
npm run prisma:migrate
```

The seed command creates the demo user and two sample announcements. It is idempotent for those sample records:

```bash
npm run db:seed
```

The schema contains `User` and `Announcement` models. Each announcement belongs to its author, and list queries order announcements by `createdAt` descending.

## Demo Credentials

```text
Email:    demo@example.com
Password: Demo@12345
```

## Key Decisions

- **Next.js for frontend and backend:** App Router pages and Route Handlers keep the small app in one deployable application.
- **Announcements as the feature slice:** Login, protected APIs, validation, persistence, and create/view UI demonstrate a complete full-stack workflow without unfinished extra sections.
- **PostgreSQL and Prisma:** Relational user/announcement data fits PostgreSQL, while Prisma provides typed queries and straightforward schema management.
- **HttpOnly cookie authentication:** Client-side JavaScript cannot read the JWT, keeping session verification on the server.
- **Local React state:** The UI has limited local interaction state, so Redux/Zustand would add complexity without solving a current problem.


## Running Checks

```bash
npm run build
```