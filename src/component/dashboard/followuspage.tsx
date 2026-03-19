"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Instagram, Youtube, Facebook, Send, Twitter, Linkedin,
  Users, Heart, ArrowRight, CheckCircle,
} from "lucide-react";
import { useSettingsStore } from "@/lib/store/profile.store";

// ─── Social link config ──────────────────────────────────
const SOCIAL_CONFIG = [
  {
    platform: "Instagram",
    icon: Instagram,
    gradient: "from-purple-600 via-pink-500 to-red-500",
    settingsKey: "instagramLink",
    description: "Daily motivation & updates",
    followers: "50K+",
  },
  {
    platform: "YouTube",
    icon: Youtube,
    gradient: "from-red-600 to-red-800",
    settingsKey: "youtubeLink",
    description: "Free lectures & strategies",
    followers: "100K+",
  },
  {
    platform: "Facebook",
    icon: Facebook,
    gradient: "from-blue-600 to-blue-800",
    settingsKey: "facebookLink",
    description: "Community discussions",
    followers: "75K+",
  },
  {
    platform: "Telegram",
    icon: Send,
    gradient: "from-sky-500 to-sky-700",
    settingsKey: "telegramLink",
    description: "Current affairs daily",
    followers: "40K+",
  },
  {
    platform: "X (Twitter)",
    icon: Twitter,
    gradient: "from-sky-400 to-sky-600",
    settingsKey: "twitterLink",
    description: "Quick tips & news",
    followers: "30K+",
  },
  {
    platform: "LinkedIn",
    icon: Linkedin,
    gradient: "from-blue-700 to-blue-900",
    settingsKey: "linkedinLink",
    description: "Professional network",
    followers: "25K+",
  },
];

const STATS = [
  { number: "300K+", label: "Followers" },
  { number: "1000+", label: "Success Stories" },
  { number: "Daily", label: "Updates" },
];

const BENEFITS = ["Free Study Material", "Daily MCQs", "Current Affairs", "Expert Guidance"];

export default function FollowUsPage() {
  const { settings, fetchSettings, loading } = useSettingsStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchSettings();
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [fetchSettings]);

  const availableLinks = SOCIAL_CONFIG.filter(
    (s) => settings[s.settingsKey as keyof typeof settings]
  );

  const openLink = (key: string) => {
    const url = settings[key as keyof typeof settings] as string | undefined;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-indigo-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-16">

        {/* Hero */}
        <div
          className={`flex flex-col items-center text-center mb-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Logo */}
          <div className="mb-5 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            {settings.appLogo ? (
              <Image src={settings.appLogo} alt="Dikshant IAS" width={120} height={48} className="object-contain" />
            ) : (
              <div className="w-28 h-12 flex items-center justify-center">
                <span className="text-red-600 font-extrabold text-xl">Dikshant IAS</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Connect With Us
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Join our thriving community of UPSC aspirants
          </p>

          {/* Stats */}
          <div className="mt-6 w-full bg-white rounded-2xl border border-gray-200 p-4 flex">
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xl font-bold text-indigo-600">{stat.number}</span>
                  <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
                </div>
                {i < STATS.length - 1 && (
                  <div className="w-px bg-gray-100 mx-2 self-stretch" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Section Header */}
        {availableLinks.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <Heart size={18} className="text-red-500 fill-red-500" />
              <h2 className="text-lg font-bold text-gray-900">Follow Us On</h2>
            </div>
            <p className="text-sm text-gray-400 ml-7">Choose your preferred platform</p>
          </div>
        )}

        {/* Social Cards */}
        <div className="space-y-4">
          {availableLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.platform}
                onClick={() => openLink(item.settingsKey)}
                className={`relative rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* Gradient Background */}
                <div className={`bg-gradient-to-br ${item.gradient} p-6`}>
                  {/* Decorative Circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-12 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 translate-y-10 -translate-x-6" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center mb-4">
                      <Icon size={32} className="text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-1">{item.platform}</h3>
                    <p className="text-sm text-white/90 mb-3">{item.description}</p>

                    {/* Followers */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <Users size={13} className="text-white/80" />
                      <span className="text-xs font-semibold text-white/80">{item.followers}</span>
                    </div>

                    {/* Follow Button */}
                    <div className="inline-flex items-center gap-2 bg-white/25 border border-white/30 px-5 py-2.5 rounded-xl group-hover:bg-white/35 transition-colors">
                      <span className="text-white font-bold text-sm">Follow Now</span>
                      <ArrowRight size={15} className="text-white" />
                    </div>
                  </div>

                  {/* Corner Check */}
                  <div className="absolute top-4 right-4">
                    <CheckCircle size={18} className="text-white/30" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {availableLinks.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Users size={28} className="text-gray-300" />
            </div>
            <p className="text-lg font-bold text-gray-600">Social links coming soon!</p>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              We're setting up our social channels. Check back soon.
            </p>
          </div>
        )}

        {/* CTA Footer */}
        {availableLinks.length > 0 && (
          <div className="mt-8 rounded-3xl overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-7 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center mb-4">
                <Users size={26} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Why Follow Us?</h3>
              <p className="text-sm text-white/85 mb-5 max-w-xs leading-relaxed">
                Stay connected for the latest UPSC updates, tips, and free resources
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {BENEFITS.map((b) => (
                  <span
                    key={b}
                    className="bg-white/20 border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}