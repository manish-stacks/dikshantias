'use client';

import { motion } from 'framer-motion';
import { Timer, CheckCircle2 } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const QuestionCard = ({ question, selectedAnswers, onSelect, timerPct, timerSeconds, currentIndex }) => {
  const timerColor =
    timerPct > 50 ? 'from-blue-500 to-blue-400' :
    timerPct > 25 ? 'from-amber-500 to-amber-400' :
    'from-red-500 to-red-400';

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="w-full max-w-xl"
    >
      {/* Per-question timer bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Timer size={12} className={timerPct <= 25 ? 'text-red-500' : 'text-gray-400'} />
            <span className={`text-xs font-bold tabular-nums ${timerPct <= 25 ? 'text-red-500' : 'text-gray-500'}`}>
              {timerSeconds}s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{question.marks || 10} pts</span>
            <span className="text-xs font-medium text-gray-400">Q{currentIndex + 1}</span>
          </div>
        </div>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r rounded-full ${timerColor}`}
            animate={{ width: `${timerPct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question body */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 shadow-sm">
        {question.question_image && (
          <img
            src={question.question_image}
            alt="Question"
            className="w-full max-h-48 object-cover rounded-xl mb-4"
          />
        )}
        <p className="text-sm font-semibold text-gray-900 leading-relaxed mb-4">
          {question.question_text}
        </p>
        <div className="space-y-2">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswers[question.id] === option.id;
            return (
              <motion.button
                key={option.id}
                onClick={() => onSelect(option.id)}
                className={[
                  'w-full p-3 text-left rounded-xl border transition-all flex items-center gap-3',
                  isSelected
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
                ].join(' ')}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
              >
                <span className={[
                  'flex-shrink-0 w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center',
                  isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500',
                ].join(' ')}>
                  {isSelected ? <CheckCircle2 size={13} /> : LETTERS[i] || String.fromCharCode(65 + i)}
                </span>
                <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                  {option.option_text}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};