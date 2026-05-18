<div align="center">
  <h1>🚀 CCA Job Board</h1>
  <p>A production-ready, high-fidelity full-stack job board web application built with next-generation technologies for recruiters and tech candidates.</p>

  <!-- Badges -->
  <a href="https://github.com/codezelaca/fs-job-board-next-js-webapp">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github" alt="GitHub Repo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma_ORM-6.x-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

<br/>

## 🌟 Key Product Features

### 1. Robust Role-Based Authentication & Guardrails (Auth.js v5)
- **Role-Based Workspaces:** Automatic, precise routing for **Recruiters**, **Candidates** (`JOB_SEEKER`), and **Administrators** (`ADMIN`).
- **Dynamic Onboarding Engine:** Detects uncompleted onboarding records upon successful login and redirects recruiters and candidates to personalized, validated onboarding steps before granting workspace access.
- **Strict Route Protection:** Integrated Next.js Middleware chains protect candidate workspaces (`/candidate-dashboard/*`), recruiter panels (`/recruiter-dashboard/*`), and admin views (`/admin-dashboard/*`) from unauthorized access, bouncing users to home or login pages.

### 2. Super Administrator Command Center (`/admin-dashboard`)
- **Interactive Bento Metrics:** Real-time system monitoring displaying active candidates count, recruiter companies, job openings, and total application volumes.
- **Unified Users Management:** Search, sort, and paginate through all registered users. Admins can update profile parameters on behalf of users, trigger dynamic role switches, and delete accounts with premium double-confirmation protection modals.
- **Guardrails for Admin Role Upgrades:** User role alterations block assigning new `ADMIN` permissions, maintaining access exclusively for secure, pre-seeded admin accounts.
- **Administrative Account Resets:** Generates cryptographic passwords on behalf of users with a one-click "Copy as Message" command to easily dispatch credentials.
- **Global Applications & Jobs Pool:** Complete CRUD capabilities over job openings, and unified lists of system applications. Selecting any application displays a split action panel for scheduling interviews or rejecting candidates.

### 3. Immersive Recruiter Portal (`/recruiter-dashboard`)
- **Bento Stats Dashboard:** Fetches live, user-scoped metrics from the database (Active Jobs, Drafts, Closed Listings, and Total Applications).
- **Recent Applications Quick Links:** Showcases the latest 5 incoming applications on the home screen, deep-linked to instantly pre-filter the Applications Pool.
- **Advanced Job Management:** Create, save as draft, edit, publish, or close listings. Editing is strictly isolated so recruiters can only access their own jobs.
- **Dynamic Applications Pool:** Search candidates by name/email, filter by job listings, and filter by status (PENDING, ACCEPTED, REJECTED) with clean server-driven pagination.
- **Candidate Review Popup:** Click "Review" on any candidate to instantly view their core info, cover letter, skills as tag-pills, biography, LinkedIn/portfolio links, and shortlist or reject them in real-time.

### 4. Interactive Shortlist & Rejection Flows (Resend Integrated)
- **Shortlisting and Scheduling Sub-forms:** Recruiters and Admins can schedule interviews using date/time picker pickers and provide direct video meeting URLs (e.g. Google Meet). Real-time frontend validations block historical scheduling and verify meeting links.
- **Supported Rejection Feedback:** Employers can submit custom rejection feedback. Politeness and supportive remarks are maintained in the notification context.
- **Resend Email Deliverability:** Dispatches rich HTML emails dynamically using the **Resend API**. If API keys are omitted or run in developer sandbox mode, elegant developer fallback triggers automatically log full email payloads to the running terminal.

### 5. Dynamic Candidate Hub (`/candidate-dashboard`)
- **Bento Stats Tracking:** Live statistics for Total Applications, Applications In Review, and Hired Successes.
- **Smart Job Applications:** The public job board's **"Apply Now"** modal automatically locks for guests and recruiters. When a logged-in candidate applies, their name and email are pre-filled uneditably, and their onboarding **resume PDF link is automatically linked** to save time.
- **Applications Timeline & Clickable Statuses:** Review and track past application outcomes, including links to view original job listings.
- **Response Details Popover Modal:** Clicking on any `Shortlisted` or `Rejected` status badge opens a premium response window:
  - **Shortlisted Candidates:** Showcase congratulatory screens, calendar logs, and a direct "Join Video Interview" CTA.
  - **Rejected Candidates:** Display warm, empathetic, custom employer feedback to support their next application.

