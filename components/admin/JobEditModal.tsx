"use client";

import { useState, useTransition } from "react";
import { X, Loader2, AlertCircle, Check, Briefcase, Plus, Minus } from "lucide-react";
import { adminCreateJob, adminUpdateJob } from "@/lib/actions/admin";

interface RecruiterOption {
  id: string;
  companyName: string;
  user: {
    name: string | null;
    email: string;
  };
}

interface CategoryOption {
  id: string;
  name: string;
}

interface JobEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: any | null; // Null if adding a new job
  recruiters: RecruiterOption[];
  categories: CategoryOption[];
  onSaved: () => void;
}

export default function JobEditModal({
  isOpen,
  onClose,
  job,
  recruiters,
  categories,
  onSaved,
}: JobEditModalProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!job;

  const [title, setTitle] = useState(job?.title || "");
  const [recruiterId, setRecruiterId] = useState(job?.recruiterId || recruiters[0]?.id || "");
  const [categoryId, setCategoryId] = useState(job?.categoryId || categories[0]?.id || "");
  const [jobType, setJobType] = useState<any>(job?.jobType || "FULL_TIME");
  const [locationType, setLocationType] = useState<any>(job?.locationType || "REMOTE");
  const [location, setLocation] = useState(job?.location || "");
  const [salaryMin, setSalaryMin] = useState<string>(job?.salaryMin !== undefined && job?.salaryMin !== null ? String(job.salaryMin) : "");
  const [salaryMax, setSalaryMax] = useState<string>(job?.salaryMax !== undefined && job?.salaryMax !== null ? String(job.salaryMax) : "");
  const [about, setAbout] = useState(job?.about || "");
  const [term, setTerm] = useState(job?.term || "Permanent");

  // Arrays
  const [skills, setSkills] = useState(job?.skills?.join(", ") || "");
  
  const [responsibilities, setResponsibilities] = useState<string[]>(
    job?.responsibilities && job.responsibilities.length > 0
      ? job.responsibilities
      : [""]
  );
  
  const [requirements, setRequirements] = useState<string[]>(
    job?.requirements && job.requirements.length > 0
      ? job.requirements
      : [""]
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleAddResponsibility = () => setResponsibilities((prev) => [...prev, ""]);
  const handleRemoveResponsibility = (index: number) => {
    if (responsibilities.length === 1) {
      setResponsibilities([""]);
    } else {
      setResponsibilities((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const handleResponsibilityChange = (index: number, val: string) => {
    setResponsibilities((prev) => prev.map((item, i) => (i === index ? val : item)));
  };

  const handleAddRequirement = () => setRequirements((prev) => [...prev, ""]);
  const handleRemoveRequirement = (index: number) => {
    if (requirements.length === 1) {
      setRequirements([""]);
    } else {
      setRequirements((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const handleRequirementChange = (index: number, val: string) => {
    setRequirements((prev) => prev.map((item, i) => (i === index ? val : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || title.length < 3) {
      setError("Title must be at least 3 characters long.");
      return;
    }
    if (!about.trim() || about.length < 10) {
      setError("Job description (About) must be at least 10 characters long.");
      return;
    }
    if (!recruiterId) {
      setError("Please select a recruiter to assign this job.");
      return;
    }
    if (!categoryId) {
      setError("Please select a job category.");
      return;
    }

    const skillsArray = skills
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    const responsibilitiesArray = responsibilities
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const requirementsArray = requirements
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const minSal = salaryMin.trim() ? parseInt(salaryMin, 10) : null;
    const maxSal = salaryMax.trim() ? parseInt(salaryMax, 10) : null;

    if (minSal !== null && isNaN(minSal)) {
      setError("Minimum salary must be a valid number.");
      return;
    }
    if (maxSal !== null && isNaN(maxSal)) {
      setError("Maximum salary must be a valid number.");
      return;
    }

    startTransition(async () => {
      const payload = {
        title,
        location: locationType === "REMOTE" ? null : location,
        locationType,
        jobType,
        salaryMin: minSal,
        salaryMax: maxSal,
        about,
        term,
        recruiterId,
        categoryId,
        skills: skillsArray,
        responsibilities: responsibilitiesArray,
        requirements: requirementsArray,
      };

      const res = isEditing
        ? await adminUpdateJob(job.id, payload)
        : await adminCreateJob(payload);

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(isEditing ? "Job posting updated successfully!" : "Job posting published successfully!");
        onSaved();
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
            {isEditing ? "Edit Job Details" : "Publish New Job Listing"}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {isEditing ? "Modify job listing credentials, salary brackets, and recruiter assignments." : "Create and publish a brand new job opportunity on the platform."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-2.5 text-red-650 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl flex items-start gap-2.5 text-emerald-600 dark:text-emerald-400 text-xs">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-semibold">{success}</p>
            </div>
          )}

          {/* Primary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Recruiter & Job Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Assign Recruiter / Company
              </label>
              <select
                value={recruiterId}
                onChange={(e) => setRecruiterId(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all cursor-pointer"
              >
                {recruiters.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.companyName} ({r.user.name || r.user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all cursor-pointer"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Location Type
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all cursor-pointer"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Office / City Location
              </label>
              <input
                type="text"
                disabled={locationType === "REMOTE"}
                value={locationType === "REMOTE" ? "Fully Remote" : location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Salary brackets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Salary Min ($)
              </label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="e.g. 80000"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Salary Max ($)
              </label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="e.g. 120000"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Contract Terms
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. Full-time, Permanent"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
              />
            </div>
          </div>

          {/* Description & Skills */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Job Overview (Description)
              </label>
              <textarea
                required
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Detailed job overview, mission, benefits, culture..."
                className="w-full p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/20 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-650/50 transition-all h-28 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider mb-1.5">
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Next.js, Node.js, Prisma"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
              />
            </div>
          </div>

          {/* Key Responsibilities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
                Key Responsibilities
              </label>
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-red-650 dark:text-red-400 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {responsibilities.map((r, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                    placeholder="e.g. Design and build robust web APIs"
                    className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveResponsibility(index)}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-850 text-zinc-450 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-950 cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Core Requirements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
                Core Requirements / Experience
              </label>
              <button
                type="button"
                onClick={handleAddRequirement}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-red-650 dark:text-red-400 hover:underline cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            <div className="space-y-2">
              {requirements.map((r, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    placeholder="e.g. 3+ years experience with React"
                    className="flex-1 h-9 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-1 focus:ring-red-600/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-850 text-zinc-450 hover:text-red-600 hover:bg-zinc-50 dark:hover:bg-zinc-950 cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 justify-end bg-zinc-50/50 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {isEditing ? "Save Job Details" : "Publish Job Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
