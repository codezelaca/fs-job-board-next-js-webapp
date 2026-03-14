import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-purple-500/10 bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-600 text-[10px] text-white font-bold transition-transform group-hover:scale-105 shadow shadow-purple-500/20">
            C
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-purple-600">
            CCA Job Board
          </span>
        </Link>
        <p className="text-sm text-foreground/60 max-w-sm leading-relaxed mb-8">
          Empowering Software Engineering students to find top internships and
          entry-level career opportunities.
        </p>

        <div className="w-full border-t border-purple-500/10 pt-8 mt-2 flex justify-center text-sm text-foreground/60">
          <p>
            © {new Date().getFullYear()} CCA Job Board. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
