"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, SlidersHorizontal, HelpCircle, Eye, BarChart2, Loader2, Trophy } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useQuizStore } from "@/lib/store/profile.store";

export default function MyAllQuizPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { quizzes, loading, fetchQuizzes } = useQuizStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user?.id) fetchQuizzes(user.id);
  }, [user?.id, fetchQuizzes]);

  const filtered = quizzes.filter((q) =>
    q.quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startQuiz = (quizId: string, canAttempt: boolean) => {
    if (!canAttempt) return;
    router.push(`/quiz/${quizId}?purchased=true`);
  };

  const viewResult = (quizId: string) => {
    router.push(`/profile/quiz-attempts/${quizId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto pb-10">

        {/* Hero Banner */}
        <div className="relative bg-slate-800 mx-4 mt-4 rounded-2xl p-5 overflow-hidden">
          {/* Trophy image (decorative) */}
          <div className="absolute right-3 top-3 opacity-20">
            <Trophy size={100} className="text-yellow-300" />
          </div>

          <h2 className="text-xl font-extrabold text-white mb-2 relative z-10">
            Test Your Knowledge with Quizzes
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-5 relative z-10 max-w-xs">
            Sharpen your UPSC preparation with our curated quiz collection.
          </p>
          <button className="relative z-10 bg-white text-slate-800 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-slate-100 transition-colors">
            Play Now
          </button>
        </div>

        {/* Search Bar */}
        <div className="mx-4 mt-4 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-gray-800 outline-none placeholder-gray-400 bg-transparent"
          />
          <SlidersHorizontal size={18} className="text-gray-400 shrink-0" />
        </div>

        {/* Categories */}
        {quizzes.length > 0 && (
          <div className="mt-6">
            <h3 className="text-base font-bold text-gray-900 px-4 mb-3">Categories</h3>
            <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
              {quizzes.slice(0, 8).map((item) => (
                <button
                  key={item.quiz.id}
                  onClick={() => startQuiz(item.quiz.id, item.quiz.canAttempt)}
                  className="flex flex-col items-center shrink-0 w-20 gap-2"
                >
                  <div className="w-[70px] h-[70px] rounded-2xl overflow-hidden border border-gray-100 bg-gray-100 relative">
                    {item.quiz.image ? (
                      <Image
                        src={item.quiz.image}
                        alt={item.quiz.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HelpCircle size={28} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 text-center leading-tight line-clamp-2">
                    {item.quiz.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mt-6">
          <h3 className="text-base font-bold text-gray-900 px-4 mb-3">Recent Activity</h3>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16">
              <HelpCircle size={48} className="text-gray-300" />
              <p className="text-sm text-gray-400 font-medium">No quizzes found</p>
            </div>
          ) : (
            <div className="px-4 space-y-3">
              {filtered.map(({ quiz }) => {
                const attemptsLeft = quiz.attemptLimit - quiz.attemptsUsed;
                const canAttempt = quiz.canAttempt;

                return (
                  <div
                    key={quiz.id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4"
                  >
                    {/* Quiz Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 relative">
                      {quiz.image ? (
                        <Image src={quiz.image} alt={quiz.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HelpCircle size={24} className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                        {quiz.title}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">{quiz.totalQuestions} Questions</p>

                      {/* Attempts Remaining Badge */}
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${
                          attemptsLeft > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {attemptsLeft > 0 ? `${attemptsLeft} attempts left` : "No attempts left"}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => startQuiz(quiz.id, canAttempt)}
                          disabled={!canAttempt}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            canAttempt
                              ? "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                              : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <Eye size={12} />
                          Start
                        </button>
                        <button
                          onClick={() => viewResult(quiz.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                          <BarChart2 size={12} />
                          Results
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}