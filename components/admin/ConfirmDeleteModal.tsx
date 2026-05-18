"use client";

import { X, AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isPending?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  message = "Are you absolutely sure you want to delete this record? This action is permanent and cannot be undone.",
  isPending = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex gap-4 items-start mb-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center border border-red-100 dark:border-red-500/20 shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-650 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Delete Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
