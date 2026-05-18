import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col font-sans transition-colors duration-200">
      <AdminHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
