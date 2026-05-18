"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";
import { Settings, LogOut, LayoutDashboard, Briefcase, Users, User } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function RecruiterHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 xl:px-8">
        
        {/* Left: Branding & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/recruiter-dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 relative rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm border border-zinc-200 dark:border-zinc-800 transition-transform group-hover:scale-105">
              <LayoutDashboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors hidden sm:block">
              CCA <span className="text-indigo-600 dark:text-indigo-400">Recruiter</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/recruiter-dashboard/jobs"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            >
              <Briefcase className="w-4 h-4" />
              Manage Jobs
            </Link>
            <Link
              href="/recruiter-dashboard/applications"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
            >
              <Users className="w-4 h-4" />
              Manage Applications
            </Link>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div 
            className="relative"
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:ring-2 ring-indigo-500/50 transition-all outline-none">
              <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className={`absolute right-0 top-full pt-2 w-48 transition-all duration-200 origin-top-right ${
                isProfileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{session?.user?.name || "Recruiter"}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{session?.user?.email || "No email"}</p>
                </div>
                <div className="py-1">
                  <Link 
                    href="/recruiter-dashboard/settings" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
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
            </div>
          </div>
        </div>
        
      </div>
    </header>
  );
}
