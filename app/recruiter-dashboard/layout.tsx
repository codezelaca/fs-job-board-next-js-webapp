import RecruiterHeader from "@/components/recruiter/RecruiterHeader";

export default function RecruiterDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50">
      <RecruiterHeader />
      <main className="flex-grow flex flex-col">{children}</main>
    </div>
  );
}
