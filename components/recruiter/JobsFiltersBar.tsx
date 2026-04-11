"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition, useState, useRef, useEffect } from "react";
import { Search, Filter, X, Loader2 } from "lucide-react";

export default function JobsFiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local controlled state — synced to URL
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") ?? "");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Push updated search params to URL
  const pushParams = useCallback(
    (overrides: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Always reset to page 1 when filters change
      params.set("page", "1");

      Object.entries(overrides).forEach(([key, val]) => {
        if (val) {
          params.set(key, val);
        } else {
          params.delete(key);
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  // Debounced search
  const handleSearch = (value: string) => {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ q: value });
    }, 350);
  };

  const handleStatus = (value: string) => {
    setStatus(value);
    pushParams({ status: value });
  };

  const handleJobType = (value: string) => {
    setJobType(value);
    pushParams({ jobType: value });
  };

  const clearAll = () => {
    setQ("");
    setStatus("");
    setJobType("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = q || status || jobType;

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin pointer-events-none" />
        )}
        <input
          id="jobs-search"
          type="text"
          placeholder="Search by title, company, location..."
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Status Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <select
          id="jobs-status-filter"
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className="pl-9 pr-8 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Type Filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        <select
          id="jobs-type-filter"
          value={jobType}
          onChange={(e) => handleJobType(e.target.value)}
          className="pl-9 pr-8 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">All Types</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERNSHIP">Internship</option>
        </select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
          Clear
        </button>
      )}
    </div>
  );
}
