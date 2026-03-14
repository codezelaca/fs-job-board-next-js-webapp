"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Globe } from "lucide-react";
import { jobs } from "@/data/jobs";

// Extract unique locations dynamically from jobs data
const rawLocations = Array.from(new Set(jobs.map((j) => j.location)));
const remoteOptions = rawLocations.filter((loc) =>
  loc.toLowerCase().includes("remote"),
);
const onsiteOptions = rawLocations
  .filter((loc) => !loc.toLowerCase().includes("remote"))
  .sort();

// Job Type Options
const jobTypeOptions = ["Internship", "Co-op", "Full-time"];

// Reusable Custom Dropdown Component
function CustomDropdown({
  value,
  onChange,
  placeholder,
  options,
  searchable = false,
  remoteOptions = [],
  onsiteOptions = [],
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options?: string[]; // Used if not split into remote/onsite
  searchable?: boolean;
  remoteOptions?: string[];
  onsiteOptions?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearch(""); // Reset search on select
  };

  const isGrouped = remoteOptions.length > 0 || onsiteOptions.length > 0;

  // Filtering
  const filterFn = (opt: string) =>
    opt.toLowerCase().includes(search.toLowerCase());

  const filteredOptions = isGrouped ? [] : (options || []).filter(filterFn);
  const filteredRemote = remoteOptions.filter(filterFn);
  const filteredOnsite = onsiteOptions.filter(filterFn);

  // Helper to format option text
  const displayValue = value || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full h-10 px-3 items-center justify-between rounded-md border border-purple-200 bg-purple-50/50 dark:bg-zinc-900/50 dark:border-purple-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-sans"
      >
        <span
          className={
            value ? "text-foreground font-medium" : "text-foreground/60"
          }
        >
          {displayValue}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-foreground/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-purple-200 dark:border-purple-800 rounded-lg shadow-xl shadow-purple-900/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {searchable && (
            <div className="p-2 border-b border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-zinc-900/30">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-2 text-sm bg-background rounded border border-purple-200/50 dark:border-purple-800/50 focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder:text-foreground/40 font-sans"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="max-h-64 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${!value ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 font-medium" : "text-foreground/70 hover:bg-purple-50/50 dark:hover:bg-purple-900/10"}`}
            >
              {placeholder}
            </button>

            {isGrouped ? (
              <>
                {filteredRemote.length > 0 && (
                  <div className="py-1 mt-1">
                    <div className="px-3 py-1 flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50/50 dark:bg-purple-900/10">
                      <Globe className="w-3.5 h-3.5" /> Remote Options
                    </div>
                    {filteredRemote.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${value === opt ? "bg-purple-50 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 font-semibold" : "text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800/50"}`}
                      >
                        {opt}
                        {value === opt && (
                          <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {filteredOnsite.length > 0 && (
                  <div className="py-1">
                    <div className="px-3 py-1 text-xs font-bold text-foreground/40 uppercase tracking-widest bg-slate-50 dark:bg-zinc-900">
                      On-site & Hybrid
                    </div>
                    {filteredOnsite.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${value === opt ? "bg-purple-50 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 font-semibold" : "text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800/50"}`}
                      >
                        {opt}
                        {value === opt && (
                          <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {filteredRemote.length === 0 && filteredOnsite.length === 0 && (
                  <div className="px-3 py-4 text-sm text-foreground/50 text-center flex flex-col items-center">
                    <Search className="w-4 h-4 mb-2 opacity-50" />
                    No locations match "{search}"
                  </div>
                )}
              </>
            ) : (
              // Non-grouped options
              <>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${value === opt ? "bg-purple-50 dark:bg-zinc-800 text-purple-700 dark:text-purple-300 font-semibold" : "text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800/50"}`}
                    >
                      {opt}
                      {value === opt && (
                        <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-sm text-foreground/50 text-center">
                    No options found.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Local state
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "");

  const applyFilters = (e?: React.FormEvent) => {
    e?.preventDefault();
    let params = new URLSearchParams(searchParams.toString());

    if (searchTerm) params.set("q", searchTerm);
    else params.delete("q");

    if (location) params.set("location", location);
    else params.delete("location");

    if (type) params.set("type", type);
    else params.delete("type");

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    setLocation("");
    setType("");
    router.push(pathname);
  };

  return (
    <form
      onSubmit={applyFilters}
      className="bg-background border border-purple-500/10 rounded-2xl p-6 shadow-sm shadow-purple-500/5 space-y-6 sticky top-24"
    >
      <div>
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-600" />
          Search Jobs
        </h3>
        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="q"
              className="text-sm font-semibold text-foreground/80 tracking-wide"
            >
              KEYWORDS
            </label>
            <div className="relative">
              <input
                type="text"
                id="q"
                placeholder="Job title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-purple-200 bg-purple-50/50 dark:bg-zinc-900/50 dark:border-purple-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80 tracking-wide">
              LOCATION
            </label>
            <CustomDropdown
              value={location}
              onChange={setLocation}
              placeholder="Any Location"
              searchable={true}
              remoteOptions={remoteOptions}
              onsiteOptions={onsiteOptions}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80 tracking-wide">
              JOB TYPE
            </label>
            <CustomDropdown
              value={type}
              onChange={setType}
              placeholder="Any Type"
              options={jobTypeOptions}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-3 border-t border-purple-500/10 mt-6">
        <button
          type="submit"
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium h-10 rounded-md transition-colors shadow-sm shadow-purple-500/20"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-4 border border-purple-500/20 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium h-10 rounded-md transition-colors text-foreground/80"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
