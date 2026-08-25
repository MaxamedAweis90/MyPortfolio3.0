# Phase 2: Authentication & Route Protection (Better Auth)

## Context & Architecture

- Framework: Next.js 15.5.x App Router
- Auth: Better Auth (`better-auth`, `@better-auth/mongo-adapter`)
- Database Connection: Native MongoClient singleton (`src/ugaas/lib/mongodb.ts`)
- Target Endpoints: `/api/auth/[...all]`
- Protected Routes: `/admin/*` (excluding `/admin/login`)

## Deliverables

1. `src/ugaas/lib/auth.ts`: Server-side Better Auth instance configured with MongoDB adapter & email/password authentication.
2. `src/app/api/auth/[...all]/route.ts`: Catch-all route handler for Better Auth.
3. `src/ugaas/lib/auth-client.ts`: Client-side React auth helper (`createAuthClient`).
4. `src/middleware.ts`: Edge/Node-safe middleware protecting all `/admin` routes.
5. `scripts/seed-admin.ts`: CLI script to provision the primary admin account.
