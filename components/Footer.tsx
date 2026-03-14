import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-purple-500/10 bg-background py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-600 text-[10px] text-white font-bold transition-transform group-hover:scale-105 shadow shadow-purple-500/20">
                C
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-purple-600">
                CCA Job Board
              </span>
            </Link>
            <p className="text-sm text-foreground/60 max-w-xs leading-relaxed">
              Empowering Software Engineering students to find top internships
              and entry-level career opportunities.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              For Students
            </h3>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-purple-600 transition-colors"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="hover:text-purple-600 transition-colors"
                >
                  Career Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/resume-tips"
                  className="hover:text-purple-600 transition-colors"
                >
                  Resume Tips
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              For Employers
            </h3>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li>
                <Link
                  href="/post-job"
                  className="hover:text-purple-600 transition-colors"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-purple-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-foreground/60">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-purple-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-purple-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center border-t border-purple-500/10 pt-8 text-sm text-foreground/60">
          <p>
            © {new Date().getFullYear()} CCA Job Board. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {/* Social media placeholders */}
            <div className="h-5 w-5 rounded-full bg-foreground/20 hover:bg-purple-600 transition-colors cursor-pointer" />
            <div className="h-5 w-5 rounded-full bg-foreground/20 hover:bg-purple-600 transition-colors cursor-pointer" />
            <div className="h-5 w-5 rounded-full bg-foreground/20 hover:bg-purple-600 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
