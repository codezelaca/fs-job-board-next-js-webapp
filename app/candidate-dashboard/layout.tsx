import CandidateHeader from "@/components/candidate/CandidateHeader";

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50 dark:bg-zinc-950/20">
      <CandidateHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
