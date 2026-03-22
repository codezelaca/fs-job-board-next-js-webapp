<div align="center">
  <h1>🚀 CCA Job Board</h1>
  <p>A modern, full-stack job board web application built explicitly for software engineering students and early-career tech professionals.</p>

  <!-- Badges -->
  <a href="https://github.com/codezelaca/fs-job-board-next-js-webapp">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github" alt="GitHub Repo" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</div>

<br/>

## ✨ Features

- **Modern & Responsive UI**: Beautifully designed interface with purple styling, glassmorphic effects, and fluid animations built exclusively with Tailwind CSS v4.
- **Advanced Job Filtering & Pagination**: Search jobs by keyword (title, skills, company), filter dynamically by remote vs. onsite locations, and filter by job types (Internship, Co-op, Full-time). URL-synced search parameters allow shareable filtered links.
- **Interactive "Apply Now" Modal**: A highly polished, client-validated popup form to submit applications natively from the individual job detail view, supporting Full Name, Email, LinkedIn, Portfolio links, and Cover Letters securely.
- **React Suspense Lazy Loading**: Implements Next.js streaming architecture with native `loading.tsx` custom skeletons (matching component structures identically instead of jarring visual jumps) for both the featured listings and detailed pages.
- **Tailored Error Handling**: 
  - Dynamic 404 Missing States (`app/jobs/[id]/not-found.tsx`) that politely indicate when a specific job post has been filled or removed.
  - Global `app/not-found.tsx` for general broken routes.
- **Internal APIs Backend**: Fully developed Next.js Route Handlers (`app/api/jobs`, `app/api/jobs/[id]`, `app/api/apply`) mocking an architectural backend standard for easy external database/CMS dropping later.

## 🛠 Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: ESLint with custom configurations.

## 📂 Project Structure

```text
├── app/
│   ├── api/                  # Backend Route Handlers (/api/jobs, /api/apply)
│   ├── jobs/                 
│   │   ├── (list)/           # Route group isolating the job board view and its skeleton
│   │   │   ├── page.tsx      # Main job board search interface
│   │   │   └── loading.tsx   # Jobs board specific skeleton loader
│   │   └── [id]/             # Dynamic individual job detailed view segment
│   │       ├── page.tsx      
│   │       ├── loading.tsx   # Detailed job specific skeleton loader
│   │       └── not-found.tsx # "Job Expired" dedicated 404 UI
│   ├── globals.css           # Global Tailwind initializations
│   ├── layout.tsx            # Global application root layout
│   ├── not-found.tsx         # Global 404 fallback
│   └── page.tsx              # SEO optimized Landing/Home Page with Lazy loaded Featured sections
├── components/               # Resusable React UI elements (JobCard, JobFilters, ApplyModal)
├── data/                     # Mock data arrays representing a database layer
├── lib/                      # Backend Data Access helpers (getAllJobs, getJobById)
└── types/                    # TypeScript Interfaces (`Job`, forms, etc.)
```

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js installed implicitly via npm or yarn.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/codezelaca/fs-job-board-next-js-webapp.git
   ```
2. Navigate into the project directory:
   ```bash
   cd fs-job-board-next-js-webapp
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open up your browser and navigate to `http://localhost:3000`.

## 🌐 API Reference

For testing application integrations standalone, this project exposes these internal mock endpoints:

- `GET /api/jobs`: Returns a paginated list of all active jobs. Supports search queries `?q=`, `?location=`, `?type=`, `?page=`, `?limit=`.
- `GET /api/jobs/:id`: Returns detailed JSON data regarding a highly specific job ID.
- `POST /api/apply`: Accepts application submissions. Validates `fullName`, `email`, `linkedInUrl`, and `coverLetter`. Returns `201 Created` upon successful server-side check.

---
_Designed and developed natively for the modern tech-recruiting era._
