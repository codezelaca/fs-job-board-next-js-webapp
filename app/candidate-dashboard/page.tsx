import { GraduationCap, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function CandidateDashboardPage() {
  const session = await auth();
  
  if (!session || session.user.role !== "JOB_SEEKER") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
            Candidate Dashboard
          </h1>
          
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.name || session.user.email}!</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Your candidate dashboard is currently under construction. Here you will be able to manage your job applications, update your profile, and discover new opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
