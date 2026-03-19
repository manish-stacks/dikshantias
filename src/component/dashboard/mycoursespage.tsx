"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, GraduationCap, Clock, CheckCircle2, ChevronRight, IndianRupee, CalendarDays, Timer } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCourseStore } from "@/lib/store/profile.store";
import { formatDate, getStatusColor, getProgressWidth, getExpiryText } from "@/types/utils.web";
import type { CourseTab } from "@/types";

// ─── Tabs Config ───────────────────────────────────────────────────────────────

const TABS: { key: CourseTab; label: string; icon: React.ElementType }[] = [
  { key: "all",          label: "All",         icon: BookOpen      },
  { key: "in-progress",  label: "In Progress", icon: Clock         },
  { key: "completed",    label: "Completed",   icon: CheckCircle2  },
];

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status, expired }: { status: string; expired: boolean }) {
  if (expired) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-400 border border-gray-200">
        Expired
      </span>
    );
  }
  const colorMap: Record<string, string> = {
    "In Progress": "bg-blue-50 text-blue-600 border-blue-200",
    "Completed":   "bg-emerald-50 text-emerald-600 border-emerald-200",
    "Start Soon":  "bg-amber-50 text-amber-600 border-amber-200",
    "Active":      "bg-indigo-50 text-indigo-600 border-indigo-200",
  };
  const cls = colorMap[status] ?? "bg-slate-50 text-slate-500 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cls}`}>
      {status}
    </span>
  );
}

// ─── Progress Label ────────────────────────────────────────────────────────────

function progressLabel(expired: boolean, status?: string) {
  if (expired) return "Expired";
  if (status === "Completed")  return "Completed";
  if (status === "In Progress") return "In Progress";
  if (status === "Start Soon")  return "Not Started";
  return "Ongoing";
}

// ─── Progress Bar Color ────────────────────────────────────────────────────────

function progressBarColor(expired: boolean, status?: string) {
  if (expired) return "bg-gray-300";
  if (status === "Completed")  return "bg-emerald-500";
  if (status === "In Progress") return "bg-blue-500";
  if (status === "Start Soon")  return "bg-amber-400";
  return "bg-indigo-500";
}

// ─── Progress Width ────────────────────────────────────────────────────────────

