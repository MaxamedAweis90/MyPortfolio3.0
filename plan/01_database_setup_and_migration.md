# Phase 1: Database Setup & Data Migration

## Context & Tech Stack

- Framework: Next.js 15.5.x (App Router)
- Database: MongoDB Atlas (`ugaas`, user: `maxamedaweys90_db_user`, database: `myportfolio`)
- ORM/ODM: Mongoose 8.x + Native MongoClient (for Better Auth)

## Deliverables

1. `src/app/lib/db.ts`: Cached global Mongoose connection for Next.js hot reload safety.
2. `src/app/models/Project.ts`: Schema mirroring `portfolioData.ts` (projects).
3. `src/app/models/Experience.ts`: Schema for career, education, and certifications.
4. `src/app/models/Certificate.ts`: Schema for standalone certificates.
5. `src/app/models/Inquiry.ts`: Schema storing leads submitted from `Contact.tsx`.
6. `scripts/seed-database.ts`: Migration script importing existing static data into MongoDB.
