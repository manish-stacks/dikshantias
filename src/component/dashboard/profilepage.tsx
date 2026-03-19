"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen, HelpCircle, FileText, Settings, Star,
  Award, Bell, Shield, Link2, LogOut,
  Mail, Phone, Calendar, ChevronRight, Pencil,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useSettingsStore } from "@/lib/store/profile.store";
import { formatDate } from "@/types/utils.web";
import axiosInstance from "@/lib/axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNotificationWeb } from "@/hooks/use-notification-web";

const quickActions = [
  { label: "My Courses", icon: BookOpen, bg: "bg-indigo-50", iconColor: "text-indigo-600", href: "/profile/courses" },
  { label: "Quizzes", icon: HelpCircle, bg: "bg-emerald-50", iconColor: "text-emerald-600", href: "/profile/quizzes" },
  { label: "Test Series", icon: FileText, bg: "bg-amber-50", iconColor: "text-amber-500", href: "/test-series" },
  { label: "Settings", icon: Settings, bg: "bg-sky-50", iconColor: "text-sky-600", href: "/settings" },
  { label: "Rate Us", icon: Star, bg: "bg-yellow-50", iconColor: "text-yellow-500", action: "rate" },
  { label: "Scholarships", icon: Award, bg: "bg-green-50", iconColor: "text-green-600", href: "/scholarship-programme" },
  { label: "Help & Support", icon: HelpCircle, bg: "bg-rose-50", iconColor: "text-rose-500", href: "/contact-us" },
];

