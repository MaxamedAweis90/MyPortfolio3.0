# TASK INSTRUCTIONS: CONVERT NEXT.JS MONOLITH TO TURBOREPO + PNPM MONOREPO

Act as a Principal Software Architect. Your task is to refactor this Next.js project (`MyPortfolio3.0`) into a high-performance **pnpm + Turborepo monorepo**. 

Follow the exact sequence defined below. After completing EACH major phase, report the execution status, show the modified file tree, and ask for verification before proceeding.

---

## CONTEXT & TARGET ARCHITECTURE

The repository currently combines two apps (`apps/web` for public portfolio, `apps/admin` for Ugaas admin dashboard) and shared database/UI assets into a single Next.js structure. We need to split them into independent, modular workspace apps and packages:

```text
MyPortfolio3.0/
├── apps/
│   ├── web/                     # Public Portfolio Next.js App
│   └── admin/                   # Ugaas Admin Dashboard Next.js App
├── packages/
│   ├── database/                # Shared Mongoose schemas & DB connectors
│   ├── ui/                      # Shared Shadcn / UI primitives
│   ├── config/                  # Shared Tailwind, ESLint, TS configs
│   └── types/                   # Shared TypeScript interfaces
├── scripts/                     # Seeders & CLI utility scripts
├── tests/                       # Playwright integration suite
├── pnpm-workspace.yaml
├── turbo.json
└── package.json                 # Workspace Root
```

---

## PHASE 1: WORKSPACE INITIALIZATION & CLEANUP
Clean workspace pollution:
- Move `plan/plan/03b_ui_screen_implementation.md` to `plan/03b_ui_screen_implementation.md` and delete the redundant `plan/plan/` directory.
- Untrack `public/uploads/*` from Git while keeping `.gitkeep`.

Create Root Configuration Files:
- Generate `pnpm-workspace.yaml`:
  ```yaml
  packages:
    - "apps/*"
    - "packages/*"
  ```
- Generate `turbo.json`:
  ```json
  {
    "$schema": "https://turbo.build/schema.json",
    "tasks": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": [".next/**", "!-next/cache/**", "dist/**"]
      },
      "lint": {
        "dependsOn": ["^lint"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      }
    }
  }
  ```
- Update Root `package.json` to define pnpm engine, script commands (`turbo run build`, `turbo run dev`), and root workspace dependencies (`turbo`, `typescript`).

---

## PHASE 2: PACKAGES EXTRACTION (packages/*)
Extract `@portfolio/database`:
- Create `packages/database/package.json` and `packages/database/src/index.ts`.
- Move Mongoose models (`AuditLog.ts`, `Certificate.ts`, `Experience.ts`, `Inquiry.ts`, `Project.ts`, `ProjectCategory.ts`, `Settings.ts`, `VisitorAnalytics.ts`) and DB connectors (`db.ts`, `mongodb.ts`) from `src/ugaas/models` and `src/app/lib` into `packages/database/src/`.
- Re-export all models and connection handlers via `index.ts`.

Extract `@portfolio/ui`:
- Create `packages/ui/package.json`.
- Move UI primitives (`src/app/components/ui/*`) to `packages/ui/src/`.

Extract `@portfolio/types`:
- Move common TypeScript interfaces (`src/app/types/*` and `src/ugaas/types/*`) into `packages/types/src/`.

Extract `@portfolio/config`:
- Shared Tailwind, ESLint, and TypeScript configs.

---

## PHASE 3: APPLICATIONS MIGRATION (apps/*)
Setup `apps/web` (Public Portfolio):
- Create `apps/web` with its own `package.json`, `next.config.mjs`, and `tailwind.config.mjs`.
- Move public Next.js routes (`src/app/page.tsx`, `src/app/blog`, `src/app/work`, `src/app/Gallery`, `src/app/experience`) and components (`src/app/components/sections`, `src/app/components/BlurText.tsx`, etc.) to `apps/web/src/`.
- Add workspace dependencies (`"@portfolio/database": "workspace:*"`, `"@portfolio/ui": "workspace:*"`).

Setup `apps/admin` (Ugaas Dashboard):
- Create `apps/admin` with its own `package.json` and Next.js configuration.
- Move `/ugaas` routes (`src/app/ugaas/*`) and API endpoints (`src/app/api/ugaas/*`) into `apps/admin/src/app/`.
- Move admin-specific components (`src/app/ugaas/components/*`) into `apps/admin/src/components/`.

---

## PHASE 4: IMPORTS REFACTORING & VERIFICATION
Refactor Import Paths Across the Workspace:
- Update all backend and model imports across `apps/web` and `apps/admin` from relative paths (e.g., `../../ugaas/models/Project`) to the clean workspace package:
  ```typescript
  import { connectDB, Project, Experience } from "@portfolio/database";
  import { Button, Dialog, Card } from "@portfolio/ui";
  ```
Type Checking & Dependency Installation:
- Execute `pnpm install` at the workspace root.
- Run `pnpm turbo run build` to ensure all packages and applications compile without TypeScript or bundler errors.

---

## EXECUTION CONSTRAINTS
- **Do not delete core logic or UI components**: Every component, route, and CSS file must be accounted for and relocated safely.
- **Preserve environment variable setup**: Both `apps/web` and `apps/admin` must reference `.env.local` or environment definitions cleanly.
- **Step-by-step execution**: Perform modifications step-by-step. Stop after Phase 1 and request confirmation to proceed to Phase 2.
