"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Briefcase, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { signupUser } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<"JOB_SEEKER" | "RECRUITER">("JOB_SEEKER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    const res = await signupUser(formData);

    if (res.error) {
      setError(res.error);
      setIsLoading(false);
      return;
    }

    // Immediately log in upon successful signup
    const signInRes = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (signInRes?.error) {
      setError("Account created but failed to log in automatically.");
      setIsLoading(false);
    } else {
      router.push(role === "RECRUITER" ? "/onboarding/recruiter" : "/onboarding/candidate");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create an account</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Join CCA Job Board to {role === "JOB_SEEKER" ? "find your next role" : "hire top talent"}.
        </p>
      </div>

      {/* Role Tabs */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => setRole("JOB_SEEKER")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
            role === "JOB_SEEKER"
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Candidate
        </button>
        <button
          type="button"
          onClick={() => setRole("RECRUITER")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
            role === "RECRUITER"
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Recruiter
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2.5 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 dark:text-zinc-100 transition-all"
            placeholder="Minimum 8 characters"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-sm shadow-indigo-500/20 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Create account
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
