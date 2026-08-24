# AGENT.md — Developer & AI Agent Guide

Welcome to the **MyPortfolio3.0** codebase. This document serves as a comprehensive architectural and operational handbook for AI agents and developers working on this project.

---

## 1. Project Overview & Technology Stack

**MyPortfolio3.0** is a modern, high-performance personal developer portfolio, administrative backend, and project showcase built for **Mohamed Aweys (Eng_Aweis)**, a Software Engineer and Full-Stack Developer.

### Core Technologies
- **Framework:** [Next.js](https://nextjs.org/) 15.5.x (App Router, Turbopack support)
- **UI Library:** [React](https://react.dev/) 18.3.x
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5.6.x (Strict mode)
- **Database & Backend Layer (`src/ugaas/`):**
  - [MongoDB Atlas](https://www.mongodb.com/atlas) (`cluster: ugaas`, `database: myportfolio`)
  - [Mongoose](https://mongoosejs.com/) 8.12.x (ODM with cached singleton connection pattern for Next.js HMR)
  - Native [MongoDB](https://www.mongodb.com/) Driver 6.13.x (MongoClient singleton for auth/adapters)
  - [TSX](https://github.com/privatenumber/tsx) (TypeScript execute for database seeding & CLI tools)
- **Styling:**
  - [Tailwind CSS](https://tailwindcss.com/) 3.4.x with PostCSS
  - [DaisyUI](https://daisyui.com/) 4.12.x component plugin
  - Dynamic CSS Variables & View Transition API theming
  - Scoped CSS stylesheets in `src/app/styles/`
- **Animations & Effects:**
  - [Framer Motion](https://www.framer.com/motion/) 12.10.x (Scroll reveals, layout transitions, keyframes)
  - [GSAP](https://greensock.com/gsap/) 3.13.x (Custom magnetic target cursor)
  - [Swiper](https://swiperjs.com/) 11.2.x (Interactive carousels)
  - [React Player](https://github.com/cookpete/react-player) (Embedded YouTube video playback)
  - [React Intersection Observer](https://github.com/researchgate/react-intersection-observer)
- **Icons & Media:**
  - `react-icons` (Si, Ri, Fa, Bi, Pi) & `lucide-react`
  - Remix Icons CDN
- **Email & Communications:**
  - [Resend](https://resend.com/) SDK (Server-side transactional email delivery)
  - [Nodemailer](https://nodemailer.com/)
  - [React Toastify](https://fkhadra.github.io/react-toastify/) (User feedback toasts)
- **Typography:**
  - `next/font/google` (`Geist`, `Geist_Mono`, `Outfit`)

---

## 2. Directory Structure

```
MyPortfolio3.0/
├── public/                     # Static assets (images, icons, resume.pdf, og-image)
├── scripts/
│   └── seed-database.ts        # Database migration script (populates MongoDB from static data)
├── src/
│   ├── ugaas/                  # 🛡️ Dedicated Backend & Database Layer (@ugaas/*)
│   │   ├── lib/
│   │   │   ├── db.ts           # Mongoose singleton connection with global HMR cache
│   │   │   └── mongodb.ts      # Native MongoClient singleton promise
│   │   └── models/
│   │       ├── Project.ts      # Mongoose Project schema & interface
│   │       ├── Experience.ts   # Mongoose Experience schema (career, education, certifications)
│   │       ├── Certificate.ts  # Mongoose Certificate schema & interface
│   │       ├── Inquiry.ts      # Mongoose Inquiry schema (Contact form submissions)
│   │       └── index.ts        # Barrel export for all models
│   │
│   └── app/                    # 🌐 Frontend & App Router (@/*)
│       ├── (routes)/
│       │   ├── layout.tsx       # Root layout (Fonts, SEO metadata, LayoutWrapper)
│       │   ├── template.tsx     # Route transition wrapper (scroll-to-top & motion)
│       │   ├── page.tsx         # Home page (Lazy-loaded single-page sections)
│       │   ├── about/           # /about page (Bio, YouTube player, certificates)
│       │   │   ├── CertificateCard.tsx
│       │   │   ├── LanguageSwiper.tsx
│       │   │   ├── certificates.tsx
│       │   │   └── page.tsx
│       │   ├── experience/      # /experience page (Full career & education archive)
│       │   │   └── page.tsx
│       │   ├── work/            # /work catalogue and dynamic details
│       │   │   ├── ClientProjectGrid.tsx
│       │   │   ├── page.tsx
│       │   │   └── [slug]/
│       │   │       ├── AutoDownload.tsx
│       │   │       └── page.tsx # Dynamic project detail (SSG)
│       │   ├── blog/            # /blog page (WIP)
│       │   ├── Gallery/         # /Gallery page (WIP)
│       │   └── admin/           # /admin page (WIP)
│       │
│       ├── api/                 # Next.js Route Handlers
│       │   ├── project-request/
│       │   │   └── route.ts     # POST: Handles project inquiry email dispatch
│       │   └── sanityLoadTools/
│       │       └── route.ts     # GET: Mock / disabled Sanity status
│       │
│       ├── components/          # Reusable UI components
│       │   ├── sections/        # Home page section components
│       │   │   ├── hero.tsx
│       │   │   ├── aboutSection.tsx
│       │   │   ├── skillsSection.tsx
│       │   │   ├── MyWorkSection.tsx
│       │   │   ├── experienceSection.tsx
│       │   │   ├── services.tsx
│       │   │   └── contact.tsx
│       │   ├── chatapp/
│       │   │   └── ChatWidget.tsx # Floating portal AI chat widget
│       │   ├── ui/
│       │   │   └── link-preview.tsx # Hover URL popup cards
│       │   ├── BlurText.tsx     # Animated text entrance component
│       │   ├── CustomCursor.tsx # Secondary cursor effect
│       │   ├── Footer.tsx       # Global footer with social links
│       │   ├── LayoutWrapper.tsx# Client root wrapper (Navbar, Footer, Cursor, Chat)
│       │   ├── Navbar.tsx       # Sticky navbar with ScrollSpy & theme toggle
│       │   ├── ProjectCard.tsx  # Project showcase card
│       │   ├── ScrollReveal.tsx # Intersection-based reveal component
│       │   ├── ScrollToTop.tsx  # Floating scroll-to-top button
│       │   ├── SocialBar.tsx    # Left fixed vertical social bar
│       │   ├── TargetCursor.tsx # GSAP magnetic target reticle cursor
│       │   ├── TextType.tsx     # Typewriter / cycling text effect
│       │   └── toolIcons.ts     # Dynamic icon mapper for project tech stacks
│       │
│       ├── data/                # Static data stores
│       │   ├── portfolioData.ts # Initial projects, certificates, categories
│       │   └── experienceData.ts# Initial career, education, and certifications
│       │
│       ├── lib/                 # App utility & re-export bridges
│       │   ├── db.ts            # Bridge -> re-exports @ugaas/lib/db
│       │   ├── mongodb.ts       # Bridge -> re-exports @ugaas/lib/mongodb
│       │   ├── queries.ts
│       │   └── utils.ts         # `cn` clsx helper
│       │
│       ├── models/              # App model re-export bridges
│       │   ├── Project.ts       # Bridge -> re-exports @ugaas/models/Project
│       │   ├── Experience.ts    # Bridge -> re-exports @ugaas/models/Experience
│       │   ├── Certificate.ts   # Bridge -> re-exports @ugaas/models/Certificate
│       │   ├── Inquiry.ts       # Bridge -> re-exports @ugaas/models/Inquiry
│       │   └── index.ts
│       │
│       ├── styles/              # Global and scoped CSS files
│       │   ├── globals.css      # Design tokens, theme variables, light-mode overrides
│       │   ├── hero.css
│       │   ├── about.css
│       │   ├── services.css
│       │   ├── socials.css
│       │   ├── menu.css
│       │   ├── TargetCursor.css
│       │   └── TextType.css
│       │
│       └── types/               # TypeScript interfaces & types
│           ├── portfolio.ts     # Frontend Project, Tool, Certificate types
│           └── sanity.ts
│
├── next.config.mjs              # Next.js image optimization settings
├── tailwind.config.mjs          # Tailwind theme color definitions & DaisyUI config
├── tsconfig.json                # TS config: `@/*` -> `./src/app/*`, `@ugaas/*` -> `./src/ugaas/*`
└── eslint.config.mjs            # ESLint flat config
```

---

## 3. Architecture & Backend Data Layer

### 3.1. Dedicated Backend Layer (`src/ugaas/`)
All database connections, ORM models, seed scripts, and backend-specific logic are encapsulated within `src/ugaas/`:
- **Path Mapping:** Imported via `@ugaas/lib/...` or `@ugaas/models/...`.
- **Bridge Support:** Re-exports in `src/app/lib/` and `src/app/models/` ensure that any standard `@/lib/db` or `@/models` imports resolve seamlessly.

### 3.2. MongoDB Connection Architecture (`src/ugaas/lib/db.ts`)
- Utilizes a **global singleton pattern** (`global.mongoose`) to cache active connections across Next.js Hot Module Replacement (HMR) cycles in development.
- In serverless environments, it prevents redundant handshakes and avoids connection pool exhaustion.
- Features automatic logging and connection error isolation.

### 3.3. Mongoose Schemas & Collections

| Model | Schema File | Collection | Description | Key Fields |
| :--- | :--- | :--- | :--- | :--- |
| **`Project`** | `src/ugaas/models/Project.ts` | `projects` | Portfolio projects | `title`, `slug` (unique, indexed), `category`, `desc`, `fullDesc`, `image`, `tools`, `liveUrl`, `playStoreUrl`, `appStoreUrl`, `isFeatured`, `order` |
| **`Experience`** | `src/ugaas/models/Experience.ts` | `experiences` | Career, education & certifications | `role`, `company`, `duration`, `badges`, `highlights`, `techStack`, `type` (`career` \| `education` \| `certification`), `order` |
| **`Certificate`** | `src/ugaas/models/Certificate.ts` | `certificates` | Standalone verified credentials | `title`, `issuer`, `code`, `link`, `image`, `category`, `order` |
| **`Inquiry`** | `src/ugaas/models/Inquiry.ts` | `inquiries` | Contact form inquiries | `projectName`, `name`, `email`, `phone`, `projectType`, `budget`, `deadline`, `message`, `status` (`unread` \| `read` \| `archived`) |

*All models are compiled with the Next.js hot-reload guard `mongoose.models.ModelName || mongoose.model('ModelName', Schema)`.*

### 3.4. Page Rendering & Optimization Strategy
1. **Lazy Loading on Home (`src/app/page.tsx`):**
   - The `Hero` section renders immediately (above-the-fold).
   - Below-the-fold sections (`AboutSection`, `SkillsSection`, `MyWorkSection`, `ExperienceSection`, `Services`, `Contact`) are dynamically imported with `next/dynamic` and minimum height placeholders.
2. **Static Site Generation (SSG) on Work Details (`/work/[slug]`):**
   - `generateStaticParams()` pre-renders all project detail pages at build time.
   - `generateMetadata()` generates custom SEO titles and OpenGraph tags dynamically per project.
3. **Smooth Page Transitions (`src/app/template.tsx`):**
   - Wraps every route in a Framer Motion `motion.div` (`opacity: 0, y: 20` -> `opacity: 1, y: 0`).
   - Automatically resets `window.scrollTo(0, 0)` on route changes.

---

## 4. State Management & Event Patterns

The application uses lightweight, decoupled client-side state without external store overhead:

### 4.1. Theming & Theme Toggle
- **Default Theme:** Dark mode (`mytheme` via DaisyUI / `:root` dark CSS variables).
- **Light Mode:** Triggered via `data-theme="light"` on `<html>`.
- **View Transitions API:** `Navbar.tsx` uses `document.startViewTransition()` with `data-theme-transition="to-dark" | "to-light"` for smooth circular clip-path transitions.
- **Persistence:** Stored in `localStorage.getItem("theme")`.
- **CSS Utility Overrides:** `src/app/styles/globals.css` explicitly maps `.bg-mainBg`, `.bg-surface`, `.text-primaryText`, `.text-mutedText`, and `.border-borderSubtle` under `[data-theme="light"]` using `!important` to prevent static Tailwind compile-time collisions.

### 4.2. Cross-Section Event Bus (`select-project-type`)
- **Sender:** `Hero` dropdown & `Services` cards dispatch a custom browser event:
  ```typescript
  window.dispatchEvent(
    new CustomEvent("select-project-type", {
      detail: {
        projectType: service.projectType,
        defaultTitle: service.defaultTitle,
        defaultMessage: service.defaultMessage,
      },
    })
  );
  ```
- **Receiver:** `Contact.tsx` listens for `"select-project-type"`, updates the multi-step form state with prefilled values, resets to Step 1, and focuses the inquiry flow.

### 4.3. Navigation & ScrollSpy
- `Navbar.tsx` tracks active sections (`hero`, `about`, `skills`, `work`, `experience`, `services`, `contact`) based on `window.scrollY` and element offsets.
- Handles hash routing (`/#about`, `/#work`) with automatic navbar offset compensation (`80px`).

---

## 5. API Route Handlers

### `POST /api/project-request` (`src/app/api/project-request/route.ts`)
- **Purpose:** Handles the submission of the multi-step project request form in `Contact.tsx`.
- **Required Env Variables:** `RESEND_API_KEY`, `EMAIL_RECEIVER`, `EMAIL_SENDER`.
- **Workflow:**
  1. Validates incoming JSON payload (`projectName`, `name`, `email`, `phone`, `projectType`, `budget`, `deadline`, `message`).
  2. Sends an HTML notification email to the site owner.
  3. Sends a branded auto-reply confirmation email to the client.
  4. Stores or logs inquiry record.
  5. Returns `{ success: true }` with status 200.

---

## 6. Conventions & Development Guidelines

When modifying or extending this codebase, adhere to the following standards:

### 6.1. Path Aliasing & Imports
- Use `@/*` for frontend app code (`import ProjectCard from "@/components/ProjectCard";`).
- Use `@ugaas/*` for backend, database, and model code (`import { Project } from "@ugaas/models";`, `import { connectToDatabase } from "@ugaas/lib/db";`).

### 6.2. Backend Placement Rule
- **All backend logic, database schemas, and connection utilities MUST be authored in `src/ugaas/`**.

### 6.3. Client vs. Server Components
- Next.js App Router defaults to Server Components.
- Add `"use client";` at the top of components that use hooks (`useState`, `useEffect`, `useRef`), Framer Motion, event listeners, or browser APIs.
- Keep route pages (`page.tsx`) as Server Components when possible for SEO and SSG metadata generation, delegating interactive UI to client sub-components.

### 6.4. Styling & Color Tokens
- Use semantic Tailwind classes mapped to CSS variables:
  - `bg-mainBg` (App background)
  - `bg-surface` (Card and modal surfaces)
  - `border-borderSubtle` (Borders and dividers)
  - `text-primaryText` (Headings and primary text)
  - `text-mutedText` (Secondary / body descriptions)
  - `text-brandAccent` (`#0B82EC` - primary brand blue)
  - `text-secondaryAccent` (`#3B82F6` - secondary accent blue)

---

## 7. Scripts & Environment Variables

### NPM Scripts
```bash
# Start development server with Turbopack
npm run dev

# Run MongoDB database migration / seed script
npm run db:seed

# Create optimized production build
npm run build

# Start production server
npm start

# Run ESLint validation
npm run lint
```

### Environment Variables (`.env.local`)
```env
# MongoDB Atlas Database Connection
MONGODB_URI="mongodb+srv://maxamedaweys90_db_user:<PASSWORD>@ugaas.smpx95l.mongodb.net/myportfolio?retryWrites=true&w=majority&appName=ugaas"

# Resend & Email Service
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
EMAIL_RECEIVER="maxamedaweys90@gmail.com"
EMAIL_SENDER="onboarding@resend.dev"
```
