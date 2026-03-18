"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  BookOpen, HelpCircle, FileText, Settings, Star,
  Award, Bell, Shield, Link2, LogOut,
  Mail, Phone, Calendar, ChevronRight, Pencil,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useSettingsStore } from "@/lib/store/profile.store";
import { formatDate } from "@/types/utils.web";


const quickActions = [
  { label: "My Courses",     icon: BookOpen,   bg: "bg-indigo-50",  iconColor: "text-indigo-600",  href: "/profile/courses" },
  { label: "Quizzes",        icon: HelpCircle, bg: "bg-emerald-50", iconColor: "text-emerald-600", href: "/profile/quizzes" },
  { label: "Test Series",    icon: FileText,   bg: "bg-amber-50",   iconColor: "text-amber-500",   href: "/test-series" },
  { label: "Settings",       icon: Settings,   bg: "bg-sky-50",     iconColor: "text-sky-600",     href: "/settings" },
  { label: "Rate Us",        icon: Star,       bg: "bg-yellow-50",  iconColor: "text-yellow-500",  action: "rate" },
  { label: "Scholarships",   icon: Award,      bg: "bg-green-50",   iconColor: "text-green-600",   href: "/scholarships" },
  { label: "Help & Support", icon: HelpCircle, bg: "bg-rose-50",    iconColor: "text-rose-500",    href: "/help" },
];

const menuOptions = [
  { label: "Notifications",      icon: Bell,     href: "/notifications",   badge: true },
  { label: "Terms & Conditions", icon: FileText,  settingsKey: "termsUrl" },
  { label: "Join Us",            icon: Link2,    href: "/profile/follow" },
  { label: "Privacy Policy",     icon: Shield,   settingsKey: "privacyPolicyUrl" },
];


