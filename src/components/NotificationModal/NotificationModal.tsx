
"use client";

import React from "react";

export default function NotificationModal({ open, data, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white w-[400px] rounded-2xl shadow-xl p-6 animate-in fade-in zoom-in">

        <h2 className="text-lg font-bold text-gray-800 mb-2">
          {data?.title || "Notification"}
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          {data?.body || "You have a new notification"}
        </p>

        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}