"use client";

import { useState, useTransition, useEffect } from "react";
import { UserCheck, Trash2, Key, Edit, ShieldAlert, AlertCircle, Check, Loader2 } from "lucide-react";
import UserEditModal from "./UserEditModal";
import PasswordResetModal from "./PasswordResetModal";
import UserProfileModal from "./UserProfileModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { adminDeleteUser } from "@/lib/actions/admin";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  recruiter?: {
    companyName: string;
  } | null;
  candidate?: {
    bio: string | null;
    skills: string[];
    resumeUrl?: string | null;
  } | null;
}

interface UsersTableProps {
  initialUsers: UserRow[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  
  // Modals state
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [resettingUser, setResettingUser] = useState<UserRow | null>(null);
  const [viewingUser, setViewingUser] = useState<UserRow | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserRow | null>(null);

  // Deletion state
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Synchronize when server updates props
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleUpdate = (userId: string, newName: string, newRole: "RECRUITER" | "JOB_SEEKER") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, name: newName, role: newRole } : u))
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingUser) return;
    const userId = deletingUser.id;

    setError("");
    setSuccess("");

    startTransition(async () => {
      const res = await adminDeleteUser(userId);
      if (res?.error) {
        setError(res.error);
        setDeletingUser(null);
      } else {
        setSuccess("User deleted successfully.");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setDeletingUser(null);
        setTimeout(() => setSuccess(""), 1500);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-2xl flex items-start gap-3 text-red-650 dark:text-red-455 text-sm animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-sm animate-in fade-in duration-150">
          <Check className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-semibold">{success}</p>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                <th className="p-5 font-semibold">User Details</th>
                <th className="p-5 font-semibold">System Role</th>
                <th className="p-5 font-semibold">Registered On</th>
                <th className="p-5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {users.length > 0 ? (
                users.map((user) => {
                  const initials = user.name
                    ? user.name.substring(0, 2).toUpperCase()
                    : user.email.substring(0, 2).toUpperCase();

                  const createdDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      {/* Name & Email */}
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-700 dark:text-zinc-300">
                            {initials}
                          </div>
                          <div>
                            <button
                              onClick={() => setViewingUser(user)}
                              className="font-semibold text-zinc-900 dark:text-zinc-50 hover:text-red-650 dark:hover:text-red-400 hover:underline transition-all text-left cursor-pointer"
                            >
                              {user.name || "N/A"}
                            </button>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* System Role */}
                      <td className="p-5">
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full ${
                          user.role === "ADMIN" 
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                            : user.role === "RECRUITER"
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                              : "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
                        }`}>
                          {user.role === "JOB_SEEKER" ? "Candidate" : user.role === "RECRUITER" ? "Recruiter" : "Admin"}
                        </span>
                      </td>

                      {/* Created date */}
                      <td className="p-5 text-zinc-500 dark:text-zinc-400">
                        {createdDate}
                      </td>

                      {/* Custom Admin Operations */}
                      <td className="p-5 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            title="Edit User Profile"
                            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer shadow-sm"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setResettingUser(user)}
                            title="Reset Credentials"
                            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 hover:text-red-650 hover:border-red-500/30 transition-all cursor-pointer shadow-sm"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeletingUser(user)}
                            disabled={isPending && deletingUser?.id === user.id}
                            title="Delete User Account"
                            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-650 hover:text-red-600 hover:border-red-500/30 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {isPending && deletingUser?.id === user.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-zinc-500 dark:text-zinc-400">
                    <div className="flex flex-col items-center justify-center">
                      <UserCheck className="w-10 h-10 opacity-20 mb-3" />
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">No users found</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">There are no user profiles matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editingUser && (
        <UserEditModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onUpdated={(name, role) => handleUpdate(editingUser.id, name, role)}
        />
      )}

      {/* Credentials Reset Modal */}
      {resettingUser && (
        <PasswordResetModal
          isOpen={!!resettingUser}
          onClose={() => setResettingUser(null)}
          user={resettingUser}
        />
      )}

      {/* Profile Details Popover Modal */}
      {viewingUser && (
        <UserProfileModal
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
          user={viewingUser}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {deletingUser && (
        <ConfirmDeleteModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Platform Account"
          message={`Are you completely sure you want to permanently delete the account for ${deletingUser.name || deletingUser.email}? This action will permanently purge all their job listings, recruiter logs, skills listings, and applicant data immediately.`}
          isPending={isPending}
        />
      )}
    </div>
  );
}