export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleRate = () => {
    if (settings?.playStoreUrl) window.open(settings.playStoreUrl, "_blank");
  };

  const handleMenuUrl = (key) => {
    const url = settings[key];
    if (url) window.open(url, "_blank");
  };

  const initials = user?.name?.charAt(0).toUpperCase() ?? "U";

  // ── Reusable sub-components ──────────────────────────────────────────────────

  const QuickActionCard = ({ item }) => {
    const Icon = item.icon;
    const card = (
      <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
          <Icon size={20} className={item.iconColor} />
        </div>
        <span className="text-[11px] font-semibold text-slate-700 text-center leading-tight">{item.label}</span>
      </div>
    );
    if (item.action === "rate") return <div onClick={handleRate}>{card}</div>;
    return <Link href={item.href}>{card}</Link>;
  };

  const MenuRow = ({ item }) => {
    const Icon = item.icon;
    const row = (
      <div className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Icon size={15} className="text-slate-500" />
          </div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
        </div>
        <div className="flex items-center gap-2">
          {item.badge && (
            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          )}
          <ChevronRight size={14} className="text-slate-300" />
        </div>
      </div>
    );
    if (item.settingsKey) return <div key={item.label} onClick={() => handleMenuUrl(item.settingsKey)}>{row}</div>;
    return <Link key={item.label} href={item.href}>{row}</Link>;
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ╔══════════════════════════════════════════════════════╗
          ║              MOBILE LAYOUT  (< lg)                  ║
          ╚══════════════════════════════════════════════════════╝ */}
      <div className="lg:hidden">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-red-800 via-red-600 to-rose-500 pt-12 pb-24 px-5 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />

          <button className="absolute top-5 right-5 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <Pencil size={12} /> Edit
          </button>

          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-xl mb-3">
              <span className="text-white text-3xl font-bold">{initials}</span>
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight">{user?.name ?? "Student"}</h1>
            <p className="text-red-200 text-[11px] font-semibold mt-1 tracking-widest uppercase">
              ID: DIKSHANT{user?.id ?? ""}
            </p>
          </div>
        </div>

        {/* Stats Strip — overlaps hero */}
        <div className="mx-4 -mt-10 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 grid grid-cols-3 divide-x divide-slate-100 overflow-hidden">
            {[
              { label: "Courses", value: "4" },
              { label: "Quizzes", value: "28" },
              { label: "Rank",    value: "#142" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center py-4">
                <span className="text-lg font-bold text-slate-800">{value}</span>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-12 mt-5 space-y-5">

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <p className="px-4 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact Info</p>
            {[
              { Icon: Mail,     value: user?.email ?? "N/A" },
              { Icon: Phone,    value: user?.mobile ?? "N/A" },
              { Icon: Calendar, value: `Joined ${formatDate(user?.createdAt)}` },
            ].map(({ Icon, value }, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-t border-slate-50">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-slate-400" />
                </div>
                <span className="text-sm text-slate-600 truncate">{value}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Quick Actions</p>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((item) => <QuickActionCard key={item.label} item={item} />)}
            </div>
          </div>

          {/* More Options */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">More Options</p>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {menuOptions.map((item) => <MenuRow key={item.label} item={item} />)}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 active:scale-[0.98] transition-all"
          >
            <LogOut size={16} />
            Log Out
          </button>

        </div>
      </div>

      {/* ╔══════════════════════════════════════════════════════╗
          ║             DESKTOP LAYOUT  (≥ lg)                  ║
          ╚══════════════════════════════════════════════════════╝ */}
      <div className="hidden lg:flex min-h-screen">

        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <aside className="w-72 xl:w-80 flex-shrink-0 bg-white border-r border-slate-100 sticky top-0 h-screen overflow-y-auto flex flex-col">

          {/* Profile Hero */}
          <div className="relative bg-gradient-to-br from-red-800 via-red-600 to-rose-500 px-6 pt-10 pb-8 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

            <button className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 transition text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <Pencil size={11} /> Edit
            </button>

            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
            </div>

            <h2 className="text-white text-lg font-bold">{user?.name ?? "Student"}</h2>
            <p className="text-red-200 text-[10px] font-bold tracking-widest uppercase mt-0.5">
              ID: DIKSHANT{user?.id ?? ""}
            </p>

            <div className="flex gap-5 mt-5">
              {[
                { label: "Courses", value: "4" },
                { label: "Quizzes", value: "28" },
                { label: "Rank",    value: "#142" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-white text-base font-bold leading-none">{value}</p>
                  <p className="text-red-200 text-[10px] font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="px-5 py-5 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contact Info</p>
            <div className="space-y-2.5">
              {[
                { Icon: Mail,     value: user?.email ?? "N/A" },
                { Icon: Phone,    value: user?.mobile ?? "N/A" },
                { Icon: Calendar, value: `Joined ${formatDate(user?.createdAt)}` },
              ].map(({ Icon, value }, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-500 truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Nav */}
          <div className="px-4 py-5 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-2">Menu</p>
            <nav className="space-y-0.5">
              {menuOptions.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">3</span>
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

          {/* Sidebar Logout */}
          <div className="px-5 py-5 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────── */}
        <main className="flex-1 p-8 xl:p-10 overflow-y-auto">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
            <p className="text-sm text-slate-400 mt-1">Manage your account and learning preferences</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-5 mb-7">
            {[
              { label: "Enrolled Courses", value: "4",    sub: "Active this month",   bg: "bg-indigo-50",  color: "text-indigo-600", Icon: BookOpen },
              { label: "Quizzes Taken",    value: "28",   sub: "2 pending this week", bg: "bg-emerald-50", color: "text-emerald-600", Icon: HelpCircle },
              { label: "Overall Rank",     value: "#142", sub: "Top 15% nationwide",  bg: "bg-amber-50",   color: "text-amber-500",  Icon: Award },
            ].map(({ label, value, sub, bg, color, Icon }) => (
              <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={22} className={color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">{value}</p>
                  <p className="text-sm font-medium text-slate-600">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-5">Quick Actions</p>
            <div className="grid grid-cols-7 gap-4">
              {quickActions.map((item) => {
                const Icon = item.icon;
                const card = (
                  <div className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
                    <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon size={20} className={item.iconColor} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight">{item.label}</span>
                  </div>
                );
                if (item.action === "rate") return <div key={item.label} onClick={handleRate}>{card}</div>;
                return <Link key={item.label} href={item.href}>{card}</Link>;
              })}
            </div>
          </div>

          {/* Profile Details + More Options */}
          <div className="grid grid-cols-5 gap-6">

            {/* Profile Details */}
            <div className="col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Profile Details</p>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">
                  <Pencil size={12} /> Edit Profile
                </button>
              </div>

              {/* Identity block */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white text-xl font-bold">{initials}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">{user?.name ?? "Student"}</p>
                  <p className="text-[11px] text-slate-400 font-semibold tracking-widest uppercase mt-0.5">
                    ID: DIKSHANT{user?.id ?? ""}
                  </p>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-3">
                {[
                  { Icon: Mail,     label: "Email Address", value: user?.email ?? "N/A" },
                  { Icon: Phone,    label: "Mobile Number", value: user?.mobile ?? "N/A" },
                  { Icon: Calendar, label: "Member Since",  value: formatDate(user?.createdAt) },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                      <p className="text-sm font-medium text-slate-700 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* More Options */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">More Options</p>
              <div className="flex-1 divide-y divide-slate-50">
                {menuOptions.map((item) => <MenuRow key={item.label} item={item} />)}
              </div>
              <button
                onClick={logout}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Log Out
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}