function progressPercent(expired: boolean, status?: string) {
  if (expired) return "w-full";
  if (status === "Completed")   return "w-full";
  if (status === "In Progress") return "w-3/5";
  if (status === "Start Soon")  return "w-0";
  return "w-2/5";
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MyCoursesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { courses, loading, fetchCourses } = useCourseStore();
  const [selectedTab, setSelectedTab] = useState<CourseTab>("all");

  useEffect(() => {
    if (user?.id) fetchCourses(user.id);
  }, [user?.id, fetchCourses]);

  const filtered = courses.filter((order) => {
    if (selectedTab === "all")         return true;
    if (selectedTab === "in-progress") return order.batch?.c_status === "In Progress";
    if (selectedTab === "completed")   return order.batch?.c_status === "Completed";
    return true;
  });

  const handleCoursePress = (order: typeof courses[0]) => {
    if (order.expired) return;
    const batch = order.batch;
    const url = batch?.category === "online" ? "/my-course" : "/my-course-subjects";
    router.push(`${url}?courseId=${batch?.id}&unlocked=true`);
  };

  // ── Tab counts ──
  const counts = {
    all:          courses.length,
    "in-progress": courses.filter(o => o.batch?.c_status === "In Progress").length,
    completed:    courses.filter(o => o.batch?.c_status === "Completed").length,
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-red-600" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Loading your courses</p>
          <p className="text-xs text-slate-400 mt-1">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  // ── Empty State ──────────────────────────────────────────────────────────────
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
        <GraduationCap size={36} className="text-slate-300" />
      </div>
      <div className="text-center">
        <p className="text-base font-bold text-slate-600">No courses found</p>
        <p className="text-sm text-slate-400 mt-1">
          {selectedTab === "all"
            ? "You haven't enrolled in any courses yet."
            : `No ${selectedTab.replace("-", " ")} courses at the moment.`}
        </p>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ╔══════════════════════════════════════════════════════╗
          ║              MOBILE LAYOUT  (< lg)                  ║
          ╚══════════════════════════════════════════════════════╝ */}
      <div className="lg:hidden">

        {/* Mobile Header */}
        <div className="bg-white border-b border-slate-100 px-4 pt-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">My Courses</h1>
              <p className="text-xs text-slate-400 mt-0.5">{courses.length} enrolled course{courses.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <BookOpen size={18} className="text-red-600" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = selectedTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-colors rounded-t-xl ${
                    active
                      ? "text-red-600 bg-red-50"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <Icon size={13} />
                  {tab.label}
                  {counts[tab.key] > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
                    }`}>
                      {counts[tab.key]}
                    </span>
                  )}
                  {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-t" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Course List */}
        <div className="px-4 pt-4 pb-12 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((order) => {
              const { batch, expired, expiryDate } = order;
              const expiryText = getExpiryText(order, expiryDate ?? null, expired);
              const barColor   = progressBarColor(expired, batch?.c_status);
              const barWidth   = progressPercent(expired, batch?.c_status);
              const label      = progressLabel(expired, batch?.c_status);

              return (
                <div
                  key={order.id}
                  onClick={() => handleCoursePress(order)}
                  className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all ${
                    expired
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
                  }`}
                >
                  {/* Top color accent */}
                  <div className={`h-1 w-full ${barColor}`} />

                  <div className="p-4">
                    {/* Badge + arrow */}
                    <div className="flex items-start justify-between mb-3">
                      <StatusBadge status={batch?.c_status ?? "Active"} expired={expired} />
                      {!expired && <ChevronRight size={16} className="text-slate-300 mt-0.5" />}
                    </div>

                    {/* Title */}
                    <h3 className={`text-base font-bold leading-snug line-clamp-2 mb-1 ${expired ? "text-slate-400" : "text-slate-800"}`}>
                      {batch?.name ?? "Untitled Course"}
                    </h3>

                    {batch?.program?.name && (
                      <p className="text-xs text-slate-400 mb-3 font-medium">{batch.program.name}</p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee size={12} className="text-red-500" />
                        <span className="text-sm font-bold text-red-600">
                          {order.totalAmount?.toLocaleString("en-IN") ?? "0"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CalendarDays size={11} />
                        <span className="text-xs">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <Timer size={11} className={expired ? "text-red-400" : "text-amber-400"} />
                      <p className={`text-xs font-medium ${expired ? "text-red-400" : "text-amber-500"}`}>
                        {expiryText}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${barColor} ${barWidth}`} />
                      </div>
                      <span className={`text-[11px] font-semibold whitespace-nowrap ${expired ? "text-slate-400" : "text-slate-500"}`}>
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ╔══════════════════════════════════════════════════════╗
          ║             DESKTOP LAYOUT  (≥ lg)                  ║
          ╚══════════════════════════════════════════════════════╝ */}
      <div className="hidden lg:block max-w-6xl mx-auto px-8 py-10">

        {/* Desktop Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Courses</h1>
            <p className="text-sm text-slate-400 mt-1">Track your learning journey and progress</p>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: "Total",       value: counts.all,            color: "bg-indigo-50 text-indigo-600"  },
              { label: "In Progress", value: counts["in-progress"],  color: "bg-blue-50 text-blue-600"     },
              { label: "Completed",   value: counts.completed,       color: "bg-emerald-50 text-emerald-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`flex flex-col items-center px-5 py-2.5 rounded-xl ${color}`}>
                <span className="text-xl font-bold">{value}</span>
                <span className="text-[11px] font-semibold mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="flex gap-2 mb-6 bg-white border border-slate-100 rounded-2xl p-1.5 w-fit shadow-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = selectedTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={15} />
                {tab.label}
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Course Grid */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map((order) => {
              const { batch, expired, expiryDate } = order;
              const expiryText = getExpiryText(order, expiryDate ?? null, expired);
              const barColor   = progressBarColor(expired, batch?.c_status);
              const barWidth   = progressPercent(expired, batch?.c_status);
              const label      = progressLabel(expired, batch?.c_status);

              return (
                <div
                  key={order.id}
                  onClick={() => handleCoursePress(order)}
                  className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all ${
                    expired
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer hover:shadow-lg hover:-translate-y-1 active:scale-[0.99]"
                  }`}
                >
                  {/* Top accent bar */}
                  <div className={`h-1.5 w-full ${barColor}`} />

                  <div className="p-5">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-4">
                      <StatusBadge status={batch?.c_status ?? "Active"} expired={expired} />
                      {!expired && (
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                          <ChevronRight size={15} className="text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Title + Program */}
                    <h3 className={`text-base font-bold leading-snug line-clamp-2 mb-1 ${expired ? "text-slate-400" : "text-slate-800"}`}>
                      {batch?.name ?? "Untitled Course"}
                    </h3>
                    {batch?.program?.name && (
                      <p className="text-sm text-slate-400 font-medium mb-4">{batch.program.name}</p>
                    )}

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl">
                        <IndianRupee size={13} className="text-red-500 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium">Amount Paid</p>
                          <p className="text-sm font-bold text-red-600">
                            ₹{order.totalAmount?.toLocaleString("en-IN") ?? "0"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 rounded-xl">
                        <CalendarDays size={13} className="text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-medium">Enrolled On</p>
                          <p className="text-sm font-bold text-slate-600">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Expiry */}
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 rounded-xl">
                      <Timer size={13} className={expired ? "text-red-400" : "text-amber-500"} />
                      <p className={`text-xs font-semibold ${expired ? "text-red-500" : "text-amber-600"}`}>
                        {expiryText}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${barColor} ${barWidth}`} />
                      </div>
                      <span className={`text-xs font-semibold whitespace-nowrap ${expired ? "text-slate-400" : "text-slate-500"}`}>
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}