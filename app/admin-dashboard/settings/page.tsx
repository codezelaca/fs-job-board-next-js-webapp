import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import Link from "next/link";
import { Home, ChevronRight, Settings } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 xl:px-8 py-8 md:py-10 max-w-7xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-6 px-1">
        <Link href="/admin-dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          Dashboard
        </Link>
        <ChevronRight className="w-3 h-3 opacity-30" />
        <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-1">
          <Settings className="w-3.5 h-3.5" />
          Admin Settings
        </span>
      </nav>

      {/* Header Banner */}
      <div className="mb-8 px-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2">
          Admin Settings
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your personal administration profile name and system access credentials.
        </p>
      </div>

      {/* Form Workspace */}
      <AdminSettingsForm initialUser={user} />
    </div>
  );
}
