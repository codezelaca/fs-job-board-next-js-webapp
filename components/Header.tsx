import Link from "next/link";
import Image from "next/image";

export default function Header() {
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
            className="text-sm font-medium text-foreground/80 hover:text-purple-600 transition-colors"
          >
            Find Jobs
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/80 hover:text-purple-600 transition-colors hidden sm:block"
          >
            Log in
          </Link>
          <Link
            href="/post-job"
            className="inline-flex h-9 items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 hover:-translate-y-0.5"
          >
            Post a Job
          </Link>
        </div>
      </div>
    </header>
  );
}
