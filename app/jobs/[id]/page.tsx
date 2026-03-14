import { notFound } from "next/navigation";
import { jobs } from "@/data/jobs";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";

export async function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id,
  }));
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    notFound();
  }

  return (
    <div className="flex-1 w-full bg-slate-50/50 dark:bg-background">
      {/* Header Banner */}
      <div className="w-full bg-white dark:bg-zinc-900/50 border-b border-purple-500/10 pt-8 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to jobs
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center border border-purple-500/20 shrink-0 shadow-md shadow-purple-500/10">
                <span className="font-bold text-3xl md:text-4xl text-purple-700 dark:text-purple-400">
                  {job.companyInitial}
                </span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-foreground/70 text-sm md:text-base mb-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-3 py-1 font-medium text-purple-700 dark:text-purple-300 shadow-sm ring-1 ring-inset ring-purple-700/10 text-sm">
                    <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                    {job.type}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-3 py-1 font-medium text-purple-700 dark:text-purple-300 shadow-sm ring-1 ring-inset ring-purple-700/10 text-sm">
                    <Calendar className="w-4 h-4 mr-1.5 opacity-70" />
                    {job.term}
                  </span>
                  <span className="text-sm text-foreground/50 ml-2">
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 pt-4 md:pt-0 shrink-0 w-full md:w-auto">
              <button className="inline-flex h-12 w-full md:w-48 items-center justify-center rounded-lg bg-purple-600 px-6 font-semibold text-white shadow-xl shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 hover:-translate-y-0.5">
                Apply Now
                <Sparkles className="w-4 h-4 ml-2 opacity-80" />
              </button>
              <button className="inline-flex h-12 w-full md:w-48 items-center justify-center rounded-lg border-2 border-purple-200 bg-white dark:bg-zinc-900 px-6 font-semibold text-purple-700 dark:text-purple-300 transition-colors hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                Save for later
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Detailed Job Desc Left Col */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">About the Role</h2>
              <div className="prose prose-purple dark:prose-invert max-w-none text-foreground/80 leading-relaxed text-lg">
                <p>{job.about}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
              <ul className="space-y-3 text-lg text-foreground/80 list-disc pl-5 marker:text-purple-500 marker:text-xl">
                {job.responsibilities.map((req, i) => (
                  <li key={i} className="pl-2">
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">
                Requirements & Qualifications
              </h2>
              <ul className="space-y-3 text-lg text-foreground/80 list-disc pl-5 marker:text-purple-500 marker:text-xl">
                {job.requirements.map((req, i) => (
                  <li key={i} className="pl-2">
                    {req}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Col / Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-purple-500/10">
              <h3 className="font-bold text-lg mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex rounded-lg bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 text-sm font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
