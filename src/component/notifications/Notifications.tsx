'use client';

import React, { useState } from "react";
import { Bell, BookOpen, FileText, Award, Megaphone, CheckCircle, BellOff, RefreshCw } from "lucide-react";
import { useNotificationWeb } from "@/hooks/use-notification-web";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

  const { notifications, unreadCount, loading, markAllAsRead, refetch } = useNotificationWeb();

  const handleTabChange = (tab: "all" | "unread" | "read") => {
    setActiveTab(tab);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.isRead;
    if (activeTab === "read") return notif.isRead;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    const map: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
      course_enrollment: BookOpen,
      scholarship_applied: FileText,
      scholarship_status: Award,
      admin_broadcast: Megaphone,
      general: Bell,
    };
    return map[type] || Bell;
  };

  const getNotificationAccent = (type: string) => {
    const map: Record<string, { color: string; bg: string; label: string }> = {
      course_enrollment:  { color: "#4f46e5", bg: "#eef2ff", label: "Course"      },
      scholarship_applied:{ color: "#b45309", bg: "#fefce8", label: "Scholarship" },
      scholarship_status: { color: "#059669", bg: "#ecfdf5", label: "Award"       },
      admin_broadcast:    { color: "#7c3aed", bg: "#f5f3ff", label: "Broadcast"   },
      general:            { color: "#475569", bg: "#f8fafc", label: "General"     },
    };
    return map[type] || map["general"];
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60)   return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
          .notif-root * { font-family: 'DM Sans', sans-serif; }
          @keyframes spin { to { transform: rotate(360deg); } }
          .spin { animation: spin 0.9s linear infinite; }
        `}</style>
        <div className="notif-root text-center">
          <div className="w-8 h-8 border-2 border-[#4f46e5] border-t-transparent rounded-full spin mx-auto" />
          <p className="mt-4 text-[12px] tracking-widest text-[#94a3b8] uppercase font-medium">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=DM+Serif+Display:ital@0;1&display=swap');

        .notif-root {
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .notif-root h1 {
          font-family: 'DM Serif Display', serif;
        }

        .notif-item {
          transition: background 0.15s ease;
        }
        .notif-item:hover {
          background: #f1f5f9;
        }

        @keyframes fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .notif-item {
          animation: fadein 0.25s ease both;
        }
        .notif-item:nth-child(1)  { animation-delay: 0.02s; }
        .notif-item:nth-child(2)  { animation-delay: 0.05s; }
        .notif-item:nth-child(3)  { animation-delay: 0.08s; }
        .notif-item:nth-child(4)  { animation-delay: 0.11s; }
        .notif-item:nth-child(5)  { animation-delay: 0.14s; }

        .tab-btn {
          transition: all 0.15s ease;
          position: relative;
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 12px;
          right: 12px;
          height: 2px;
          background: #4f46e5;
          border-radius: 2px 2px 0 0;
        }

        .mark-read-btn {
          transition: all 0.15s ease;
        }
        .mark-read-btn:hover {
          background: #4f46e5;
          color: white;
        }
        .mark-read-btn:active {
          transform: scale(0.97);
        }

        .refresh-btn {
          transition: all 0.2s ease;
        }
        .refresh-btn:hover svg {
          transform: rotate(180deg);
        }
        .refresh-btn svg {
          transition: transform 0.4s ease;
        }

        .dot-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div className="notif-root min-h-screen bg-[#f7f7f5]">
        <div className="max-w-2xl mx-auto px-5 py-10">

          {/* ── HEADER ── */}
          <div className="mb-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] tracking-[0.18em] text-[#94a3b8] uppercase mb-1.5 font-medium">
                  Inbox
                </p>
                <h1 className="text-[32px] text-[#0f172a] leading-none">
                  Notifications
                </h1>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="mark-read-btn flex items-center gap-1.5 border border-[#4f46e5] text-[#4f46e5] text-[11.5px] font-medium tracking-wide px-4 py-2 rounded-full"
                >
                  <CheckCircle size={12} strokeWidth={2.5} />
                  Mark all read
                </button>
              )}
            </div>

            {/* unread pill */}
            {unreadCount > 0 ? (
              <div className="mt-3 flex items-center gap-1.5">
                <span className="dot-pulse w-1.5 h-1.5 rounded-full bg-[#4f46e5] inline-block" />
                <span className="text-[12px] text-[#64748b]">
                  {unreadCount} unread
                </span>
              </div>
            ) : (
              <p className="mt-2 text-[12px] text-[#94a3b8]">You're all caught up ✓</p>
            )}
          </div>

          {/* ── TABS ── */}
          <div className="flex gap-0 border-b border-[#e2e8f0] mb-6">
            {([
              { key: "all",    label: "All",    count: notifications.length },
              { key: "unread", label: "Unread", count: unreadCount > 0 ? unreadCount : null },
              { key: "read",   label: "Read",   count: null },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`tab-btn flex items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-medium ${
                  activeTab === tab.key
                    ? "active text-[#0f172a]"
                    : "text-[#94a3b8] hover:text-[#64748b]"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      activeTab === tab.key
                        ? "bg-[#eef2ff] text-[#4f46e5]"
                        : "bg-[#f1f5f9] text-[#94a3b8]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── LIST ── */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#e9ecef]">
            {filteredNotifications.length === 0 ? (
              <div className="py-20 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl flex items-center justify-center mb-4">
                  <BellOff size={18} color="#cbd5e1" strokeWidth={1.5} />
                </div>
                <p className="text-[13px] font-medium text-[#475569]">No notifications</p>
                <p className="text-[11.5px] text-[#94a3b8] mt-1">
                  {activeTab === "unread" ? "You're all caught up!" : "Nothing here yet"}
                </p>
              </div>
            ) : (
              <div>
                {filteredNotifications.map((notif, i) => {
                  const IconComponent = getNotificationIcon(notif.type);
                  const accent        = getNotificationAccent(notif.type);

                  return (
                    <div
                      key={notif.id}
                      className={`notif-item flex gap-3.5 px-5 py-4 ${
                        i !== filteredNotifications.length - 1
                          ? "border-b border-[#f1f5f9]"
                          : ""
                      } ${!notif.isRead ? "bg-[#fafbff]" : "bg-white"}`}
                    >
                      {/* icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ backgroundColor: accent.bg }}
                      >
                        <IconComponent size={15} strokeWidth={1.8} color={accent.color} />
                      </div>

                      {/* body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* type label */}
                            <span
                              className="text-[10px] font-semibold tracking-wider uppercase"
                              style={{ color: accent.color }}
                            >
                              {accent.label}
                            </span>
                            {/* title */}
                            <p className="text-[13px] font-semibold text-[#0f172a] leading-snug mt-0.5 line-clamp-1">
                              {notif.title}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                            {!notif.isRead && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#4f46e5]" />
                            )}
                            <span className="text-[10.5px] text-[#94a3b8] font-medium whitespace-nowrap">
                              {formatTime(notif.createdAt)}
                            </span>
                          </div>
                        </div>

                        <p className="text-[12px] text-[#64748b] mt-1 leading-relaxed line-clamp-2">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── REFRESH ── */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={refetch}
              className="refresh-btn flex items-center gap-1.5 text-[11.5px] text-[#94a3b8] hover:text-[#475569] font-medium tracking-wide"
            >
              <RefreshCw size={11} strokeWidth={2} />
              Refresh
            </button>
          </div>

        </div>
      </div>
    </>
  );
}