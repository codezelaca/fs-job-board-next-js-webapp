import type { Metadata } from "next";
import { Briefcase, ArrowLeft } from "lucide-react";
import Link from "next/link";
import PostJobForm from "@/components/recruiter/PostJobForm";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Post New Job | CCA Recruiter",
  description: "Create and publish a new job posting to the CCA job board.",
};

export default async function PostJobPage() {
  // Fetch categories for the form dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-10 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/recruiter-dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Manage Jobs
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
          <Briefcase className="w-7 h-7 text-indigo-500" />
          Post New Job
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          Fill out the form below to publish a new position to the CCA job board.
        </p>
      </div>

      {/* Form */}
      <PostJobForm categories={categories} />
    </div>
  );
}
