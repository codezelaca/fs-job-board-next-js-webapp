"use client";

import { useState, useTransition } from "react";
import { Loader2, AlertCircle, Check, ShieldCheck, Key } from "lucide-react";
import { adminUpdateSettings } from "@/lib/actions/admin";
import { useRouter } from "next/navigation";

interface AdminSettingsFormProps {
  initialUser: {
    name: string | null;
    email: string;
  };
}

export default function AdminSettingsForm({ initialUser }: AdminSettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Form states
  const [name, setName] = useState(initialUser.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("name", name);

    if (activeTab === "security") {
      formData.append("oldPassword", oldPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);
    }

    startTransition(async () => {
      const res = await adminUpdateSettings(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess("Settings updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.refresh();
        setTimeout(() => setSuccess(""), 3000);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Settings Navigation Tabs */}
      <div className="md:col-span-1 space-y-1">
        <button
          onClick={() => {
            setActiveTab("profile");
            setError("");
            setSuccess("");
          }}
          className={`flex items-center gap-2.5 w-full px-4 h-11 rounded-xl text-xs font-semibold transition-all text-left ${
            activeTab === "profile"
              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Admin Profile
        </button>

        <button
          onClick={() => {
            setActiveTab("security");
            setError("");
            setSuccess("");
          }}
          className={`flex items-center gap-2.5 w-full px-4 h-11 rounded-xl text-xs font-semibold transition-all text-left ${
            activeTab === "security"
              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Key className="w-4 h-4" />
          Reset Credentials
        </button>
      </div>

      {/* Main Forms Workspace */}
      <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-red-650 dark:text-red-455 text-xs animate-in fade-in duration-150">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-xs animate-in fade-in duration-150">
            <Check className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-semibold">{success}</p>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                System Administrator Profile
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  System Email
                </label>
                <input
                  type="email"
                  disabled
                  value={initialUser.email}
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400 text-xs cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter administrator full name"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
                />
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                Credentials Update
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-red-600/50 transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 font-semibold text-white text-xs shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Save Workspace Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
