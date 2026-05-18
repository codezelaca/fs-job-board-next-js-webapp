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
- **Strict Route Protection:** Integrated Next.js Middleware chains protect candidate workspaces (`/candidate-dashboard/*`), recruiter panels (`/recruiter-dashboard/*`), and admin views (`/admin/*`) from unauthorized access, bouncing users to home or login pages.

### 2. Immersive Recruiter Portal (`/recruiter-dashboard`)
- **Bento Stats Dashboard:** Fetches live, user-scoped metrics from the database (Active Jobs, Drafts, Closed Listings, and Total Applications).
- **Recent Applications Quick Links:** Showcases the latest 5 incoming applications on the home screen, deep-linked to instantly pre-filter the Applications Pool.
- **Advanced Job Management:** Create, save as draft, edit, publish, or close listings. Editing is strictly isolated so recruiters can only access their own jobs.
- **Dynamic Applications Pool:** Search candidates by name/email, filter by job listings, and filter by status (PENDING, ACCEPTED, REJECTED) with clean server-driven pagination.
- **Candidate Review Popup:** Click "Review" on any candidate to instantly view their core info, cover letter, skills as tag-pills, biography, LinkedIn/portfolio links, and shortlist or reject them in real-time.

### 3. Dynamic Candidate Hub (`/candidate-dashboard`)
- **Bento Stats Tracking:** Live statistics for Total Applications, Applications In Review, and Hired Successes.
- **Smart Job Applications:** The public job board's **"Apply Now"** modal automatically locks for guests and recruiters. When a logged-in candidate applies, their name and email are pre-filled uneditably, and their onboarding **resume PDF link is automatically linked** to save time.
- **Applications Timeline:** Review and track past application outcomes, including links to view original job listings.
- **Live Profile Showcase:** A summary dashboard sidebar displaying your professional Bio, registered Skills tags, and resume links.

### 4. Custom Profile & Security Workspace (`/settings`)
- **Recruiter Profile Settings:** Modify name, company website URL, and long-form company descriptions.
- **Candidate Profile Settings:** Customize bio, resume PDF location, and input skills as comma-separated tags (instantly parsed and array-registered).
- **Cryptographic Password Resets:** Fully secure password reset form that verifies the user's current password using `bcrypt` before applying the new one.

---

## 🛠 Advanced Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Core Library**: [React 19](https://react.dev/)
- **Authentication**: [Auth.js v5 (NextAuth)](https://authjs.dev/)
- **Database Engine**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL database adapter
- **Security**: Cryptographic hashing via `bcryptjs`
- **Language**: [TypeScript](https://www.typescriptlang.org/) for complete type-safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a curated dark-mode and glassmorphic palette
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
├── app/
│   ├── (auth)/               # Login, Signup, Reset Password, Forgot Password
│   ├── (public)/             # Main Job Board, Landing Page, Job Details
│   ├── api/                  # Secure backend routes (/api/apply, NextAuth routing)
│   ├── recruiter-dashboard/  # Recruiter metrics, job publishing, applications pool
│   ├── candidate-dashboard/  # Candidate tracking panel, active metrics
│   ├── onboarding/           # Onboarding paths for recruiter & candidate profile setup
│   ├── globals.css           # Styling directives
│   └── layout.tsx            # Global layout with Theme Providers & Auth Sessions
├── components/               # Shareable components (Headers, Modals, Forms, Bento cards)
├── lib/                      # Shared helper actions, prisma instance
│   └── actions/              # Secure Server Actions (auth, settings, applications, jobs)
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
```

### 2. Initialize Database & Seed
Run Prisma migrations and seed the initial users into your PostgreSQL database:
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

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
