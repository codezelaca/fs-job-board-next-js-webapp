import { prisma } from "@/lib/prisma";
import PostJobForm from "@/components/recruiter/PostJobForm";
import { notFound, redirect } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  // Fetch job and categories in parallel
  const [job, categories] = await Promise.all([
    prisma.job.findUnique({
      where: { id },
      include: { category: true, recruiter: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!job) {
    notFound();
  }

  if (job.recruiter.userId !== session.user.id) {
    redirect("/recruiter-dashboard/jobs"); // Or unauthorized page
  }

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-10 max-w-6xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-6 px-1">
        <Link href="/recruiter-dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <Link href="/recruiter-dashboard/jobs" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          Manage Jobs
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className="text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]">
          Edit "{job.title}"
        </span>
      </nav>

      <div className="mb-8 px-1">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Edit Job Posting</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Update the details of your job listing. Existing status: <span className="font-medium text-indigo-600 dark:text-indigo-400">{job.status}</span>
        </p>
      </div>

      <PostJobForm 
        categories={categories} 
        initialData={{
            ...job,
            salaryMin: job.salaryMin?.toString() || "",
            salaryMax: job.salaryMax?.toString() || "",
            expiresAt: job.expiresAt?.toISOString() || "",
        } as any} 
      />
    </div>
  );
}
