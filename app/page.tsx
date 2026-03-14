import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Code,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import { jobs } from "@/data/jobs";

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home(props: Props) {
  const searchParams = await props.searchParams;
  const pageStr = searchParams?.page;
  const currentPage = typeof pageStr === "string" ? parseInt(pageStr, 10) : 1;
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, jobs.length);
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col flex-1 w-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-500/10 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px] -z-10" />

      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col justify-center space-y-8 max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-50/50 dark:bg-purple-900/10 px-3 py-1 text-sm text-purple-600 dark:text-purple-400 font-medium w-fit backdrop-blur-sm shadow-sm ring-1 ring-inset ring-purple-500/10">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>The premier job board for software students</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Launch your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                Software
              </span>{" "}
              career today.
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-[600px] leading-relaxed">
              Find the perfect internships, co-ops, and entry-level positions
              tailored specifically for college students in computer science and
              software fields.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/jobs"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-purple-600 px-8 text-base font-semibold text-white shadow-xl shadow-purple-500/30 transition-all hover:bg-purple-700 hover:shadow-purple-500/50 hover:-translate-y-0.5"
              >
                Find Opportunities
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/post-job"
                className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-purple-200 bg-white/50 dark:bg-zinc-900/50 dark:border-purple-800/50 px-8 text-base font-semibold text-purple-700 dark:text-purple-300 transition-all hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:-translate-y-0.5"
              >
                Post a Job
              </Link>
            </div>

            <div className="pt-6 flex items-center gap-4 text-sm font-medium text-foreground/50">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center bg-purple-600 text-white text-[10px] font-bold overflow-hidden`}
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i * 10}`}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p>
                Trusted by{" "}
                <span className="text-foreground font-semibold">10,000+</span>{" "}
                students
              </p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[550px] aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-purple-900/20 border border-purple-500/10 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
            <Image
              src="/hero.png"
              alt="Software Engineering Students Hero Graphic"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-purple-50/50 dark:bg-zinc-900/30 py-20 md:py-32 border-y border-purple-500/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Why CCA Job Board?
            </h2>
            <p className="text-lg text-foreground/70">
              Built specifically for the needs of early-career software
              engineers and the companies that hire them.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background rounded-2xl p-8 shadow-sm ring-1 ring-purple-500/10 transition-all hover:shadow-md hover:shadow-purple-500/5">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tech-Focused Roles</h3>
              <p className="text-foreground/70 leading-relaxed">
                No more sifting through unrelated jobs. Every listing here is
                strictly related to software engineering, data science, and IT.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 shadow-sm ring-1 ring-purple-500/10 transition-all hover:shadow-md hover:shadow-purple-500/5">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Student Friendly</h3>
              <p className="text-foreground/70 leading-relaxed">
                We prioritize internships, new grad roles, and junior positions
                that assume you are still growing your skills.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 shadow-sm ring-1 ring-purple-500/10 transition-all hover:shadow-md hover:shadow-purple-500/5">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Top Employers</h3>
              <p className="text-foreground/70 leading-relaxed">
                Connect directly with startups and tech giants looking for
                fresh, motivated talent from top programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Jobs Preview */}
      <section className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-purple-500/10 pb-6 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Opportunities
            </h2>
            <p className="text-foreground/70">
              Hand-picked roles for software students.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-purple-600 font-medium hover:text-purple-700 inline-flex items-center"
          >
            View all jobs
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4">
          {paginatedJobs.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-purple-500/10 bg-background hover:border-purple-500/30 transition-all hover:shadow-md hover:shadow-purple-500/5 gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-xl bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center border border-purple-500/10 shrink-0 shadow-sm shadow-purple-500/5">
                  <span className="font-bold text-xl text-purple-600">
                    {job.companyInitial}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold group-hover:text-purple-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-foreground/60 mt-1 flex flex-wrap gap-1">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.term}</span>
                  </p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10">
                      {job.type}
                    </span>
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-2 py-1 text-xs font-medium text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-700/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href={`/jobs/${job.id}`}
                className="inline-flex h-10 items-center justify-center rounded-md bg-purple-50 dark:bg-purple-900/20 px-6 text-sm font-medium text-purple-700 dark:text-purple-300 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/40 w-full md:w-auto shrink-0 shadow-sm ring-1 ring-inset ring-purple-700/10"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              return (
                <Link
                  key={pageNum}
                  href={`/?page=${pageNum}`}
                  scroll={false}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                    isActive
                      ? "border-purple-600 bg-purple-600 text-white shadow-sm shadow-purple-500/20"
                      : "border-purple-500/20 bg-background text-foreground hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 md:px-6 pb-20 md:pb-32">
        <div className="relative rounded-3xl overflow-hidden bg-purple-600 px-6 py-16 md:py-24 text-center md:px-12 xl:px-32 flex flex-col items-center justify-center shadow-2xl shadow-purple-900/20">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-800 to-purple-500" />
          <h2 className="relative z-10 text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="relative z-10 text-lg md:text-xl text-purple-100 mb-10 max-w-2xl leading-relaxed">
            Join thousands of college students finding their dream roles in
            tech. Create a profile in minutes.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-8 text-base font-bold text-purple-600 shadow-xl transition-transform hover:scale-105"
            >
              Sign Up for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
