'use client';

import { motion } from 'framer-motion';
import { FileText, Timer, Shield, Target, AlertCircle, CheckSquare, BookOpen, BarChart3, Hash, Play } from 'lucide-react';

const TERMS = [
  { icon: <Timer size={13} />, text: 'Each question has a time limit. Unanswered questions score zero.' },
  { icon: <Shield size={13} />, text: 'Do not switch tabs or minimize the window during the quiz.' },
  { icon: <Target size={13} />, text: 'Once submitted, answers cannot be changed.' },
  { icon: <AlertCircle size={13} />, text: 'Refreshing or closing the page will end your session.' },
  { icon: <CheckSquare size={13} />, text: 'Select one answer per question before proceeding.' },
  { icon: <BookOpen size={13} />, text: 'You may navigate between questions before final submission.' },
];

export const TermsScreen = ({ quiz, onStart, countdown }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-lg"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 mb-4">
          <FileText size={22} className="text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">
          {quiz?.title || 'Quiz'}
        </h1>
        <p className="text-gray-500 text-sm">Read carefully before starting</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-3 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Hash size={12} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Terms & Conditions</span>
        </div>
        <div className="space-y-3">
          {TERMS.map((term, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              className="flex items-start gap-3"
            >
              <span className="text-blue-500 mt-0.5 flex-shrink-0">{term.icon}</span>
              <p className="text-gray-600 text-xs leading-relaxed">{term.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-3.5 mb-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 size={13} className="text-gray-400" />
          <span className="text-xs text-gray-500">Total Questions</span>
        </div>
        <span className="text-sm font-bold text-gray-800">{quiz?.totalQuestions || '—'}</span>
      </div>

      <motion.button
        onClick={onStart}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2.5 relative overflow-hidden shadow-md"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {countdown > 0 ? (
          <>
            <Timer size={15} className="text-blue-200 relative z-10" />
            <span className="relative z-10">Starting in <span className="font-bold">{countdown}s</span></span>
          </>
        ) : (
          <>
            <Play size={15} className="relative z-10" />
            <span className="relative z-10">Begin Quiz</span>
          </>
        )}
        {countdown > 0 && (
          <motion.div
            className="absolute left-0 top-0 h-full bg-blue-500/40"
            initial={{ width: '100%' }}
            animate={{ width: `${(countdown / 10) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.button>
      <p className="text-center text-xs text-gray-400 mt-3">By starting, you agree to the terms above</p>
    </motion.div>
  </div>
);