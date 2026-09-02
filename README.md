# Lead Distribution Platform - Frontend

## Overview

Frontend for the **Lead Distribution Platform** exam. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

This app provides the admin dashboard and the public lead form. 

## Tech Stack

- Next.js 16 (App Router), React 19
- TypeScript
- Tailwind CSS v4
- Zod v4
- Server Actions (mutations) and server components (data fetching)

## How to clone the repository

```bash
git clone <repo-url> leads-frontend
cd leads-frontend
```

## How to install dependencies

```bash
npm install
```

## How to set environment variables

Copy the sample file and fill in real values (never commit `.env`):

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `API_BASE_URL` | Base URL of the backend API, e.g. `http://localhost:4000/api` |

> The backend must be running and reachable at `API_BASE_URL`. On the VPS the
> backend is not publicly exposed, so set this to the **internal** backend URL
> (e.g. `http://127.0.0.1:4000/api`).

## How to set up the database

The database is managed by the backend (Prisma and MySQL). Set it up by following
the `leads-backend` README before running this app.

## How to run migrations or initialize tables

Run these in the backend repository:

```bash
npx prisma migrate dev     # development
npx prisma migrate deploy  # production
```

## How to start and restart the app

```bash
# Development
npm run dev
# -> http://localhost:3000

# Production
npm run build
npm start

# Restart under PM2
pm2 restart leads-frontend
```

## How to check logs

```bash
pm2 logs leads-frontend
```

## How to access the deployed app

- **Frontend:** `http://<VPS_IP>:<FRONTEND_PORT>`
- **Backend API:** runs on the internal backend port - not publicly exposed
- **Public form:** `http://<VPS_IP>:<FRONTEND_PORT>/<form-slug>`

## Pages

| Path | Access | Description |
| --- | --- | --- |
| `/login` | public | Admin login |
| `/dashboard` | admin | Overview of leads, brokers, distributions |
| `/brokers` | admin | List brokers - activate/deactivate |
| `/brokers/new` | admin | Create a broker |
| `/brokers/[id]/edit` | admin | Edit a broker |
| `/brokers/[id]` | admin | Broker details - leads received |
| `/forms` | admin | Create/view the single lead form |
| `/distributions` | admin | Create/view the single distribution |
| `/distributions/[id]` | admin | Distribution detail - broker % - lead history |
| `/leads` | admin | All leads and manual assign for unsent leads |
| `/[slug]` | public | Public lead form (e.g. `/lead-registration`) |

Admin routes are protected by a route guard (`proxy.ts`) that checks for the `auth_token` cookie. Public form pages are open.

## Test Notes

Manual smoke test (requires the backend running):

1. Open `/login` and sign in as the seeded admin.
2. Create a couple of brokers (`/brokers/new`) with timezone, hours, working
   days, and daily cap.
3. Visit `/distributions` before a form exists and confirm it shows
   **“Oops, please create a form first.”**
4. Create the single form (`/forms`).
5. Confirm a second form cannot be created.
6. Create the distribution and set broker percentages (must sum to 100).
7. Confirm a second distribution cannot be created.
8. Open the public form at `/<form-slug>` and submit a lead.
9. Confirm the lead appears in `/leads` with its IP address, and in the
   broker view and Distribution Detail page.
10. Submit the same email again and confirm it is marked `duplicate`.
11. Set a broker to closed hours / daily cap and confirm it is skipped (lead
    becomes `unsent`), then manually assign it from `/leads`.

> **Security:** check the `.env.example` for the `.env` references.
