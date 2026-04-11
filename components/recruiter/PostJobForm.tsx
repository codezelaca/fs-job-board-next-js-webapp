"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase, MapPin, DollarSign, Tag, FileText,
  CheckCircle, AlertCircle, Plus, X, Loader2,
  ChevronDown, Save, Send,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category { id: string; name: string; }

interface FormData {
  title: string;
  about: string;
  term: string;
  categoryId: string;
  jobType: string;
  locationType: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  skills: string[];
  responsibilities: string[];
  requirements: string[];
  expiresAt: string;
  status: "DRAFT" | "PUBLISHED";
}

interface FieldErrors { [key: string]: string }

const INITIAL: FormData = {
  title: "",
  about: "",
  term: "",
  categoryId: "",
  jobType: "",
  locationType: "",
  location: "",
  salaryMin: "",
  salaryMax: "",
  skills: [],
  responsibilities: [],
  requirements: [],
  expiresAt: "",
  status: "DRAFT",
};

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const LOCATION_TYPES = [
  { value: "ONSITE", label: "On-site" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "REMOTE", label: "Remote" },
];

const TERM_SUGGESTIONS = [
  "Full year", "6 months", "3 months", "Summer internship",
  "Part-time ongoing", "Contract (3 months)", "Contract (6 months)",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-3.5 py-2.5 text-sm bg-white dark:bg-zinc-900 border rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all ${
    hasError
      ? "border-red-400 dark:border-red-500 focus:ring-red-500/30"
      : "border-zinc-200 dark:border-zinc-700 focus:ring-indigo-500/30 focus:border-indigo-500 dark:focus:border-indigo-500"
  }`;
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          {icon}
        </span>
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

// ─── Tag / List Input ─────────────────────────────────────────────────────────

function TagInput({
  id, label, placeholder, items, onChange, error, hint,
}: {
  id: string; label: string; placeholder: string; items: string[];
  onChange: (items: string[]) => void; error?: string; hint?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInput("");
    }
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
  };

  return (
    <div>
      <Label htmlFor={id} required>{label}</Label>
      {hint && <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{hint}</p>}
      <div className={`rounded-xl border p-2.5 min-h-[80px] transition-all ${error ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-700"} bg-white dark:bg-zinc-900`}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {items.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-500/20">
              {item}
              <button type="button" onClick={() => remove(i)} className="hover:text-red-500 transition-colors ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            id={id}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className="flex-1 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          <button
            type="button"
            onClick={add}
            disabled={!input.trim()}
            className="p-1.5 rounded-lg bg-indigo-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-400 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <FieldError message={error} />
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Press Enter or comma to add · {items.length}/20</p>
    </div>
  );
}

// ─── Bullet List Input ────────────────────────────────────────────────────────

