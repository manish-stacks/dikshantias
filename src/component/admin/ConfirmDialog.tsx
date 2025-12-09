"use client";
import { useEffect } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react"; 

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine icon and color based on action
  const isDeactivate = title.toLowerCase().includes("deactivate");
  const confirmColor = isDeactivate
    ? "bg-[#e94e4e] hover:bg-[#d43a3a]"
    : "bg-[#00C950] hover:bg-[#00b046]";
  const Icon = isDeactivate ? AlertTriangle : CheckCircle;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl transform transition-all scale-100">
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${
              isDeactivate ? "bg-[#ffe5e5]" : "bg-[#e5ffe8]"
            }`}
          >
            <Icon
              size={32}
              className={isDeactivate ? "text-[#e94e4e]" : "text-[#00C950]"}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center">{title}</h2>
          {message && <p className="mt-2 text-sm text-gray-600 text-center">{message}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white transition font-medium ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
