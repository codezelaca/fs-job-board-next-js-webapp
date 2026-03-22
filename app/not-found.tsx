import Link from "next/link";
import { SearchX, ArrowLeft } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-20 px-4 min-h-[600px]">
      <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-500/10 rounded-3xl p-10 md:p-16 text-center max-w-2xl w-full shadow-lg shadow-purple-500/5">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center">
            <SearchX className="w-10 h-10" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-foreground/70 mb-10 max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been moved, deleted, or you might have mistyped the address.
        </p>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-purple-600 px-8 font-semibold text-white shadow-xl shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-purple-500/40 hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
