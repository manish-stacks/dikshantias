'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Zap, AlertTriangle, CheckCircle2, X } from 'lucide-react';

const config = {
  info: { bg: 'bg-white border-blue-300', icon: <Zap size={12} className="text-blue-500" />, text: 'text-blue-700' },
  warning: { bg: 'bg-white border-amber-300', icon: <AlertTriangle size={12} className="text-amber-500" />, text: 'text-amber-700' },
  success: { bg: 'bg-white border-emerald-300', icon: <CheckCircle2 size={12} className="text-emerald-500" />, text: 'text-emerald-700' },
  error: { bg: 'bg-white border-red-300', icon: <X size={12} className="text-red-500" />, text: 'text-red-700' },
};

export const ToastContainer = ({ toasts }) => (
  <div className="fixed top-4 right-4 z-[100] flex flex-col gap-1.5 pointer-events-none">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 48, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 48, scale: 0.92 }}
          transition={{ duration: 0.18 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium pointer-events-auto shadow-md ${config[t.type].bg} ${config[t.type].text}`}
        >
          {config[t.type].icon}
          {t.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);