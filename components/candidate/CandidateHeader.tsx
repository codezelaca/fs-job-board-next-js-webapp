"use client";

import Link from "next/link";
import { GraduationCap, LogOut, LayoutDashboard, Briefcase, User, Settings } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "../ThemeToggle";

export default function CandidateHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 xl:px-8 max-w-7xl h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/candidate-dashboard" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            CCA Candidate
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            href="/candidate-dashboard" 
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            href="/jobs" 
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            Discover Jobs
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm hover:ring-2 hover:ring-indigo-500/20 transition-all focus:outline-none"
            >
              {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "JD"}
            </button>

            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div 
                  className="absolute right-0 mt-2.5 w-56 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{session?.user?.name || "Candidate"}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{session?.user?.email || "No email"}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      href="/jobs" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      Browse Jobs
                    </Link>
                    <button 
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