const menuOptions = [
  { label: "Notifications", icon: Bell, href: "/notifications", badge: true },
  { label: "Terms & Conditions", icon: FileText, href: "/terms-conditions" },
  { label: "Join Us", icon: Link2, href: "/profile/follow" },
  { label: "Privacy Policy", icon: Shield,  href: "/privacy-refund-policy" },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();
  const {notifications} =useNotificationWeb()
  const [performance, setPerformance] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchSettings();
    const loadPerformance = async () => {
      if (!user?.id) return;
      try {
        const res = await axiosInstance.get(`/auth/performance/${user.id}`);
        setPerformance(res.data.data);
        setEditData(res.data.data.user);
      } catch { }
    };
    loadPerformance();
  }, [fetchSettings, user?.id]);

 const handleRate = useCallback(() => {
    if (typeof window === "undefined") return;

    const url =
      settings?.playStoreUrl ||
      "https://play.google.com/store/apps/details?id=in.kaksya.dikshant&showAllReviews=true";

    window.open(url, "_blank", "noopener,noreferrer");
  }, [settings]);

  const handleMenuUrl = (key) => {
    const url = settings[key];
    if (url) window.open(url, "_blank");
  };

  const handleSaveEdit = async () => {
    try {
      setPerformance((prev) => ({ ...prev, user: editData }));
      setIsEditOpen(false);
    } catch { }
  };

  const initials = (performance?.user?.name || user?.name)?.charAt(0).toUpperCase() ?? "U";

  const pieData = performance
    ? [
      { name: "Quizzes", value: performance.purchases.breakdown.quizzes.spent, fill: "#10b981" },
      { name: "Test Series", value: performance.purchases.breakdown.testSeries.spent, fill: "#f59e0b" },
      { name: "Bundles", value: performance.purchases.breakdown.bundles.spent, fill: "#6366f1" },
      { name: "Batches", value: performance.purchases.breakdown.batches.spent, fill: "#ec4899" },
    ].filter((d) => d.value > 0)
    : [];

  const quizBarData = performance
    ? [
      { name: "Correct", count: performance.quizPerformance.totalCorrect, fill: "#10b981" },
      { name: "Wrong", count: performance.quizPerformance.totalWrong, fill: "#ef4444" },
    ]
    : [];

  const QuickActionCard = ({ item }) => {
    const Icon = item.icon;
    const card = (
      <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon size={20} className={item.iconColor} />
        </div>
        <span className="text-[10px] font-medium text-slate-700 text-center leading-tight">{item.label}</span>
      </div>
    );
    if (item.action === "rate") return <div onClick={handleRate}>{card}</div>;
    return <Link href={item.href}>{card}</Link>;
  };

  const MenuRow = ({ item }) => {
    const Icon = item.icon;
    const row = (
      <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Icon size={15} className="text-slate-500" />
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0  && item.badge ? (
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{notifications.length}</span>
          ):null }
       
          <ChevronRight size={14} className="text-slate-300" />
        </div>
      </div>
    );
    if (item.settingsKey) return <div onClick={() => handleMenuUrl(item.settingsKey)}>{row}</div>;
    return <Link href={item.href}>{row}</Link>;
  };

  const currentUser = performance?.user || user || {};

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="lg:hidden">

        <div className="relative bg-gradient-to-br from-red-800 via-red-600 to-rose-500 pt-12 pb-24 px-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />

          {/* <button
            onClick={() => setIsEditOpen(true)}
            className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition text-white text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            <Pencil size={12} /> Edit
          </button> */}

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-xl mb-3">
              <span className="text-white text-3xl font-bold">{initials}</span>
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight">{currentUser.name ?? "Student"}</h1>
            <p className="text-red-200 text-[11px] font-semibold mt-1 tracking-widest uppercase">
              ID: DIKSHANT{currentUser.id ?? ""}
            </p>
          </div>
        </div>

        <div className="mx-4 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl border border-slate-100 grid grid-cols-3 divide-x divide-slate-100 overflow-hidden">
            {[
              { label: "Orders", value: performance?.overview?.totalOrders ?? "5" },
              { label: "Quizzes", value: performance?.quizPerformance?.totalAttempts ?? "28" },
              { label: "Rank", value: `#${performance?.rank?.position ?? "142"}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center py-4">
                <span className="text-lg font-bold text-slate-800">{value}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-12 mt-5 space-y-6">

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact Info</p>
            {[
              { Icon: Mail, value: currentUser.email ?? "N/A" },
              { Icon: Phone, value: currentUser.mobile ?? "N/A" },
              { Icon: Calendar, value: `Joined ${formatDate(currentUser.memberSince || currentUser.createdAt)}` },
            ].map(({ Icon, value }, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-t border-slate-50">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-slate-400" />
                </div>
                <span className="text-sm text-slate-600 truncate">{value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Quick Actions</p>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((item) => <QuickActionCard key={item.label} item={item} />)}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">More Options</p>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-50">
              {menuOptions.map((item) => <MenuRow key={item.label} item={item} />)}
            </div>
          </div>

          {performance && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Overview</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-800">₹{performance.overview.totalSpent}</div>
                    <div className="text-[10px] text-slate-400">Total Spent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">{performance.overview.activeDaysLast30}</div>
                    <div className="text-[10px] text-slate-400">Active Days (30d)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Purchases Breakdown</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value">
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-[10px]">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-auto text-slate-500">₹{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Recent Orders</p>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {performance.purchases.recentOrders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-3 last:border-none">
                      <div>
                        <div className="font-medium text-slate-800">{order.type.replace("_", " ")}</div>
                        <div className="text-[10px] text-slate-400">{formatDate(order.paymentDate)}</div>
                      </div>
                      <div className="font-semibold text-right">₹{order.totalAmount}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Quiz Performance</p>
                <div className="grid grid-cols-3 gap-4 mb-6 text-center text-xs">
                  <div>
                    <div className="font-bold text-emerald-600">{performance.quizPerformance.passedQuizzes}</div>
                    <div className="text-slate-400">Passed</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-700">{performance.quizPerformance.avgScore}%</div>
                    <div className="text-slate-400">Avg Score</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-700">{Math.round(performance.quizPerformance.accuracy)}%</div>
                    <div className="text-slate-400">Accuracy</div>
                  </div>
                </div>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quizBarData}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip />
                      <Bar dataKey="count" radius={4}>
                        {quizBarData.map((entry, idx) => (
                          <Cell key={`bar-${idx}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 active:scale-[0.98] transition-all"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>

      <div className="hidden lg:flex min-h-screen">

        <aside className="w-72 xl:w-80 flex-shrink-0 bg-white border-r border-slate-100 sticky top-0 h-screen overflow-y-auto flex flex-col">

          <div className="relative bg-gradient-to-br from-red-800 via-red-600 to-rose-500 px-6 pt-10 pb-8 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

            {/* <button
              onClick={() => setIsEditOpen(true)}
              className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              <Pencil size={11} /> Edit
            </button> */}

            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <h2 className="text-white text-lg font-bold">{currentUser.name ?? "Student"}</h2>
            <p className="text-red-200 text-[10px] font-bold tracking-widest uppercase mt-0.5">
              ID: DIKSHANT{currentUser.id ?? ""}
            </p>

            <div className="flex gap-6 mt-6">
              {[
                { label: "Orders", value: performance?.overview?.totalOrders ?? "5" },
                { label: "Quizzes", value: performance?.quizPerformance?.totalAttempts ?? "28" },
                { label: "Rank", value: `#${performance?.rank?.position ?? "142"}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-white text-base font-bold leading-none">{value}</p>
                  <p className="text-red-200 text-[10px] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>



          <div className="px-4 py-5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-2">Menu</p>
            <nav className="space-y-px">
              {menuOptions.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <div className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                   {notifications?.length > 0 &&  item.badge && (
  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
    {notifications.length}
  </span>
)}
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  </div>
                );
                if (item.settingsKey) return <div key={item.label} onClick={() => handleMenuUrl(item.settingsKey)}>{inner}</div>;
                return <Link key={item.label} href={item.href}>{inner}</Link>;
              })}
            </nav>
          </div>

          <div className="px-5 py-5 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-8 xl:p-10 overflow-y-auto">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your account and learning preferences</p>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {[
              { label: "Total Spent", value: `₹${performance?.overview?.totalSpent ?? "10046"}`, sub: "All time", bg: "bg-indigo-50", color: "text-indigo-600", Icon: Award },
              { label: "Quizzes Taken", value: performance?.quizPerformance?.totalAttempts ?? "28", sub: "12 completed", bg: "bg-emerald-50", color: "text-emerald-600", Icon: HelpCircle },
              { label: "Current Rank", value: `#${performance?.rank?.position ?? "1"}`, sub: `${performance?.rank?.percentile ?? "96"}th percentile`, bg: "bg-amber-50", color: "text-amber-500", Icon: Award },
            ].map(({ label, value, sub, bg, color, Icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-5 hover:border-slate-200 transition-colors">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={24} className={color} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
                  <p className="text-xs text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-5">Quick Actions</p>
            <div className="grid grid-cols-7 gap-4">
              {quickActions.map((item) => {
                const Icon = item.icon;
                const card = (
                  <div className="flex flex-col items-center gap-2.5 p-5 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group">
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon size={22} className={item.iconColor} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 text-center leading-tight">{item.label}</span>
                  </div>
                );
                if (item.action === "rate") return <div key={item.label} onClick={handleRate}>{card}</div>;
                return <Link key={item.label} href={item.href}>{card}</Link>;
              })}
            </div>
          </div>

   <div className="grid grid-cols-5 gap-6">

  {/* LEFT - PROFILE (3 cols) */}
  <div className="col-span-5 lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-6">
    
    <div className="flex justify-between items-center mb-6">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        Profile Details
      </p>
      {/* <button
        onClick={() => setIsEditOpen(true)}
        className="flex items-center gap-1.5 text-xs font-semibold text-red-500"
      >
        <Pencil size={12} /> Edit
      </button> */}
    </div>

    {/* USER CARD */}
    <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl mb-6">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center">
        <span className="text-white text-3xl font-bold">{initials}</span>
      </div>
      <div>
        <p className="text-xl font-bold text-slate-800">{currentUser.name}</p>
        <p className="text-xs text-slate-400 tracking-widest">
          ID: DIKSHANT{currentUser.id}
        </p>
      </div>
    </div>

    {/* DETAILS */}
    <div className="space-y-3">
      {[
        { Icon: Mail, label: "Email", value: currentUser.email },
        { Icon: Phone, label: "Mobile", value: currentUser.mobile },
        {
          Icon: Calendar,
          label: "Member Since",
          value: formatDate(currentUser.memberSince || currentUser.createdAt),
        },
      ].map(({ Icon, label, value }) => (
        <div
          key={label}
          className="flex gap-5 px-5 py-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
            <Icon size={16} className="text-slate-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider">
              {label}
            </p>
            <p className="text-sm font-medium text-slate-700">{value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* RIGHT - PIE CHART (2 cols) */}
  <div className="col-span-5 lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 flex items-center justify-center">
    
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            dataKey="value"
          >
            {pieData.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill} />
            ))}
          </Pie>

          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </div>
</div>

          {performance && (
            <div className="mt-12 space-y-8">
              <div className="bg-white rounded-2xl border border-slate-100 p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Purchases Breakdown</p>
                <div className="flex gap-12 items-center">

                  <div className="flex-1 space-y-6 text-sm">
                    {pieData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-4 h-4 rounded" style={{ background: item.fill }} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="font-semibold">₹{item.value} <span className="text-xs text-slate-400 font-normal">({performance.purchases.breakdown[item.name.toLowerCase()]?.count || 0} items)</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-8">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Quiz Performance</p>
                  <div className="grid grid-cols-4 gap-y-8 text-center">
                    <div>
                      <div className="text-4xl font-bold text-emerald-600">{performance.quizPerformance.passedQuizzes}</div>
                      <div className="text-[10px] text-slate-400 mt-1">PASSED</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-slate-700">{performance.quizPerformance.avgScore}</div>
                      <div className="text-[10px] text-slate-400 mt-1">% AVG</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-slate-700">{Math.round(performance.quizPerformance.accuracy)}</div>
                      <div className="text-[10px] text-slate-400 mt-1">% ACCURACY</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-slate-700">{performance.quizPerformance.bestScore}</div>
                      <div className="text-[10px] text-slate-400 mt-1">BEST</div>
                    </div>
                  </div>
                  <div className="mt-10 h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={quizBarData} barCategoryGap={30}>
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {quizBarData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Test Performance</p>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[92px] font-black leading-none text-amber-500 tracking-tighter">{performance.testPerformance.avgScore}</div>
                      <div className="text-xs uppercase text-slate-400 -mt-3">AVERAGE SCORE</div>
                      <div className="mt-8 text-2xl font-semibold text-slate-700">{performance.testPerformance.passedTests} / {performance.testPerformance.total} PASSED</div>
                    </div>
                  </div>
                  <div className="pt-8 border-t text-xs text-slate-400 flex justify-between">
                    <div>Best: {performance.testPerformance.bestScore}</div>
                    <div className="font-medium text-emerald-600">RANK #{performance.rank.position}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Recent Orders</p>
                <div className="divide-y divide-slate-100 text-sm">
                  {performance.purchases.recentOrders.map((order, idx) => (
                    <div key={idx} className="py-5 flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="w-8 h-8 rounded-2xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {order.type[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800 capitalize">{order.type.replace(/_/g, " ")}</div>
                          <div className="text-xs text-slate-400">{formatDate(order.paymentDate)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{order.totalAmount}</div>
                        <div className="text-[10px] text-emerald-600">SUCCESS</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-8 py-6 border-b">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Edit Profile</p>
                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-900">✕</button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs text-slate-400 mb-2">FULL NAME</p>
                <input
                  type="text"
                  value={editData.name || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-slate-300"
                />
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-2">MOBILE NUMBER</p>
                <input
                  type="tel"
                  value={editData.mobile || ""}
                  onChange={(e) => setEditData((prev) => ({ ...prev, mobile: e.target.value }))}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-slate-300"
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t flex gap-3">
              <button
                onClick={() => setIsEditOpen(false)}
                className="flex-1 py-3.5 text-sm font-medium border border-slate-200 rounded-2xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3.5 text-sm font-semibold bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}