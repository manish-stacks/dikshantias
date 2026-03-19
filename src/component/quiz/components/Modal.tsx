'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.93, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="relative max-w-sm w-full mx-4 bg-white border border-gray-200 rounded-2xl shadow-xl p-5"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={17} />
          </button>
          <h2 className="text-sm font-bold text-gray-900 mb-1 pr-6">{title}</h2>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);