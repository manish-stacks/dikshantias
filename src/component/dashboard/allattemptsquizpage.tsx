"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Clock, Calendar, CheckCircle, BarChart2, Loader2 } from "lucide-react";
import type { AttemptFilter } from "@/types";
import { useAuthStore } from "@/lib/store/auth.store";
import { useAttemptsStore } from "@/lib/store/profile.store";
import { formatDateTime } from "@/types/utils.web";

const FILTER_OPTIONS: { key: AttemptFilter; label: string }[] = [
  { key: "all",    label: "All Attempts" },
  { key: "passed", label: "Passed" },
  { key: "failed", label: "Failed" },
];

export default function AllAttemptsQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { quizTitle, allAttempts, totalAllowed, loading, error, fetchAttempts } = useAttemptsStore();
  const [activeFilter, setActiveFilter] = useState<AttemptFilter>("all");
  const [refreshing, setRefreshing] = useState(false);

  const quizId = params?.quizId as string;

  const load = useCallback(
    async (isRefresh = false) => {
      if (!quizId || !user?.id) return;
      if (isRefresh) setRefreshing(true);
      await fetchAttempts(quizId);
      if (isRefresh) setRefreshing(false);
    },
    [quizId, user?.id, fetchAttempts]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Client-side filter
  const filtered =
    activeFilter === "all"
      ? allAttempts
      : activeFilter === "passed"
      ? allAttempts.filter((a) => a.passed)
      : allAttempts.filter((a) => !a.passed);

  const countFor = (key: AttemptFilter) => {
    if (key === "all")    return allAttempts.length;
    if (key === "passed") return allAttempts.filter((a) => a.passed).length;
    return allAttempts.filter((a) => !a.passed).length;
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-red-600" />
        <p className="text-sm text-gray-400">Loading attempts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <p className="text-lg font-bold text-gray-800">Error</p>
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => load()}
          className="mt-3 px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900">{quizTitle}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Total Attempts Allowed: <span className="font-semibold text-gray-700">{totalAllowed}</span>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors ${
                activeFilter === f.key
                  ? "bg-red-600 border-red-600 text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {f.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeFilter === f.key ? "bg-red-500 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {countFor(f.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="flex justify-end px-4 pt-3">
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Loader2 size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Attempts List */}
        <div className="px-4 pb-10 pt-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <Clock size={56} className="text-gray-200" />
              <p className="text-base font-bold text-gray-800">
                {activeFilter === "all"
                  ? "No Attempts Yet"
                  : `No ${activeFilter === "passed" ? "Passed" : "Failed"} Attempts`}
              </p>
              <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed">
                {activeFilter === "all"
                  ? "Start the quiz to see your attempt history here."
                  : "Try again to improve your score!"}
              </p>
            </div>
          ) : (
            filtered.map((attempt) => (
              <div
                key={attempt.attemptId}
                className="bg-white border border-gray-200 rounded-2xl p-4"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-gray-900">
                    Attempt #{attempt.attemptNumber}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      attempt.passed
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {attempt.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={13} />
                    Started: {formatDateTime(attempt.startedAt)}
                  </div>
                  {attempt.completedAt && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CheckCircle size={13} />
                      Completed: {formatDateTime(attempt.completedAt)}
                    </div>
                  )}
                </div>

                {/* Score Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-3">
                  <span className="text-base font-bold text-gray-900">
                    Score: {attempt.score ?? 0} marks
                  </span>
                  <span className="text-base font-bold text-red-600">
                    {attempt.percentage != null ? `${attempt.percentage}%` : "N/A"}
                  </span>
                </div>

                {/* View Result Button */}
                <button
                  onClick={() => router.push(`/quiz/result/${attempt.attemptId}`)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <BarChart2 size={17} />
                  View Detailed Result
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}