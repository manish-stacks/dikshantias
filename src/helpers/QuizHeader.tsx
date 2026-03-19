'use client';

import { Clock } from 'lucide-react';

export const QuizHeader = ({ title, currentIndex, totalQuestions, timeRemaining }) => (
  <header className="h-11 bg-white border-b border-gray-200 px-4 flex items-center justify-between sticky top-0 z-40">
    <div className="flex items-center gap-3">
      <h1 className="text-xs font-semibold text-gray-700 truncate max-w-[180px]">{title}</h1>
      <div className="h-3 w-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium tabular-nums">
        {currentIndex + 1} / {totalQuestions}
      </span>
    </div>

    {timeRemaining <= 60 && timeRemaining > 0 && (
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200">
        <Clock size={10} className="text-red-500" />
        <span className="text-xs font-bold text-red-500 tabular-nums">
          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
        </span>
      </div>
    )}
  </header>
);