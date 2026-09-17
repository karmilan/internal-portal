<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

Project Overview

This is a small internal portal.

Stack

Next.js (App Router)

TypeScript

React

Tailwind CSS

Next.js Route Handlers for backend APIs

Prisma ORM

Neon PostgreSQL

Zod for request/input validation

JWT authentication

Current Scope

The application should remain intentionally small.

Core functionality:

User login

User logout

Protected portal

Announcements section

Create announcements

View announcements

Do not add unrelated features unless explicitly requested.


General Rules

1. Keep the implementation simple

Prefer the simplest solution that satisfies the requirement.

Do not introduce unnecessary:

Abstractions

Libraries

Design patterns

Services

State management libraries

Database tables

API endpoints

Avoid over-engineering a small feature.

2. TypeScript

Use TypeScript throughout the application.

Avoid any.

Prefer explicit types for API contracts and important data structures.

Use meaningful names.

Do not suppress TypeScript errors without a valid reason.

Keep types close to where they are used unless they are shared across multiple modules.

3. Next.js

Use the App Router.

Follow Next.js conventions for:

app/

Route Handlers

Server Components

Client Components

layouts

loading/error states

Prefer Server Components by default.

Use "use client" only when client-side behavior is actually required.

Do not turn entire pages into Client Components unnecessarily.

Project Structure

Use clear separation of responsibilities.


Components

Components should have one clear responsibility.

Examples:

LoginForm → login UI and interaction

AnnouncementForm → announcement creation form

AnnouncementCard → display one announcement

AnnouncementList → display announcement collection

Header → portal header/navigation

LogoutButton → logout interaction

Avoid large components containing unrelated UI, API calls, database logic, and business rules.

Server vs Client Components

Prefer Server Components.

Use Client Components when the component requires:

useState

useEffect

browser APIs

event-driven interaction

client-side form behavior

Do not add "use client" just because a component displays data.

Database access must never happen directly from a Client Component.

API Rules

Use Next.js Route Handlers for backend APIs.

Expected API structure:

/api/auth/login
/api/auth/logout
/api/auth/me

/api/announcements

API responsibilities:

Request
  ↓
Authentication
  ↓
Validation
  ↓
Business logic
  ↓
Database
  ↓
Response

Do not put large amounts of business logic directly inside Route Handlers.

Use the service layer when business logic becomes meaningful or reusable.

Authentication

Use JWT authentication.

Authentication must be enforced server-side.

Requirements:

Passwords must be hashed.

Never store plain-text passwords.

Authentication cookies must be HttpOnly.

Use Secure cookies in production.

Use an appropriate SameSite policy.

Do not store authentication credentials in localStorage.

Do not trust user identity supplied by the client.

API routes must independently verify authentication.

The authenticated user should come from the server-side session.

Authorization

The current app does not require roles or permissions.

Do not introduce RBAC unless explicitly requested.

All authenticated users can:

View announcements

Create announcements


Database

Use Prisma with Neon PostgreSQL.

Database credentials must come from environment variables.

Never hard-code:

database URLs

passwords

API keys

session secrets

other credentials

Use:

DATABASE_URL

in the environment.


Prisma

Use Prisma for all database access.

Do not write raw SQL unless there is a clear technical reason.


Avoid creating multiple Prisma client instances during development.

Database schema should remain minimal.


Do not create additional models without a clear requirement.

Database Relationships

Announcement belongs to User.

User can have many Announcement records.

The authenticated user should be used as the announcement author.

Announcements should be retrieved newest-first unless a different ordering is explicitly required.


Validation

Use Zod for validating external input.

Validate:

Login input

Announcement creation input

Any future API input

Never assume client-side validation is sufficient.

Server-side validation is mandatory for API input.

Return appropriate HTTP status codes for:

Validation errors

Authentication errors

Authorization errors

Not found

Unexpected server errors

Do not expose sensitive internal errors to clients.

Error Handling

Handle expected errors explicitly.

UI should provide useful feedback for:

Invalid login

Failed API requests

Validation errors

Empty announcement list

Failed announcement creation

Avoid exposing:

database errors

stack traces

secrets

internal implementation details

to users.

Log server-side errors when appropriate.

Do not leave unnecessary console.log statements in production code.

State Management

Do not introduce global state management unless necessary.

Use:

React state for local UI state

Server Components where appropriate

fetch for simple server communication

If server-state complexity grows, TanStack Query may be introduced deliberately.

Do not introduce Zustand, Redux, or another global state library just for this small app.

Forms

Forms should:

Validate required fields

Show useful validation errors

Disable submission while processing

Prevent accidental duplicate submissions

Handle API errors

Provide clear success/failure feedback

Use controlled state or an appropriate form library only when it provides real value.

Do not add a form library unnecessarily.

UI / UX

Keep the UI clean, professional, and responsive.

Prioritize:

readability

consistent spacing

clear hierarchy

accessible controls

useful error messages

loading states

empty states

responsive behavior

Do not spend excessive time on animations or visual effects.


State Management

Do not introduce global state management unless necessary.

Use:

React state for local UI state

Server Components where appropriate

fetch for simple server communication

If server-state complexity grows, TanStack Query may be introduced deliberately.

Do not introduce Zustand, Redux, or another global state library just for this small app.

Forms

Forms should:

Validate required fields

Show useful validation errors

Disable submission while processing

Prevent accidental duplicate submissions

Handle API errors

Provide clear success/failure feedback

Use controlled state or an appropriate form library only when it provides real value.

Do not add a form library unnecessarily.

UI / UX

Keep the UI clean, professional, and responsive.

Prioritize:

readability

consistent spacing

clear hierarchy

accessible controls

useful error messages

loading states

empty states

responsive behavior

Do not spend excessive time on animations or visual effects.

The app prioritizes engineering quality over visual complexity.

Accessibility

Use semantic HTML.

Ensure:

buttons are actual <button> elements

links are actual links

inputs have labels

form errors are understandable

interactive elements are keyboard accessible

sufficient visual hierarchy exists

Do not rely only on color to communicate an error or status.

API Responses

Keep API response structures consistent.

Successful requests should return predictable JSON.

Errors should contain a useful message without exposing sensitive implementation details.

Use appropriate HTTP status codes rather than returning 200 for every situation.

Security

Always consider:

authentication

authorization

input validation

password hashing

secure environment variables

SQL/ORM safety

sensitive error exposure

Never commit secrets.

Never disable security protections simply to make development easier.

Environment Variables

Use environment variables for configuration.

Required environment variables should be documented in .env.example.

Do not commit .env.


README

Keep the README concise but complete.

It should explain:

What the application does

Features

Technology stack

Setup instructions

Environment variables

Database setup

Seed/demo credentials

How to run the application

Architecture

Important design decisions

Trade-offs

Possible future improvements

The README should explain WHY important technical decisions were made, not just list technologies.



Definition of Done

A feature is complete when:

The requirement works end-to-end.

Authentication/security requirements are respected.

Input is validated.

Errors are handled.

Loading/empty states are handled where applicable.

Code is organized according to project responsibilities.

TypeScript/lint/build checks pass.

No secrets or debugging code are committed.

README documentation remains accurate.

Agent Behavior

When implementing a task:

Understand the existing code before modifying it.

Reuse existing utilities/components where appropriate.

Make the smallest clean change that satisfies the requirement.

Do not modify unrelated files.

Do not introduce dependencies without a reason.

Do not change the architecture unnecessarily.

Verify the implementation after making changes.

Explain important architectural decisions briefly when relevant.

When requirements are ambiguous, prefer the simplest approach that fits the app and document the decision in the README.

<!-- END:nextjs-agent-rules -->
