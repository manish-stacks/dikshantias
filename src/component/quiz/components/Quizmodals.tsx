'use client';

import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

export const ExitModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Exit Quiz?">
    <p className="text-gray-500 text-xs mb-4 mt-1">Progress will not be saved. Are you sure?</p>
    <div className="flex gap-2">
      <button
        onClick={onClose}
        className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
      >
        Exit
      </button>
    </div>
  </Modal>
);

export const SubmitModal = ({ isOpen, onClose, onConfirm, answeredCount, totalQuestions }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Submit Quiz?">
    <p className="text-gray-500 text-xs mt-1 mb-1">
      Answered: <span className="font-bold text-gray-900">{answeredCount}</span> / {totalQuestions}
    </p>
    {answeredCount < totalQuestions && (
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 mb-3 mt-2">
        <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-600">{totalQuestions - answeredCount} question(s) unanswered.</p>
      </div>
    )}
    <p className="text-gray-400 text-xs mb-4">This action cannot be undone.</p>
    <div className="flex gap-2">
      <button
        onClick={onClose}
        className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors"
      >
        Continue
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
      >
        Submit
      </button>
    </div>
  </Modal>
);