"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
  ArrowLeft,
  Home,
  RefreshCw,
  Trophy,
  User,
  Mail,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Star,
} from "lucide-react";

export default function ResultDetailPage({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (submissionId) fetchResult();
  }, [submissionId]);

  const fetchResult = async () => {
    if (!submissionId) return;
    setLoading(true);
    setRefreshing(true);
    try {
      const res = await axiosInstance.get(`/testseriess/submission-one/${submissionId}`);
      if (res.data?.success) {
        const data = res.data.data;
        const parsedUrls = Array.isArray(data.answerSheetUrls)
          ? data.answerSheetUrls
          : data.answerSheetUrls ? JSON.parse(data.answerSheetUrls) : [];
        setSubmission({ ...data, answerSheetUrls: parsedUrls });
      }
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openPDF = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const downloadPDF = async (url: string, filename: string) => {
    try {
      setDownloadProgress((p) => ({ ...p, [filename]: 0 }));
      const response = await fetch(url);
      if (!response.ok) throw new Error();
      const total = parseInt(response.headers.get("content-length") || "0", 10);
      const reader = response.body?.getReader();
      if (!reader) throw new Error();
      let received = 0;
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          setDownloadProgress((p) => ({ ...p, [filename]: total ? Math.round((received / total) * 100) : 50 }));
        }
      }
      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      setDownloadProgress((p) => { const n = { ...p }; delete n[filename]; return n; });
    } catch {
      setDownloadProgress((p) => { const n = { ...p }; delete n[filename]; return n; });
    }
  };

  if (loading && !submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-500">Loading your result...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <AlertCircle size={36} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-gray-800 mb-1">Result not found</h2>
          <p className="text-xs text-gray-500 mb-4">The submission could not be loaded.</p>
          <button
            onClick={() => router.back()}
            className="h-9 px-5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const scorePercentage = submission.totalMarks
    ? ((submission.marksObtained / submission.totalMarks) * 100).toFixed(1)
    : "0.0";
  const isHighScore = parseFloat(scorePercentage) >= 70;

  const statusColor: Record<string, { bg: string; text: string; border: string }> = {
    approved: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} className="text-gray-700" />
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
            >
              <Home size={14} />Home
            </button>
          </div>
          <h1 className="text-sm font-semibold text-gray-800">Result</h1>
          <button
            onClick={fetchResult}
            disabled={refreshing}
            className="flex items-center gap-1.5 h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-4">

        {/* Score card */}
        <div className={`rounded-2xl p-6 text-white relative overflow-hidden ${isHighScore ? "bg-green-600" : "bg-red-600"}`}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 bg-white -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full opacity-10 bg-white translate-y-6 -translate-x-6" />

          <div className="flex items-center justify-between relative">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <Trophy size={14} />
                </div>
                <span className="text-xs font-semibold opacity-90">Result Published</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black">{submission.marksObtained}</span>
                <span className="text-lg opacity-70 font-medium">/ {submission.totalMarks}</span>
              </div>
              <div className="text-xs mt-1 opacity-80">Marks Obtained</div>
              {isHighScore && (
                <div className="flex items-center gap-1 mt-3 bg-white/20 w-fit px-2.5 py-1 rounded-full">
                  <Star size={10} className="fill-white" />
                  <span className="text-[10px] font-semibold">Outstanding Performance</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-5xl font-black">{scorePercentage}%</div>
              <div className="text-xs opacity-70 mt-1">Score</div>
              <div className={`mt-3 text-[10px] font-bold px-2.5 py-1 rounded-full w-fit ml-auto ${isHighScore ? "bg-white/25" : "bg-white/20"}`}>
                {isHighScore ? "PASS" : "REVIEW"}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 relative">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${Math.min(parseFloat(scorePercentage), 100)}%` }}
              />
            </div>
            <div className="text-[10px] opacity-70 mt-1.5">Performance: {scorePercentage}%</div>
          </div>
        </div>

        {/* Student info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Student Details</h2>
          <div className="space-y-2.5">
            {[
              { icon: User, label: "Name", value: submission.User?.name || "—" },
              { icon: Mail, label: "Email", value: submission.User?.email || "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-gray-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-400">{label}</div>
                  <div className="text-xs font-medium text-gray-800 truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submitted sheets */}
        {submission.answerSheetUrls?.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Submitted Answer Sheets</h2>
            <div className="space-y-2">
              {submission.answerSheetUrls.map((url: string, index: number) => {
                const fileKey = `submitted_${index}`;
                const progress = downloadProgress[fileKey];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-50 border border-red-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-800">Answer Sheet {index + 1}</div>
                      {progress !== undefined ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="text-[10px] text-red-600 font-medium shrink-0">{progress}%</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-gray-400 mt-0.5">PDF · Submitted</div>
                      )}
                    </div>
                    {progress === undefined && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openPDF(url)}
                          className="flex items-center gap-1 h-7 px-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-[10px] font-medium rounded-lg transition-colors"
                        >
                          <ExternalLink size={10} /> View
                        </button>
                        <button
                          onClick={() => downloadPDF(url, `submitted_sheet_${index + 1}`)}
                          className="flex items-center gap-1 h-7 px-2.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 text-[10px] font-medium rounded-lg transition-colors"
                        >
                          <Download size={10} /> Save
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Evaluated sheet */}
        {submission.answerCheckedUrl && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Evaluated Copy</h2>
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-800">Checked & Evaluated</div>
                <div className="text-[10px] text-green-600 mt-0.5">Reviewed by evaluator</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openPDF(submission.answerCheckedUrl)}
                  className="flex items-center gap-1 h-7 px-2.5 bg-white border border-green-200 hover:border-green-300 text-green-700 text-[10px] font-medium rounded-lg transition-colors"
                >
                  <ExternalLink size={10} /> View
                </button>
                <button
                  onClick={() => downloadPDF(submission.answerCheckedUrl, "checked_answer_sheet")}
                  className="flex items-center gap-1 h-7 px-2.5 bg-white border border-green-200 hover:border-green-300 text-green-700 text-[10px] font-medium rounded-lg transition-colors"
                >
                  <Download size={10} /> Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {submission.reviewStatus && submission.reviewStatus !== "pending" && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Evaluator Feedback</h2>
            <div className={`inline-flex items-center h-6 px-2.5 rounded-full text-[10px] font-bold border mb-3 ${statusColor[submission.reviewStatus]?.bg || "bg-gray-50"} ${statusColor[submission.reviewStatus]?.text || "text-gray-700"} ${statusColor[submission.reviewStatus]?.border || "border-gray-200"}`}>
              {submission.reviewStatus.charAt(0).toUpperCase() + submission.reviewStatus.slice(1)}
            </div>
            {submission.reviewComment ? (
              <div className="border-l-2 border-red-300 pl-3 py-1">
                <p className="text-xs text-gray-600 italic leading-relaxed">"{submission.reviewComment}"</p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No additional comments provided.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}