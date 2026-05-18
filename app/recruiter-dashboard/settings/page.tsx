import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RecruiterSettingsForm from "@/components/recruiter/RecruiterSettingsForm";
import { ChevronRight, Home, Settings } from "lucide-react";
import Link from "next/link";

export default async function RecruiterSettingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      recruiter: true,
    },
  });

  if (!dbUser || !dbUser.recruiter) {
    redirect("/onboarding/recruiter");
  }

  const initialData = {
    name: dbUser.name || "",
    companyName: dbUser.recruiter.companyName || "",
    companyWebsite: dbUser.recruiter.companyWebsite || "",
    aboutCompany: dbUser.recruiter.aboutCompany || "",
  };

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-10 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-6 px-1">
        <Link href="/recruiter-dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-1">
          <Settings className="w-3 h-3" />
          Settings
        </span>
      </nav>

      {/* Header */}
      <div className="mb-8 px-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Workspace Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Customize your profile, company details, and secure your account credentials.
        </p>
      </div>

      {/* Form Component */}
      <RecruiterSettingsForm initialData={initialData} />
    </div>
  );
}
