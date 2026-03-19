'use client';

import { ChevronLeft, ChevronRight, X, Zap, CheckCircle2, Circle, Hash } from 'lucide-react';

export const QuizFooter = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  isLastQuestion,
  onPrev,
  onNext,
  onExit,
}) => (
  <>
    <div className="flex items-center justify-between gap-3 mb-4">
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-600 text-xs font-semibold border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold border border-red-200 transition-colors"
        >
          <X size={13} /> Exit
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
        >
          {isLastQuestion ? (
            <><Zap size={13} /> Submit</>
          ) : (
            <>Next <ChevronRight size={13} /></>
          )}
        </button>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {[
        { label: 'Answered', value: answeredCount, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={12} /> },
        { label: 'Remaining', value: totalQuestions - answeredCount, color: 'text-red-500', bg: 'bg-red-50 border-red-200', icon: <Circle size={12} /> },
        { label: 'Total', value: totalQuestions, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', icon: <Hash size={12} /> },
      ].map((item) => (
        <div key={item.label} className={`border rounded-xl p-3 text-center shadow-sm ${item.bg}`}>
          <span className={`flex justify-center mb-1 ${item.color}`}>{item.icon}</span>
          <p className={`text-lg font-black ${item.color}`}>{item.value}</p>
          <p className="text-xs text-gray-400">{item.label}</p>
        </div>
      ))}
    </div>
  </>
);