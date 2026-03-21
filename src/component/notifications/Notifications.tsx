"use client";

import React, { useState } from "react";
import {
  Bell,
  BookOpen,
  FileText,
  Award,
  Megaphone,
  CheckCircle,
  BellOff,
  RefreshCw,
} from "lucide-react";
import { useNotificationWeb } from "@/hooks/use-notification-web";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

  const { notifications, unreadCount, loading, markAllAsRead, refetch } =
    useNotificationWeb();

  /* -------------------- FILTER -------------------- */
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  /* -------------------- HELPERS -------------------- */
  const getIcon = (type: string) => {
    const map: any = {
      course_enrollment: BookOpen,
      scholarship_applied: FileText,
      scholarship_status: Award,
      admin_broadcast: Megaphone,
      general: Bell,
    };
    return map[type] || Bell;
  };

  const getColor = (type: string) => {
    const map: any = {
      course_enrollment: "bg-indigo-50 text-indigo-600",
      scholarship_applied: "bg-yellow-50 text-yellow-600",
      scholarship_status: "bg-green-50 text-green-600",
      admin_broadcast: "bg-purple-50 text-purple-600",
      general: "bg-gray-100 text-gray-600",
    };
    return map[type] || map.general;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diff = (Date.now() - date.getTime()) / 1000;

    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString();
  };

  /* -------------------- LOADING -------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 uppercase">Inbox</p>
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs px-3 py-1.5 border border-indigo-500 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition"
            >
              Mark all
            </button>
          )}
        </div>

        {/* STATUS */}
        <div className="mb-4 text-xs text-gray-500">
          {unreadCount > 0
            ? `${unreadCount} unread`
            : "You're all caught up"}
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: "Unread" },
            { key: "read", label: "Read" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 text-xs rounded-full transition ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="bg-white rounded-xl border divide-y">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center">
              <BellOff className="mx-auto mb-3 text-gray-300" size={28} />
              <p className="text-sm font-medium text-gray-500">
                No notifications
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const Icon = getIcon(notif.type);

              return (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-4 hover:bg-gray-50 transition ${
                    !notif.isRead && "bg-indigo-50/40"
                  }`}
                >
                  {/* ICON */}
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${getColor(
                      notif.type
                    )}`}
                  >
                    <Icon size={16} />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold">
                        {notif.title}
                      </p>
                      <span className="text-xs text-gray-400">
                        {formatTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>

                  {/* DOT */}
                  {!notif.isRead && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* REFRESH */}
        <div className="flex justify-center mt-6">
          <button
            onClick={refetch}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}