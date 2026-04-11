"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface JobsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function JobsPagination({
  page,
  totalPages,
  total,
  limit,
}: JobsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const setPageSize = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", String(size));
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const from = Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 transition-opacity ${
        isPending ? "opacity-60" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Rows per page:</span>
        <select
          id="jobs-page-size"
          value={limit}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {total > 0 ? (
            <>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {from}–{to}
              </span>{" "}
              of{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {total}
              </span>{" "}
              jobs
            </>
          ) : (
            "No results"
          )}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-2">
          Page{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {page}
          </span>{" "}
          of{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {totalPages}
          </span>
        </span>
        <button
          onClick={() => navigate(1)}
          disabled={page <= 1 || isPending}
          className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
        <button
          onClick={() => navigate(page - 1)}
          disabled={page <= 1 || isPending}
          className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
        <button
          onClick={() => navigate(page + 1)}
          disabled={page >= totalPages || isPending}
          className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
        <button
          onClick={() => navigate(totalPages)}
          disabled={page >= totalPages || isPending}
          className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          <ChevronsRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