function BulletListInput({
  id, label, placeholder, items, onChange, error,
}: {
  id: string; label: string; placeholder: string; items: string[];
  onChange: (items: string[]) => void; error?: string;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = () => {
    const trimmed = input.trim();
    if (trimmed) { onChange([...items, trimmed]); setInput(""); inputRef.current?.focus(); }
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const update = (i: number, val: string) => onChange(items.map((item, idx) => idx === i ? val : item));

  return (
    <div>
      <Label htmlFor={id} required>{label}</Label>
      <div className={`rounded-xl border overflow-hidden transition-all ${error ? "border-red-400 dark:border-red-500" : "border-zinc-200 dark:border-zinc-700"}`}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100"
            />
            <button type="button" onClick={() => remove(i)} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-50/50 dark:bg-zinc-950/30">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
          <input
            id={id}
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
            placeholder={placeholder}
            className="flex-1 text-sm bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          <button
            type="button"
            onClick={add}
            disabled={!input.trim()}
            className="p-1 rounded-lg bg-indigo-600 disabled:bg-zinc-200 dark:disabled:bg-zinc-700 text-white disabled:text-zinc-400 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <FieldError message={error} />
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{items.length}/20 items · Press Enter to add</p>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function PostJobForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAction, setSubmitAction] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const set = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  }, []);

  // Front-end validation
  const validate = (): boolean => {
    const errs: FieldErrors = {};

    if (!form.title.trim() || form.title.trim().length < 3) errs.title = "Job title must be at least 3 characters.";
    if (form.title.trim().length > 120) errs.title = "Job title must be under 120 characters.";
    if (!form.about.trim() || form.about.trim().length < 50) errs.about = "Description must be at least 50 characters.";
    if (!form.term.trim()) errs.term = "Employment term is required.";
    if (!form.categoryId) errs.categoryId = "Please select a category.";
    if (!form.jobType) errs.jobType = "Please select a job type.";
    if (!form.locationType) errs.locationType = "Please select a location type.";
    if (form.locationType !== "REMOTE" && !form.location.trim()) errs.location = "City/location is required for on-site or hybrid roles.";

    if (form.salaryMin && isNaN(Number(form.salaryMin))) errs.salaryMin = "Must be a valid number.";
    if (form.salaryMax && isNaN(Number(form.salaryMax))) errs.salaryMax = "Must be a valid number.";
    if (form.salaryMin && form.salaryMax && Number(form.salaryMax) < Number(form.salaryMin))
      errs.salaryMax = "Max salary must be ≥ min salary.";

    if (form.skills.length === 0) errs.skills = "Please add at least one skill.";
    if (form.responsibilities.length === 0) errs.responsibilities = "Please add at least one responsibility.";
    if (form.requirements.length === 0) errs.requirements = "Please add at least one requirement.";

    if (form.expiresAt) {
      const d = new Date(form.expiresAt);
      if (isNaN(d.getTime())) errs.expiresAt = "Invalid date.";
      else if (d < new Date()) errs.expiresAt = "Expiry date must be in the future.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (action: "DRAFT" | "PUBLISHED") => {
    setSubmitAction(action);
    setGlobalError(null);
    setSuccessMessage(null);

    if (!validate()) {
      // Scroll to first error
      const firstError = document.querySelector("[data-error='true']");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        status: action,
        salaryMin: form.salaryMin === "" ? null : Number(form.salaryMin),
        salaryMax: form.salaryMax === "" ? null : Number(form.salaryMax),
        expiresAt: form.expiresAt || null,
      };

      const res = await fetch("/api/recruiter/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const apiErrors: FieldErrors = {};
          data.errors.forEach((e: { field: string; message: string }) => {
            apiErrors[e.field] = e.message;
          });
          setErrors(apiErrors);
          setGlobalError("Please fix the errors below and try again.");
        } else {
          setGlobalError(data.error || "Something went wrong. Please try again.");
        }
        return;
      }

      setSuccessMessage(data.message);
      setTimeout(() => router.push("/recruiter-dashboard/jobs"), 1500);
    } catch {
      setGlobalError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = form.about.length;
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-6">

      {/* Global Success Banner */}
      {successMessage && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{successMessage} Redirecting...</p>
        </div>
      )}

      {/* Global Error Banner */}
      {globalError && (
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{globalError}</p>
        </div>
      )}

      {/* ── Section 1: Job Basics ── */}
      <SectionCard title="Job Basics" icon={<Briefcase className="w-4 h-4" />}>
        {/* Title */}
        <div data-error={!!errors.title}>
          <Label htmlFor="title" required>Job Title</Label>
          <input
            id="title"
            type="text"
            placeholder="e.g. Frontend Developer Intern"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClass(!!errors.title)}
            maxLength={120}
          />
          <div className="flex items-start justify-between mt-1.5">
            <FieldError message={errors.title} />
            <span className="text-xs text-zinc-400 ml-auto">{form.title.length}/120</span>
          </div>
        </div>

        {/* Category + Job Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-error={!!errors.categoryId}>
            <Label htmlFor="categoryId" required>Category</Label>
            <div className="relative">
              <select
                id="categoryId"
                value={form.categoryId}
                onChange={(e) => set("categoryId", e.target.value)}
                className={`${inputClass(!!errors.categoryId)} appearance-none pr-9`}
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
            <FieldError message={errors.categoryId} />
          </div>
          <div data-error={!!errors.jobType}>
            <Label htmlFor="jobType" required>Job Type</Label>
            <div className="relative">
              <select
                id="jobType"
                value={form.jobType}
                onChange={(e) => set("jobType", e.target.value)}
                className={`${inputClass(!!errors.jobType)} appearance-none pr-9`}
              >
                <option value="">Select type...</option>
                {JOB_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
            <FieldError message={errors.jobType} />
          </div>
        </div>

        {/* Term */}
        <div data-error={!!errors.term}>
          <Label htmlFor="term" required>Employment Term</Label>
          <input
            id="term"
            type="text"
            list="term-suggestions"
            placeholder="e.g. Full year, 3 months, Summer internship"
            value={form.term}
            onChange={(e) => set("term", e.target.value)}
            className={inputClass(!!errors.term)}
          />
          <datalist id="term-suggestions">
            {TERM_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
          </datalist>
          <FieldError message={errors.term} />
        </div>

        {/* About / Description */}
        <div data-error={!!errors.about}>
          <Label htmlFor="about" required>Job Description</Label>
          <textarea
            id="about"
            rows={6}
            placeholder="Describe the role, what the candidate will do, team culture, etc. (minimum 50 characters)"
            value={form.about}
            onChange={(e) => set("about", e.target.value)}
            className={`${inputClass(!!errors.about)} resize-none`}
            maxLength={5000}
          />
          <div className="flex items-start justify-between mt-1.5">
            <FieldError message={errors.about} />
            <span className={`text-xs ml-auto ${charCount > 4800 ? "text-red-500" : "text-zinc-400"}`}>
              {charCount}/5000
            </span>
          </div>
        </div>
      </SectionCard>

      {/* ── Section 2: Location ── */}
      <SectionCard title="Location" icon={<MapPin className="w-4 h-4" />}>
        <div data-error={!!errors.locationType}>
          <Label htmlFor="locationType" required>Work Arrangement</Label>
          <div className="grid grid-cols-3 gap-3">
            {LOCATION_TYPES.map((lt) => (
              <button
                key={lt.value}
                type="button"
                onClick={() => {
                  set("locationType", lt.value);
                  if (lt.value === "REMOTE") set("location", "");
                }}
                className={`py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                  form.locationType === lt.value
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                {lt.label}
              </button>
            ))}
          </div>
          <FieldError message={errors.locationType} />
        </div>

        {form.locationType !== "REMOTE" && (
          <div data-error={!!errors.location}>
            <Label htmlFor="location" required>City / Location</Label>
            <input
              id="location"
              type="text"
              placeholder="e.g. San Francisco, CA"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className={inputClass(!!errors.location)}
            />
            <FieldError message={errors.location} />
          </div>
        )}
      </SectionCard>

      {/* ── Section 3: Compensation ── */}
      <SectionCard title="Compensation" icon={<DollarSign className="w-4 h-4" />}>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-2">
          Salary information is optional but helps attract more candidates.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div data-error={!!errors.salaryMin}>
            <Label htmlFor="salaryMin">Min Salary (USD/year)</Label>
            <input
              id="salaryMin"
              type="number"
              min={0}
              placeholder="e.g. 50000"
              value={form.salaryMin}
              onChange={(e) => set("salaryMin", e.target.value)}
              className={inputClass(!!errors.salaryMin)}
            />
            <FieldError message={errors.salaryMin} />
          </div>
          <div data-error={!!errors.salaryMax}>
            <Label htmlFor="salaryMax">Max Salary (USD/year)</Label>
            <input
              id="salaryMax"
              type="number"
              min={0}
              placeholder="e.g. 80000"
              value={form.salaryMax}
              onChange={(e) => set("salaryMax", e.target.value)}
              className={inputClass(!!errors.salaryMax)}
            />
            <FieldError message={errors.salaryMax} />
          </div>
        </div>
      </SectionCard>

      {/* ── Section 4: Skills ── */}
      <SectionCard title="Skills & Requirements" icon={<Tag className="w-4 h-4" />}>
        <div data-error={!!errors.skills}>
          <TagInput
            id="skills"
            label="Required Skills"
            placeholder="Add a skill (e.g. React, Python)..."
            items={form.skills}
            onChange={(v) => { set("skills", v); }}
            error={errors.skills}
            hint="Add the key technical skills and tools candidates need."
          />
        </div>

        <div data-error={!!errors.responsibilities}>
          <BulletListInput
            id="responsibilities"
            label="Responsibilities"
            placeholder="Type a responsibility and press Enter..."
            items={form.responsibilities}
            onChange={(v) => set("responsibilities", v)}
            error={errors.responsibilities}
          />
        </div>

        <div data-error={!!errors.requirements}>
          <BulletListInput
            id="requirements"
            label="Requirements"
            placeholder="Type a requirement and press Enter..."
            items={form.requirements}
            onChange={(v) => set("requirements", v)}
            error={errors.requirements}
          />
        </div>
      </SectionCard>



      {/* ── Section 5: Publishing ── */}
      <SectionCard title="Publishing Settings" icon={<FileText className="w-4 h-4" />}>
        <div data-error={!!errors.expiresAt}>
          <Label htmlFor="expiresAt">Listing Expiry Date</Label>
          <input
            id="expiresAt"
            type="date"
            min={today}
            value={form.expiresAt}
            onChange={(e) => set("expiresAt", e.target.value)}
            className={inputClass(!!errors.expiresAt)}
          />
          <FieldError message={errors.expiresAt} />
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Leave blank for no expiry.</p>
        </div>
      </SectionCard>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 pb-8">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit("DRAFT")}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting && submitAction === "DRAFT" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save as Draft
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit("PUBLISHED")}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {isSubmitting && submitAction === "PUBLISHED" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Publish Job
        </button>
      </div>
    </form>
  );
}
