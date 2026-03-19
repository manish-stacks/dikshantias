"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Lock, Radio, PlayCircle, CalendarDays, VideoOff,
  Clock, X, Sparkles, ChevronLeft, ChevronRight,
  Search, BookOpen, Zap, TrendingUp,
  Video,
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
  isShowVideoAll?: boolean;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function AppDownloadModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
        >
          <X size={16} className="text-gray-600" />
        </button>

        <div className="p-7 pb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center border border-indigo-100 shadow-sm">
            <Video size={32} className="text-indigo-600" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Watch on Dikshant IAS App
          </h3>

          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Video playback is currently available only in the Dikshant IAS mobile application.<br />
            Download the app now to continue watching this lecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Android button */}
            <a
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN" // ← change to real link
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 bg-black text-white py-3.5 px-5 rounded-2xl font-medium hover:bg-gray-900 transition-colors shadow-md"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L18.89,14L16.39,11.5L18.89,9L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Get on Play Store
            </a>

            {/* iOS button - optional */}
            {/* 
            <a
              href="https://apps.apple.com/in/app/dikshant-ias/idXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2.5 bg-black text-white py-3.5 px-5 rounded-2xl font-medium hover:bg-gray-900 transition-colors shadow-md"
            >
              <Apple size={20} />
              Download on App Store
            </a>
            */}
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Already have the app? Please update to the latest version.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VideoList({
  isShowVideoAll = false,
  videos,
  currentVideo,
  courseId,
  startDate,
  endDate,
  userId,
}: VideoListProps) {
  const { socket } = useSocket();
  const token = Cookies.get("authToken");
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
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
  const [searchQuery, setSearchQuery] = useState("");

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

  const highlightedDates = useMemo(() =>
    Array.from(datesWithVideos).map((s) => new Date(s)),
    [datesWithVideos]
  );

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

  const allVideosSorted = useMemo(() => {
    return [...videos]
      .filter(v => searchQuery === "" || v.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const dateA = a.isLive ? a.DateOfLive : a.dateOfClass;
        const dateB = b.isLive ? b.DateOfLive : b.dateOfClass;
        const timeA = a.isLive ? a.TimeOfLIve : a.TimeOfClass;
        const timeB = b.isLive ? b.TimeOfLIve : b.TimeOfClass;
        const dtA = dateA && timeA ? new Date(`${dateA}T${timeA}`).getTime() : 0;
        const dtB = dateB && timeB ? new Date(`${dateB}T${timeB}`).getTime() : 0;
        return dtB - dtA;
      });
  }, [videos, searchQuery]);

  const isVideoLocked = (video: Video) => {
    const dateStr = video.isLive ? video.DateOfLive : video.dateOfClass;
    const timeStr = video.isLive ? video.TimeOfLIve : video.TimeOfClass;
    if (!dateStr || !timeStr || dateStr === "0000-00-00") return true;
    return new Date(`${dateStr}T${timeStr}`) > new Date();
  };

  const handleVideoPress = (video: Video) => {
    // Temporarily disabled redirection to web player
    // if (isVideoLocked(video)) {
    //   setLockedVideoInfo(video);
    //   setLockedModalVisible(true);
    //   return;
    // }

    setShowAppDownloadModal(true);

    // Optional: still track live joins if needed
    // if (socket && video.isLive && !video.isEnded) {
    //   socket.emit("join-chat", { videoId: video.id, userId });
    // }
  };

  // const handleVideoPress = (video: Video) => {
  //   if (isVideoLocked(video)) {
  //     setLockedVideoInfo(video);
  //     setLockedModalVisible(true);
  //     return;
  //   }
  //   const params = new URLSearchParams({
  //     video: video.secureToken,
  //     batchId: String(video.batchId),
  //     userId,
  //     token: token ?? "",
  //     videoId: String(video.id),
  //     courseId,
  //   }).toString();
  //   window.open(`${process.env.NEXT_PUBLIC_PLAYER_URL}/?${params}`, "_blank");
  //   if (socket && video.isLive && !video.isEnded) {
  //     socket.emit("join-chat", { videoId: video.id, userId });
  //   }
  // };

  useEffect(() => {
    return () => {
      if (socket && currentVideo?.isLive && currentVideo.id) {
        socket.emit("leave-chat", { videoId: currentVideo.id, userId });
      }
    };
  }, [socket, currentVideo, userId]);

  const formatTime = (timeStr?: string) => {
    if (!timeStr || timeStr === "00:00:00") return null;
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr === "0000-00-00") return null;
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const formatSelectedDate = (d: Date) =>
    d.toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
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

  // ── SHARED VIDEO CARD ────────────────────────────────────────────
  const VideoCard = ({
    video,
    showDate = false,
    index = 0,
  }: {
    video: Video;
    showDate?: boolean;
    index?: number;
  }) => {
    const locked = isVideoLocked(video);
    const isCurrentlyLive = video.isLive && !video.isEnded;
    const timeStr = video.isLive ? video.TimeOfLIve : video.TimeOfClass;
    const dateStr = video.isLive ? video.DateOfLive : video.dateOfClass;
    const formattedTime = formatTime(timeStr);
    const formattedDate = showDate ? formatDate(dateStr) : null;

    return (
      <div
        onClick={() => handleVideoPress(video)}
        style={{ animationDelay: `${index * 35}ms` }}
        className={[
          "group relative flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-200 animate-fadeIn",
          locked
            ? "bg-gray-50/80 border-gray-100 cursor-not-allowed select-none"
            : isCurrentlyLive
              ? "bg-white border-orange-100 cursor-pointer hover:border-orange-300 hover:shadow-[0_4px_20px_rgba(249,115,22,0.12)] hover:-translate-y-0.5 active:scale-[0.99]"
              : "bg-white border-gray-100 cursor-pointer hover:border-blue-200 hover:shadow-[0_4px_20px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 active:scale-[0.99]",
        ].join(" ")}
      >
        {/* Left accent bar */}
        <div className={[
          "absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-all duration-200",
          locked ? "bg-gray-200" :
            isCurrentlyLive ? "bg-gradient-to-b from-orange-400 to-red-500" :
              "bg-gradient-to-b from-blue-500 to-indigo-600 scale-y-0 group-hover:scale-y-100 origin-center"
        ].join(" ")} />

        {/* Number / icon bubble */}
        <div className={[
          "flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200",
          locked
            ? "bg-gray-100 text-gray-400"
            : isCurrentlyLive
              ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-sm shadow-orange-200"
              : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-sm group-hover:shadow-blue-200"
        ].join(" ")}>
          {locked
            ? <Lock size={13} />
            : isCurrentlyLive
              ? <Radio size={13} />
              : <span className="font-extrabold">{index + 1}</span>
          }
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={[
            "text-[13.5px] font-semibold leading-snug line-clamp-2 mb-1 transition-colors duration-150",
            locked
              ? "text-gray-400"
              : isCurrentlyLive
                ? "text-gray-900 group-hover:text-orange-600"
                : "text-gray-800 group-hover:text-blue-700"
          ].join(" ")}>
            {video.title}
          </h4>

          <div className="flex items-center gap-3 flex-wrap">
            {formattedDate && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                <CalendarDays size={10} />
                {formattedDate}
              </span>
            )}
            {formattedTime && (
              <span className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                <Clock size={10} />
                {formattedTime}
              </span>
            )}
          </div>
        </div>

        {/* CTA badge */}
        <div className="flex-shrink-0 ml-1">
          {locked ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-[11px] font-bold border border-amber-100">
              <Lock size={9} />
              Upcoming
            </span>
          ) : isCurrentlyLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500 text-white text-[11px] font-bold shadow-sm shadow-red-200">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-all duration-200 bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 group-hover:shadow-sm group-hover:shadow-blue-200">
              <PlayCircle size={11} />
              Watch
            </span>
          )}
        </div>
      </div>
    );
  };

  // ── EMPTY STATE ──────────────────────────────────────────────────
  if (!videos?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shadow-inner">
            <VideoOff size={36} className="text-blue-300" />
          </div>
          <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center shadow-md">
            <span className="text-white text-[10px] font-extrabold">0</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-gray-700">No Videos Yet</p>
          <p className="text-sm text-gray-400 mt-1.5 max-w-xs leading-relaxed">
            Your instructor hasn't added any content yet. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  // ── FLAT LIST MODE (isShowVideoAll = true) ───────────────────────
  if (isShowVideoAll) {
    const liveNow = allVideosSorted.filter(v => v.isLive && !v.isEnded && !isVideoLocked(v));

    return (
      <>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.3s ease-out both; }
        `}</style>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: BookOpen, label: "Total", value: videos.length, bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", icon_c: "text-blue-400" },
            { icon: Zap, label: "Unlocked", value: allVideosSorted.filter(v => !isVideoLocked(v)).length, bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon_c: "text-emerald-400" },
            { icon: Lock, label: "Upcoming", value: allVideosSorted.filter(v => isVideoLocked(v)).length, bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon_c: "text-amber-400" },
          ].map(({ icon: Icon, label, value, bg, border, text, icon_c }) => (
            <div key={label} className={`flex flex-col items-center justify-center py-4 px-2 rounded-2xl border ${bg} ${border}`}>
              <Icon size={15} className={`${icon_c} mb-1.5`} />
              <span className={`text-xl font-extrabold ${text} leading-none`}>{value}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative mb-5">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search lectures by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors">
              <X size={11} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Live now */}
        {liveNow.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-sm font-bold text-gray-800">Live Right Now</span>
              <span className="ml-auto text-xs text-gray-400 font-medium">{liveNow.length} class{liveNow.length > 1 ? "es" : ""}</span>
            </div>
            <div className="space-y-2">
              {liveNow.map((v, i) => <VideoCard key={v.id} video={v} showDate index={i} />)}
            </div>
          </div>
        )}

        {/* All lectures */}
        {allVideosSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
            <Search size={28} className="text-gray-300" />
            <p className="text-sm font-bold text-gray-500">No results for "{searchQuery}"</p>
            <p className="text-xs text-gray-400">Try a different keyword</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <TrendingUp size={14} className="text-blue-500" />
              <span className="text-sm font-bold text-gray-800">All Lectures</span>
              <span className="ml-auto text-xs text-gray-400 font-medium">{allVideosSorted.length} videos</span>
            </div>
            <div className="space-y-2">
              {allVideosSorted.map((v, i) => <VideoCard key={v.id} video={v} showDate index={i} />)}
            </div>
          </div>
        )}

        <LockedModal visible={lockedModalVisible} video={lockedVideoInfo} onClose={() => setLockedModalVisible(false)} />
      </>
    );
  }

  // ── CALENDAR MODE ────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out both; }

        .rdp-root {
          --rdp-accent-color: #2563eb;
          --rdp-accent-background-color: #eff6ff;
          font-family: inherit;
          width: 100%;
        }
        .rdp-month_caption { display: none; }
        .rdp-nav { display: none; }
        .rdp-weekday {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
          color: #9ca3af; width: 36px; text-align: center; padding-bottom: 6px;
        }
        .rdp-day {
          width: 36px; height: 36px; border-radius: 10px;
          font-size: 12.5px; font-weight: 600; color: #374151;
          position: relative; transition: background 0.12s, transform 0.1s;
        }
        .rdp-day:not([data-selected]):not([data-today]):hover {
          background: #f3f4f6; transform: scale(1.08);
        }
        .rdp-day[data-today]:not([data-selected]) {
          background: #eff6ff; color: #2563eb; font-weight: 800;
          box-shadow: 0 0 0 1.5px #bfdbfe inset;
        }
        .rdp-day[data-selected] .rdp-day_button,
        .rdp-day[data-selected] {
          background: #2563eb !important; color: #fff !important;
          border-radius: 10px; box-shadow: 0 4px 14px rgba(37,99,235,0.3);
        }
        .rdp-day_button {
          width: 100%; height: 100%; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .rdp-outside { opacity: 0.2; }
        .rdp-months { width: 100%; }
        .rdp-month { width: 100%; }
        .rdp-month_grid {
          width: 100%; border-collapse: separate; border-spacing: 2px 2px;
        }
        .rdp-week td { width: calc(100% / 7); }
        .has-video::after {
          content: ''; position: absolute; bottom: 2px; left: 50%;
          transform: translateX(-50%); width: 4px; height: 4px;
          border-radius: 50%; background: #f97316;
          pointer-events: none; z-index: 10;
        }
        .rdp-day[data-selected] .has-video::after { background: rgba(255,255,255,0.8); }
      `}</style>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:gap-6">

          {/* Calendar panel */}
          <div className="w-full lg:w-[300px] xl:w-[316px] flex-shrink-0 mb-6 lg:mb-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:sticky lg:top-6">

              {/* Month nav */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                  className="w-8 h-8 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center transition-all text-gray-500 hover:text-gray-800 hover:shadow-sm"
                >
                  <ChevronLeft size={15} />
                </button>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-gray-800">
                    {MONTH_NAMES[calendarMonth.getMonth()]}
                  </p>
                  <p className="text-[11px] text-gray-400 font-semibold -mt-0.5">
                    {calendarMonth.getFullYear()}
                  </p>
                </div>
                <button
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                  className="w-8 h-8 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center transition-all text-gray-500 hover:text-gray-800 hover:shadow-sm"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              <div className="px-3 pb-2 pt-2">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(day) => { if (day) setSelectedDate(day); }}
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
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/80 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                  <span className="text-[10px] text-gray-400 font-semibold">Has class</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-[10px] text-gray-400 font-semibold">Selected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-200" />
                  <span className="text-[10px] text-gray-400 font-semibold">Today</span>
                </div>
              </div>

              {/* Month pills */}
              {monthPills.length > 1 && (
                <div className="px-4 pt-3 pb-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                    Jump to Month
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {monthPills.map((m, idx) => {
                      const active =
                        m.getMonth() === calendarMonth.getMonth() &&
                        m.getFullYear() === calendarMonth.getFullYear();
                      const hasVideos = Array.from(datesWithVideos).some(d => {
                        const dd = new Date(d);
                        return dd.getMonth() === m.getMonth() && dd.getFullYear() === m.getFullYear();
                      });
                      return (
                        <button
                          key={idx}
                          onClick={() => setCalendarMonth(new Date(m.getFullYear(), m.getMonth(), 1))}
                          className={[
                            "relative px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                            active
                              ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200",
                          ].join(" ")}
                        >
                          {m.toLocaleString("default", { month: "short" })} {m.getFullYear()}
                          {hasVideos && !active && (
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-orange-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lecture list */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-5 gap-3">
              <div>
                <h2 className="text-[15px] font-bold text-gray-800 leading-tight">
                  {formatSelectedDate(selectedDate)}
                </h2>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 font-medium">
                  <CalendarDays size={11} />
                  {videosForSelectedDate.length === 0
                    ? "No classes scheduled on this date"
                    : `${videosForSelectedDate.length} ${videosForSelectedDate.length === 1 ? "class" : "classes"} scheduled`}
                </p>
              </div>

              {videosForSelectedDate.some(v => v.isLive && !v.isEnded && !isVideoLocked(v)) && (
                <span className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold whitespace-nowrap">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  Live Today
                </span>
              )}
            </div>

            {videosForSelectedDate.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                  <CalendarDays size={26} className="text-gray-300" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-500">No classes on this day</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    Pick a date with an orange dot to see scheduled classes
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {videosForSelectedDate.map((video, idx) => (
                  <VideoCard key={video.id} video={video} showDate={false} index={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <AppDownloadModal
        visible={showAppDownloadModal}
        onClose={() => setShowAppDownloadModal(false)}
      />
      <LockedModal visible={lockedModalVisible} video={lockedVideoInfo} onClose={() => setLockedModalVisible(false)} />
    </>
  );
}

// ── LOCKED MODAL ──────────────────────────────────────────────────
function LockedModal({
  visible, video, onClose,
}: {
  visible: boolean;
  video: Video | null;
  onClose: () => void;
}) {
  if (!visible || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-400" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={14} className="text-gray-500" />
        </button>

        <div className="p-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4 mx-auto">
            <Lock size={26} className="text-amber-500" />
          </div>

          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Class Not Available Yet</h3>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{video.title}</p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl mb-5 border border-amber-100">
            <Sparkles size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              This class will be automatically unlocked at its scheduled start time. Come back then to join.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-blue-200"
          >
            Got it, I'll come back later
          </button>
        </div>
      </div>
    </div>
  );
}