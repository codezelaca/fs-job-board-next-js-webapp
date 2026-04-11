"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { RecruiterJob } from "@/types/recruiter-job";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Eye,
  Search,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useTransition } from "react";
import JobViewModal from "./JobViewModal";
import JobsPagination from "./JobsPagination";
import DeleteJobModal from "./DeleteJobModal";

// ─── Constants ──────────────────────────────────────────────────────────────

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

// Sortable columns we send to the server
const SORTABLE_COLUMNS: Record<string, string> = {
  title: "title",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  jobType: "jobType",
};

const columnHelper = createColumnHelper<RecruiterJob>();

// ─── Component ──────────────────────────────────────────────────────────────

interface JobsTableProps {
  data: RecruiterJob[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  sortField: string;
  sortOrder: "asc" | "desc";
}

export default function JobsTable({
  data,
  total,
  page,
  totalPages,
  limit,
  sortField,
  sortOrder,
}: JobsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [selectedJob, setSelectedJob] = useState<RecruiterJob | null>(null);
  const [deletingJob, setDeletingJob] = useState<RecruiterJob | null>(null);

  // Reflect server sort state into TanStack Table state (display only)
  const sorting: SortingState = useMemo(
    () =>
      sortField
        ? [{ id: sortField, desc: sortOrder === "desc" }]
        : [],
    [sortField, sortOrder]
  );

  // When a column header is clicked, push new sort params to URL → server re-fetches
  const handleSort = (columnId: string) => {
    if (!SORTABLE_COLUMNS[columnId]) return;
    const params = new URLSearchParams(searchParams.toString());
    const currentField = searchParams.get("sort");
    const currentOrder = searchParams.get("order") ?? "desc";

    if (currentField === columnId) {
      params.set("order", currentOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", columnId);
      params.set("order", "desc");
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

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
        enableSorting: false,
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
        enableSorting: false,
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
          <Link
            href={`/recruiter-dashboard/applications?jobId=${info.row.original.id}`}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
          >
            <Users className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
            {info.getValue()}
          </Link>
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
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedJob(row.original)}
              className="p-1.5 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <Link
              href={`/recruiter-dashboard/jobs/${row.original.id}/edit`}
              className="p-1.5 text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
              title="Edit Job"
            >
              <Pencil className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setDeletingJob(row.original)}
              className="p-1.5 text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete Job"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    // Sorting handled server-side - disable client sorting
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const SortIcon = ({ columnId }: { columnId: string }) => {
    if (!SORTABLE_COLUMNS[columnId]) return null;
    const isSorted = sortField === columnId;
    if (isSorted && sortOrder === "asc") return <ChevronUp className="w-3.5 h-3.5" />;
    if (isSorted && sortOrder === "desc") return <ChevronDown className="w-3.5 h-3.5" />;
    return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
  };

  return (
    <>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50"
                >
                  {headerGroup.headers.map((header) => {
                    const canSort = !!SORTABLE_COLUMNS[header.id];
                    return (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header.isPlaceholder ? null : (
                          <button
                            className={`inline-flex items-center gap-1 transition-colors ${
                              canSort
                                ? "cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100"
                                : "cursor-default"
                            }`}
                            onClick={() => canSort && handleSort(header.id)}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <SortIcon columnId={header.id} />
                          </button>
                        )}
                      </th>
                    );
                  })}
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

        <JobsPagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
        />
      </div>

      {selectedJob && (
        <JobViewModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}

      {deletingJob && (
        <DeleteJobModal
          jobId={deletingJob.id}
          jobTitle={deletingJob.title}
          onClose={() => setDeletingJob(null)}
          onDeleted={() => {
            setDeletingJob(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
