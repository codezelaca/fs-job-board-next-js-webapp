"use client";

import { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { RecruiterJob } from "@/types/recruiter-job";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Search,
  Filter,
  X,
} from "lucide-react";
import JobViewModal from "./JobViewModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TYPE_LABELS: Record<RecruiterJob["jobType"], string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const STATUS_CONFIG: Record<
  RecruiterJob["status"],
  { label: string; className: string }
> = {
  PUBLISHED: {
    label: "Published",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-500/20",
  },
  DRAFT: {
    label: "Draft",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-500/20",
  },
  CLOSED: {
    label: "Closed",
    className:
      "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-zinc-700",
  },
};

const LOCATION_TYPE_LABELS: Record<RecruiterJob["locationType"], string> = {
  ONSITE: "On-site",
  HYBRID: "Hybrid",
  REMOTE: "Remote",
};

const columnHelper = createColumnHelper<RecruiterJob>();

// ─── Component ────────────────────────────────────────────────────────────────

export default function JobsTable({ data }: { data: RecruiterJob[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<RecruiterJob | null>(null);

  // Filter state for dropdowns
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  // Apply sidebar filters by manipulating columnFilters
  const filteredData = useMemo(() => {
    let result = data;
    if (globalFilter) {
      const q = globalFilter.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((j) => j.status === statusFilter);
    }
    if (typeFilter) {
      result = result.filter((j) => j.jobType === typeFilter);
    }
    return result;
  }, [data, globalFilter, statusFilter, typeFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Job Title",
        cell: (info) => (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100 leading-tight">
              {info.getValue()}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {info.row.original.company}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("jobType", {
        header: "Type",
        cell: (info) => (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {JOB_TYPE_LABELS[info.getValue()]}
          </span>
        ),
      }),
      columnHelper.accessor("locationType", {
        header: "Location",
        cell: (info) => (
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {LOCATION_TYPE_LABELS[info.getValue()]}
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              {info.row.original.location}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const cfg = STATUS_CONFIG[info.getValue()];
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}
            >
              {cfg.label}
            </span>
          );
        },
      }),
      columnHelper.accessor("applicationsCount", {
        header: "Applications",
        cell: (info) => (
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Posted",
        cell: (info) => (
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {new Date(info.getValue()).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedJob(row.original)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const clearFilters = useCallback(() => {
    setGlobalFilter("");
    setStatusFilter("");
    setTypeFilter("");
  }, []);

  const hasActiveFilters = globalFilter || statusFilter || typeFilter;

  const SortIcon = ({ column }: { column: any }) => {
    if (!column.getCanSort()) return null;
    if (column.getIsSorted() === "asc") return <ChevronUp className="w-3.5 h-3.5" />;
    if (column.getIsSorted() === "desc") return <ChevronDown className="w-3.5 h-3.5" />;
    return <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400" />;
  };

  return (
    <>
      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Global Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            id="jobs-search"
            type="text"
            placeholder="Search by title, company, location..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <select
            id="jobs-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
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
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Results summary */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
        Showing{" "}
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {filteredData.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {data.length}
        </span>{" "}
        jobs
      </p>

      {/* Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={`inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${
                            header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <SortIcon column={header.column} />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-16 text-center text-zinc-400 dark:text-zinc-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-30" />
                      <p className="font-medium">No jobs found</p>
                      <p className="text-xs">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-100 dark:border-zinc-800/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors last:border-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Rows per page:</span>
            <select
              id="jobs-page-size"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-2">
              Page{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {table.getState().pagination.pageIndex + 1}
              </span>{" "}
              of{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {table.getPageCount()}
              </span>
            </span>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Job View Modal */}
      {selectedJob && (
        <JobViewModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
}
