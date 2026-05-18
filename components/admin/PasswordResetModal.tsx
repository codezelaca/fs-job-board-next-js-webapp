"use client";

import { useState, useTransition } from "react";
import { X, Loader2, AlertCircle, Check, Copy, Key } from "lucide-react";
import { adminResetPassword } from "@/lib/actions/admin";

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function PasswordResetModal({
  isOpen,
  onClose,
  user,
}: PasswordResetModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleReset = async () => {
    setError("");
    setTempPassword("");
    setCopied(false);

    startTransition(async () => {
      const res = await adminResetPassword(user.id);
      if (res?.error) {
        setError(res.error);
      } else if (res?.tempPassword) {
        setTempPassword(res.tempPassword);
      }
    });
  };

  const copyMessage = () => {
    const name = user.name || "there";
    const text = `Hi ${name},\n\nYour account has been reset by the administrator. Please log in using the temporary credentials below:\n\nEmail: ${user.email}\nTemporary Password: ${tempPassword}\n\nWe recommend updating your password immediately under your account Settings panel.`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-1 flex items-center gap-2">
            <Key className="w-5 h-5 text-red-500" />
            Reset Credentials
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
            Generate new secure temporary password on behalf of <strong className="text-zinc-700 dark:text-zinc-300">{user.name || user.email}</strong>.
          </p>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-xl flex items-start gap-2.5 text-red-600 dark:text-red-400 text-xs mb-4">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {!tempPassword ? (
            <div className="space-y-4">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
                <strong>Attention:</strong> Performing this reset will overwrite the user's active password immediately. You will be provided with a copyable secure message containing the temporary password to send directly to the user.
              </p>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-850 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isPending}
                  className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Reset Password Now
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-200 dark:border-emerald-900/30 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-xs">
                <Check className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Credentials Reset Successfully!</p>
                  <p className="text-xs opacity-80 mt-0.5">Please copy the reset message and share it securely with the user.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Copyable Message Body
                </label>
                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-2xl p-4 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 whitespace-pre-line leading-relaxed border-dashed">
                  {`Hi ${user.name || "there"},\n\nYour account has been reset by the administrator. Please log in using the temporary credentials below:\n\nEmail: ${user.email}\nTemporary Password: ${tempPassword}\n\nWe recommend updating your password immediately under your account Settings panel.`}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-850 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={copyMessage}
                  className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Reset Message
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
