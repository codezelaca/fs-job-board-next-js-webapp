import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { LayoutDashboard, LogIn, Sparkles, Briefcase } from "lucide-react";

export default async function Header() {
  const session = await auth();
  
  // Resolve dashboard link based on role
  let dashboardUrl = "/login";
  let dashboardLabel = "Dashboard";
  
  if (session?.user) {
    if (session.user.role === "ADMIN") {
      dashboardUrl = "/admin-dashboard";
      dashboardLabel = "Admin Panel";
    } else if (session.user.role === "RECRUITER") {
      dashboardUrl = "/recruiter-dashboard";
      dashboardLabel = "Recruiter Hub";
    } else {
      dashboardUrl = "/candidate-dashboard";
      dashboardLabel = "My Dashboard";
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/cca-logo.png"
            alt="CCA Job Board Logo"
            width={48}
            height={48}
            className="w-12 h-12 transition-transform group-hover:scale-105 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-purple-600">
            CCA Job Board
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-6">
          <Link
            href="/jobs"
            className="text-sm font-medium text-foreground/80 hover:text-purple-600 transition-colors flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4 opacity-70" />
            Find Jobs
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-550 dark:text-zinc-400 hidden sm:inline-block">
                Welcome, <span className="text-purple-600 font-bold">{session.user.name || "User"}</span>
              </span>
              <Link
                href={dashboardUrl}
                className="inline-flex h-9 items-center justify-center rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 px-4 text-xs font-bold text-purple-700 dark:text-purple-400 transition-all border border-purple-100 dark:border-purple-500/10 shadow-sm gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {dashboardLabel}
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-foreground/80 hover:text-purple-600 transition-colors hidden sm:flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                Log in
              </Link>
              
              <Link
                href="/recruiter-dashboard/post-job"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 hover:-translate-y-0.5 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Post a Job
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
