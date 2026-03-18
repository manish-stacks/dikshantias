"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Lock,
  Radio,
  PlayCircle,
  CalendarDays,
  VideoOff,
  Clock,
  X,
  Sparkles,
} from "lucide-react";
import { useSocket } from "@/lib/socket";
import Cookies from "js-cookie";

interface Video {
  id: string | number;
  title: string;
  secureToken: string;
  batchId: string | number;
  dateOfClass?: string;
  TimeOfClass?: string;
  DateOfLive?: string;
  TimeOfLIve?: string;
  isLive: boolean;
  isEnded: boolean;
}

interface VideoListProps {
  videos: Video[];
  currentVideo?: Video | null;
  courseId: string;
  startDate: string;
  endDate: string;
  userId: string;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function VideoList({
  videos,
  currentVideo,
  courseId,
  startDate,
  endDate,
  userId,
}: VideoListProps) {
  const { socket } = useSocket();
  const token = Cookies.get("authToken");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [lockedModalVisible, setLockedModalVisible] = useState(false);
  const [lockedVideoInfo, setLockedVideoInfo] = useState<Video | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const { fromDate, toDate } = useMemo(() => {
    if (!startDate || !endDate) return { fromDate: undefined, toDate: undefined };
    return { fromDate: new Date(startDate), toDate: new Date(endDate) };
  }, [startDate, endDate]);

  const datesWithVideos = useMemo(() => {
    const set = new Set<string>();
    videos.forEach((v) => {
      const dateStr = v.isLive ? v.DateOfLive : v.dateOfClass;
      if (dateStr && dateStr !== "0000-00-00") set.add(dateStr);
    });
    return set;
  }, [videos]);

  const highlightedDates = useMemo(() => {
    return Array.from(datesWithVideos).map((s) => new Date(s));
  }, [datesWithVideos]);

  const videosForSelectedDate = useMemo(() => {
    return videos
      .filter((video) => {
        const videoDateStr = video.isLive ? video.DateOfLive : video.dateOfClass;
        if (!videoDateStr || videoDateStr === "0000-00-00") return false;
        const d = new Date(videoDateStr);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === selectedDate.getTime();
      })
      .sort((a, b) => {
        const timeA = a.isLive ? a.TimeOfLIve : a.TimeOfClass;
        const timeB = b.isLive ? b.TimeOfLIve : b.TimeOfClass;
        if (!timeA || !timeB) return 0;
        return new Date(`2000-01-01 ${timeA}`) < new Date(`2000-01-01 ${timeB}`) ? -1 : 1;
      });
  }, [videos, selectedDate]);

  const isVideoLocked = (video: Video) => {
    const dateStr = video.isLive ? video.DateOfLive : video.dateOfClass;
    const timeStr = video.isLive ? video.TimeOfLIve : video.TimeOfClass;
    if (!dateStr || !timeStr || dateStr === "0000-00-00") return true;
    return new Date(`${dateStr}T${timeStr}`) > new Date();
  };

  const handleVideoPress = (video: Video) => {
    if (isVideoLocked(video)) {
      setLockedVideoInfo(video);
      setLockedModalVisible(true);
      return;
    }
    const params = new URLSearchParams({
      video: video.secureToken,
      batchId: String(video.batchId),
      userId,
      token: token ?? "",
      videoId: String(video.id),
      courseId,
    }).toString();
    window.open(`${process.env.NEXT_PUBLIC_PLAYER_URL}/?${params}`, "_blank");
    if (socket && video.isLive && !video.isEnded) {
      socket.emit("join-chat", { videoId: video.id, userId });
    }
  };

  useEffect(() => {
    return () => {
      if (socket && currentVideo?.isLive && currentVideo.id) {
        socket.emit("leave-chat", { videoId: currentVideo.id, userId });
      }
    };
  }, [socket, currentVideo, userId]);

  const formatDateKey = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr || timeStr === "00:00:00") return null;
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatSelectedDate = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const monthPills = useMemo(() => {
    if (!fromDate || !toDate) return [];
    const months: Date[] = [];
    let current = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }
    return months;
  }, [fromDate, toDate]);

  if (!videos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
          <VideoOff size={32} className="text-slate-300" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-slate-600">No Videos Yet</p>
          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            Videos will appear here once your instructor adds them.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .rdp-root {
          --rdp-accent-color: #4f46e5;
          --rdp-accent-background-color: #eef2ff;
          font-family: inherit;
          width: 100%;
        }
        .rdp-month_caption { display: none; }
        .rdp-nav { display: none; }
        .rdp-weekday {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          width: 36px;
          text-align: center;
          padding-bottom: 6px;
        }
        .rdp-day {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          position: relative;
          transition: background 0.12s, transform 0.1s;
        }
        .rdp-day:not([data-selected]):not([data-today]):hover {
          background: #f1f5f9;
          transform: scale(1.08);
        }
        .rdp-day[data-today]:not([data-selected]) {
          background: #eef2ff;
          color: #4f46e5;
          font-weight: 800;
          box-shadow: 0 0 0 1.5px #c7d2fe inset;
        }
        .rdp-day[data-selected] .rdp-day_button,
        .rdp-day[data-selected] {
          background: #4f46e5 !important;
          color: #fff !important;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(79,70,229,0.35);
        }
        .rdp-day_button {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rdp-outside { opacity: 0.25; }
        .rdp-months { width: 100%; }
        .rdp-month { width: 100%; }
        .rdp-month_grid {
          width: 100%;
          border-collapse: separate;
          border-spacing: 2px 2px;
        }
        .rdp-week td { width: calc(100% / 7); }
        .has-video::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ef4444;
          pointer-events: none;
          z-index: 10;
        }
        .rdp-day[data-selected] .has-video::after {
          background: rgba(255,255,255,0.75);
        }
      `}</style>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:gap-7">

          {/* ── CALENDAR PANEL ─────────────────────────────────── */}
          <div className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 mb-6 lg:mb-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-6">

              {/* Month nav header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <p className="text-sm font-bold text-slate-800">
                  {MONTH_NAMES[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                </p>
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                  className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              {/* DayPicker */}
              <div className="px-3 pb-2 pt-2">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(day) => {
                    if (day) setSelectedDate(day);
                  }}
                  month={calendarMonth}
                  onMonthChange={setCalendarMonth}
                  fromDate={fromDate}
                  toDate={toDate}
                  modifiers={{ hasVideo: highlightedDates }}
                  modifiersClassNames={{ hasVideo: "has-video" }}
                  showOutsideDays
                  hideNavigation
                />
              </div>

              {/* Legend */}
              <div className="flex items-center gap-5 px-4 py-3 bg-slate-50/60 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-[11px] text-slate-400 font-medium">Has class</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="text-[11px] text-slate-400 font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-200" />
                  <span className="text-[11px] text-slate-400 font-medium">Today</span>
                </div>
              </div>

              {/* Jump-to-month pills */}
              {monthPills.length > 1 && (
                <div className="px-4 pt-3 pb-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    Jump to Month
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-[88px] overflow-y-auto">
                    {monthPills.map((m, idx) => {
                      const active =
                        m.getMonth() === calendarMonth.getMonth() &&
                        m.getFullYear() === calendarMonth.getFullYear();
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setCalendarMonth(new Date(m.getFullYear(), m.getMonth(), 1));
                          }}
                          className={[
                            "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all",
                            active
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                          ].join(" ")}
                        >
                          {m.toLocaleString("default", { month: "short" })}{" "}
                          {m.getFullYear()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── LECTURE LIST PANEL ─────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Date header */}
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 leading-tight">
                  {formatSelectedDate(selectedDate)}
                </h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <CalendarDays size={11} />
                  {videosForSelectedDate.length === 0
                    ? "No classes scheduled"
                    : `${videosForSelectedDate.length} ${videosForSelectedDate.length === 1 ? "class" : "classes"} scheduled`}
                </p>
              </div>

              {videosForSelectedDate.some(
                (v) => v.isLive && !v.isEnded && !isVideoLocked(v)
              ) && (
                <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  Live Today
                </span>
              )}
            </div>

            {/* Empty state */}
            {videosForSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <CalendarDays size={24} className="text-slate-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500">No classes on this day</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a date with a red dot to see scheduled classes
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {videosForSelectedDate.map((video, idx) => {
                  const locked = isVideoLocked(video);
                  const isCurrentlyLive = video.isLive && !video.isEnded;
                  const timeStr = video.isLive ? video.TimeOfLIve : video.TimeOfClass;
                  const formattedTime = formatTime(timeStr);

                  return (
                    <div
                      key={video.id}
                      onClick={() => handleVideoPress(video)}
                      className={[
                        "group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200",
                        locked
                          ? "border-slate-100 opacity-60 cursor-not-allowed"
                          : isCurrentlyLive
                          ? "border-red-100 shadow-sm shadow-red-50/50 cursor-pointer hover:shadow-md hover:shadow-red-100/60 hover:-translate-y-0.5 active:scale-[0.99]"
                          : "border-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-100 hover:-translate-y-0.5 active:scale-[0.99]",
                      ].join(" ")}
                    >
                      {/* Accent stripe */}
                      <div
                        className={[
                          "h-1 w-full",
                          locked
                            ? "bg-slate-200"
                            : isCurrentlyLive
                            ? "bg-gradient-to-r from-red-500 to-rose-400"
                            : "bg-gradient-to-r from-indigo-500 to-violet-400",
                        ].join(" ")}
                      />

                      <div className="p-4 flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className={[
                            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200",
                            locked
                              ? "bg-slate-100"
                              : isCurrentlyLive
                              ? "bg-red-50 group-hover:scale-110"
                              : "bg-indigo-50 group-hover:scale-110",
                          ].join(" ")}
                        >
                          {locked ? (
                            <Lock size={17} className="text-slate-400" />
                          ) : isCurrentlyLive ? (
                            <Radio size={17} className="text-red-500" />
                          ) : (
                            <PlayCircle size={17} className="text-indigo-500" />
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <h4
                            className={[
                              "text-sm font-semibold leading-snug line-clamp-2 mb-2.5",
                              locked ? "text-slate-400" : "text-slate-800",
                            ].join(" ")}
                          >
                            {video.title}
                          </h4>

                          <div className="flex items-center gap-2.5 flex-wrap">
                            {formattedTime && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                <Clock size={10} />
                                {formattedTime}
                              </span>
                            )}

                            {locked ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                                <Lock size={9} />
                                Locked
                              </span>
                            ) : isCurrentlyLive ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm shadow-red-200">
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                                </span>
                                LIVE
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold shadow-sm shadow-indigo-200">
                                <PlayCircle size={9} />
                                Watch
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Hover arrow */}
                        {!locked && (
                          <div className="hidden sm:flex self-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                            <div
                              className={[
                                "w-7 h-7 rounded-lg flex items-center justify-center",
                                isCurrentlyLive ? "bg-red-50" : "bg-indigo-50",
                              ].join(" ")}
                            >
                              <PlayCircle
                                size={14}
                                className={isCurrentlyLive ? "text-red-400" : "text-indigo-400"}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LOCKED MODAL ───────────────────────────────────────── */}
      {lockedModalVisible && lockedVideoInfo && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setLockedModalVisible(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

          <div
            className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-400" />

            <button
              onClick={() => setLockedModalVisible(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-slate-500" />
            </button>

            <div className="p-6 pt-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                <Lock size={24} className="text-amber-500" />
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-1">
                Class Not Available Yet
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">
                {lockedVideoInfo.title}
              </p>

              <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl mb-5 border border-amber-100">
                <Sparkles size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  This class will be unlocked automatically at its scheduled start time.
                  Come back then to join.
                </p>
              </div>

              <button
                onClick={() => setLockedModalVisible(false)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-200"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}