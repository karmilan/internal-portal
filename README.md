# Internal Portal

Small Next.js internal portal with server-side JWT authentication.

## Authentication

Authentication uses `bcryptjs` to verify the database `passwordHash`, `jose` to create and verify HS256 JWTs, and Prisma for database access. Tokens contain only the user ID (`sub`) and email, expire after one hour, and are stored in the `internal_portal_token` HttpOnly cookie. The cookie uses `SameSite=Lax`, applies to `/`, and is marked `Secure` in production.

Available endpoints:

- `POST /api/auth/login` validates `{ email, password }` and returns safe user data.
- `POST /api/auth/logout` clears the authentication cookie.
- `GET /api/auth/me` returns the authenticated user or `401 Unauthorized`.

The reusable server-only helpers are in `src/lib/auth.ts`:

- `getCurrentUser()` — Server Components (reads the HttpOnly cookie, verifies JWT, loads the user from Prisma).
- `getAuthenticatedUser(request)` — Route Handlers.
- `requireAuth(request)` — Route Handlers; returns the user or a `401` JSON `{ "error": "Unauthorized" }` (never redirects).

`/portal` is protected in its Server Component: unauthenticated visitors are redirected to `/login` on the server. `/login` redirects authenticated users to `/portal`. Protected APIs (including `/api/announcements` and `/api/auth/me`) authenticate on every request and return `401` when the cookie is missing, invalid, expired, or refers to a deleted user. Browser pages redirect; APIs do not.

JWT secrets and database credentials are provided through environment variables and are never returned to clients. `.env` and local environment files are ignored by git.

## Announcements API

Authenticated endpoints (same cookie/JWT as other protected APIs):

- `GET /api/announcements` — lists announcements newest-first (`createdAt` descending). Returns `{ "announcements": [...] }`; each item includes safe `author` `{ id, name }` only.
- `POST /api/announcements` — body `{ "title", "content" }` (trimmed server-side). Title 1–150 characters, content 1–5000 characters. Returns `201` with `{ "announcement": ... }`. `authorId` is always the authenticated user; client-supplied `authorId` is ignored.

Validation failures return `400` with `{ "error": "Validation failed", "details": { ... } }`. Unauthenticated requests return `401`. Unexpected errors return generic `500` messages without internal details. Pagination is intentionally omitted for this small assignment.

Business logic lives in `src/services/announcement.service.ts`; Zod schemas in `src/lib/announcements.validation.ts`.

The `/portal` page loads announcements via `GET /api/announcements` and creates them with `POST /api/announcements` (HttpOnly cookie sent automatically). UI components live under `src/components/announcements/`; fetch helpers in `src/lib/api/announcements.ts`. New posts are prepended from the create response without a full reload. Client validation reuses the same Zod limits as the API; `401` responses redirect to `/login`.

## Setup

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` and a strong `JWT_SECRET`.
2. Install dependencies with `npm install`.
3. Generate the Prisma client with `npm run prisma:generate`.
4. Apply the schema to your database (for example `npm run prisma:migrate` or `npx prisma db push`).
5. Seed demo data with `npm run db:seed`.
6. Run the development server with `npm run dev`.

Run `npm run lint` and `npm run build` before deployment.

## Demo account

For local and take-home testing only:

- **Email:** `demo@example.com`
- **Password:** `Demo@12345`

`npm run db:seed` creates this user (bcrypt-hashed password) and two sample announcements authored by Demo User. The seed is idempotent: re-running it does not duplicate the user or the sample announcements. User-created announcements from the app are left unchanged.
