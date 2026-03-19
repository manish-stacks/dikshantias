'use client';

import { motion } from 'framer-motion';

export const QuestionSidebar = ({ questions, currentIndex, selectedAnswers, onGoTo }) => (
  <aside className="w-28 bg-white border-r border-gray-200 p-3 overflow-y-auto hidden lg:block flex-shrink-0">
    <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3 px-0.5">Questions</p>
    <div className="grid grid-cols-3 gap-1.5">
      {questions.map((q, idx) => (
        <motion.button
          key={q.id}
          onClick={() => onGoTo(idx)}
          className={[
            'h-8 rounded-lg text-xs font-bold transition-all',
            idx === currentIndex
              ? 'bg-blue-600 text-white shadow-sm'
              : selectedAnswers[q.id]
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100 hover:text-gray-700',
          ].join(' ')}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
        >
          {idx + 1}
        </motion.button>
      ))}
    </div>

    <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3">
      {[
        { color: 'bg-blue-600', label: 'Current' },
        { color: 'bg-emerald-50 border border-emerald-200', label: 'Done' },
        { color: 'bg-gray-50 border border-gray-200', label: 'Pending' },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded flex-shrink-0 ${item.color}`} />
          <span className="text-xs text-gray-400">{item.label}</span>
        </div>
      ))}
    </div>
  </aside>
);