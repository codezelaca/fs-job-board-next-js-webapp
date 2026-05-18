"use client";

import { useState, useTransition } from "react";
import { X, Loader2, AlertCircle, Check } from "lucide-react";
import { adminUpdateUser } from "@/lib/actions/admin";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  onUpdated: (name: string, role: "RECRUITER" | "JOB_SEEKER" | "ADMIN") => void;
}

export default function UserEditModal({
  isOpen,
  onClose,
  user,
  onUpdated,
}: UserEditModalProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(user.name || "");
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    startTransition(async () => {
      const res = await adminUpdateUser(user.id, name, role as any);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("User updated successfully!");
        onUpdated(name, role as any);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Edit User Profile</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">Modify platform profile credentials directly.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-2.5 text-red-600 dark:text-red-400 text-xs">
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

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs cursor-not-allowed focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                System Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all cursor-pointer appearance-none"
              >
                <option value="JOB_SEEKER">Candidate (JOB_SEEKER)</option>
                <option value="RECRUITER">Recruiter (RECRUITER)</option>
                <option value="ADMIN">System Administrator (ADMIN)</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-850 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