### 6. Dynamic Role-Based Common Header
- **Authenticated Navigation Bars:** The public layout header dynamically tracks session states.
- **Guest state:** Renders standard "Log in" and "Post a Job" buttons.
- **Authenticated state:** Customizes right-aligned buttons to display a warm, role-tailored greeting alongside dedicated hub redirection links:
  - `ADMIN` $\to$ **Admin Panel** (`/admin-dashboard`)
  - `RECRUITER` $\to$ **Recruiter Hub** (`/recruiter-dashboard`)
  - `JOB_SEEKER` $\to$ **My Dashboard** (`/candidate-dashboard`)

---

## 🛠 Advanced Tech Stack

- **Framework**: [Next.js 15 (App Router / Turbopack)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Authentication**: [Auth.js v5 (NextAuth)](https://authjs.dev/)
- **Database Engine**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL database adapter
- **Email Gateway**: [Resend SDK](https://resend.com/)
- **Security**: Cryptographic hashing via `bcryptjs`
- **Language**: [TypeScript](https://www.typescriptlang.org/) for complete type-safety
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla Tailwind CSS and custom glassmorphic components

---

## 📂 Project Structure

```text
├── app/
│   ├── (auth)/               # Login, Signup, Reset Password, Forgot Password
│   ├── (public)/             # Main Job Board, Landing Page, Job Details
│   ├── api/                  # Secure backend routes (/api/apply, NextAuth routing)
│   ├── admin-dashboard/      # Super Admin Commands, Users control, Jobs pool
│   ├── recruiter-dashboard/  # Recruiter metrics, job publishing, applications pool
│   ├── candidate-dashboard/  # Candidate tracking panel, active metrics
│   ├── onboarding/           # Onboarding paths for recruiter & candidate profile setup
│   ├── globals.css           # Styling directives
│   └── layout.tsx            # Global layout with Theme Providers & Auth Sessions
├── components/               # Shareable components (Headers, Modals, Forms, Bento cards)
│   ├── admin/                # Admin-specific tables, detail side panels and modals
│   ├── recruiter/            # Recruiter-specific tables, job view modals and forms
│   ├── candidate/            # Candidate-specific interactive applications list
│   └── Header.tsx            # Dynamic role-based header top navigation
├── lib/                      # Shared helper actions, prisma instance, and Resend client
│   └── actions/              # Secure Server Actions (auth, settings, applications, admin, jobs)
├── prisma/                   # DB Schemas, migrations, and seed scripts
└── types/                    # TypeScript interfaces
```

---

## 🔑 Initial Demo Accounts (Database Seeding)

During initial database seeding, these high-fidelity demonstration accounts are populated for testing the workflows:

### 1. System Administrator
- **Email:** `info@codezela.com`
- **Password:** `123456Codezela`
- **Role:** `ADMIN`

### 2. Demonstration Recruiter
- **Email:** `recruiter@codezela.com`
- **Password:** `password123`
- **Role:** `RECRUITER`
- **Company:** `Codezela Technologies`

### 3. Demonstration Candidate
- **Email:** `candidate@codezela.com`
- **Password:** `password123`
- **Role:** `JOB_SEEKER`
- **Skills:** React, Next.js, Node.js, TypeScript

---

## 🚀 Getting Started

Follow these steps to configure your local workspace:

### 1. Set Up Environment Variables
Create a `.env` file in the root of the project:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fs_job_board"
AUTH_SECRET="your-super-secret-auth-key"
RESEND_API_KEY="re_your_api_key" # Optional: dispatches active emails, fallbacks to terminal logs if omitted
```

### 2. Initialize Database & Seed
Run Prisma migrations and seed the initial users into your PostgreSQL database:
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma db push

# Generate client
npx prisma generate

# Seed demonstration accounts
npx prisma db seed
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the job board.

---
_Designed and engineered natively for the modern, high-integrity tech recruiting era._
