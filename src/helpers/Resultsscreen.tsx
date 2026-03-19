'use client';

import { motion } from 'framer-motion';
import { Trophy, TrendingUp, FileText, BarChart3, CheckCircle2, XCircle, Circle, Hash } from 'lucide-react';

const getGrade = (pct) => {
  if (pct >= 90) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', bar: 'from-emerald-500 to-emerald-400' };
  if (pct >= 70) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', bar: 'from-blue-500 to-blue-400' };
  if (pct >= 50) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', bar: 'from-amber-500 to-amber-400' };
  return { label: 'Needs Work', color: 'text-red-600', bg: 'bg-red-50 border-red-200', bar: 'from-red-500 to-red-400' };
};

export const ResultsScreen = ({ result, onHome }) => {
  const pct = result.percentage;
  const grade = getGrade(pct);

  const correctCount = result.questions.filter((q) => q.is_correct).length;
  const wrongCount = result.questions.filter((q) => !q.is_correct && q.user_selected_option_id !== null).length;
  const skippedCount = result.questions.filter((q) => q.user_selected_option_id === null).length;

  const submittedDate = new Date(result.submittedAt).toLocaleString('en-IN', {
    dateStyle: 'medium', timeStyle: 'short',
  });

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-10 space-y-3">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center pb-2">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
            className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-3 ${result.passed ? 'bg-amber-50 border-amber-200' : 'bg-gray-100 border-gray-200'}`}
          >
            <Trophy size={26} className={result.passed ? 'text-amber-500' : 'text-gray-400'} />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Quiz Submitted</h2>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${grade.bg} ${grade.color}`}>
            <TrendingUp size={11} />
            {grade.label} · {result.passed ? 'Passed ✓' : 'Not Passed'}
          </div>
          <p className="text-xs text-gray-400 mt-2">{submittedDate} · Attempt #{result.attemptNumber}</p>
        </motion.div>

        {/* Score card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Score</p>
              <p className="text-4xl font-black text-gray-900 tabular-nums leading-none">
                {result.score}
                <span className="text-base text-gray-400 font-semibold"> / {result.totalMarks}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black tabular-nums leading-none" style={{ color: pct >= 50 ? '#16a34a' : '#dc2626' }}>
                {pct}%
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Pass: {result.passingMarks} marks</p>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r rounded-full ${grade.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(pct, 100)}%` }}
              transition={{ delay: 0.3, duration: 0.9, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-400">0</span>
            <span className="text-xs text-gray-400">{result.totalMarks} marks total</span>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Correct', value: correctCount, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: <CheckCircle2 size={13} /> },
            { label: 'Wrong', value: wrongCount, color: 'text-red-500', bg: 'bg-red-50 border-red-200', icon: <XCircle size={13} /> },
            { label: 'Skipped', value: skippedCount, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', icon: <Circle size={13} /> },
            { label: 'Total', value: result.totalQuestions, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-200', icon: <Hash size={13} /> },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + i * 0.05 }}
              className={`border rounded-xl p-3 text-center shadow-sm ${s.bg}`}
            >
              <span className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</span>
              <p className={`text-xl font-black leading-none ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Question review */}
        {result.questions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 mt-1">
              <FileText size={13} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Question Review</span>
              <span className="ml-auto text-xs text-gray-400">{result.questions.length} questions</span>
            </div>

            <div className="space-y-3">
              {result.questions.map((q, i) => {
                const isCorrect = q.is_correct;
                const isSkipped = q.user_selected_option_id === null;

                const cardBorder = isCorrect ? 'border-emerald-200' : isSkipped ? 'border-amber-200' : 'border-red-200';
                const headerBg = isCorrect ? 'bg-emerald-50' : isSkipped ? 'bg-amber-50' : 'bg-red-50';
                const statusLabel = isCorrect
                  ? { text: 'Correct', color: 'text-emerald-600', bg: 'bg-emerald-100 border-emerald-300' }
                  : isSkipped
                    ? { text: 'Not Attempted', color: 'text-amber-600', bg: 'bg-amber-100 border-amber-300' }
                    : { text: 'Incorrect', color: 'text-red-600', bg: 'bg-red-100 border-red-300' };

                return (
                  <motion.div
                    key={q.question_id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className={`border rounded-2xl overflow-hidden shadow-sm bg-white ${cardBorder}`}
                  >
                    <div className={`px-4 py-3 ${headerBg}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-500">Q{i + 1}</span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${statusLabel.bg} ${statusLabel.color}`}>
                            {statusLabel.text}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
                          {q.marks_awarded} / {q.marks_total}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800">{q.question_text}</p>
                    </div>

                    <div className="px-4 py-3 space-y-2">
                      {q.options?.map((opt, oi) => {
                        const isUserPick = opt.option_id === q.user_selected_option_id;
                        const isCorrectOpt = opt.option_id === q.correct_option_id;

                        let optStyle = 'bg-gray-50 border-gray-200 text-gray-600';
                        let badge = null;

                        if (isCorrectOpt) {
                          optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800';
                          badge = <span className="ml-auto text-xs text-emerald-600 font-semibold">✅ Correct Answer</span>;
                        }
                        if (isUserPick && !isCorrect) {
                          optStyle = 'bg-red-50 border-red-300 text-red-800';
                          badge = <span className="ml-auto text-xs text-red-600 font-semibold">❌ Your Answer</span>;
                        }
                        if (isUserPick && isCorrect) {
                          optStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900';
                          badge = <span className="ml-auto text-xs text-emerald-700 font-semibold">✅ Your Answer</span>;
                        }

                        return (
                          <div key={opt.option_id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs ${optStyle}`}>
                            <span className="w-5 h-5 flex items-center justify-center bg-gray-200 rounded text-xs font-bold">
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span className="flex-1">{opt.option_text}</span>
                            {badge}
                          </div>
                        );
                      })}

                      {isSkipped && <div className="text-xs text-amber-600">⚠️ Not Attempted</div>}
                    </div>

                    {q.explanation && (
                      <div className="px-4 pb-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
                          <p className="text-xs font-bold text-blue-700">Explanation</p>
                          <p className="text-xs text-blue-600">{q.explanation}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={onHome}
          className="w-full h-11 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-colors mt-2"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};