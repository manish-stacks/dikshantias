"use client";

import React, { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Send,
  ChevronsRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface Settings {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMap: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  twitter: string;
  telegram: string;
  image: {
    url: string;
  };
}

// ── Animated count-up hook ──────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

// ── Live Visitor Counter Component ─────────────────────────────────────────
const LiveVisitorCounter: React.FC<{ count: number }> = ({ count }) => {
  const BASE = 100000; // 1 Lakh default
  const animated = useCountUp(BASE + count);

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes footerPulseRing {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(2.2); opacity: 0;   }
          100% { transform: scale(2.4); opacity: 0;   }
        }
        @keyframes footerBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes footerCountSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>

      <div className="flex justify-center mt-6 mb-4">
        {/* Pill container — matches footer's bg-[#ecf4fc] palette */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 20px",
            borderRadius: "999px",
            background: "linear-gradient(135deg,#fff 0%,#f0f6fd 100%)",
            border: "1.5px solid rgba(165,3,9,0.18)",
            boxShadow:
              "0 2px 12px rgba(165,3,9,0.08), 0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {/* Pulsing live dot */}
          <span
            style={{
              position: "relative",
              display: "inline-flex",
              width: 10,
              height: 10,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "#a50309",
                animation:
                  "footerPulseRing 1.5s cubic-bezier(0,0,0.2,1) infinite",
              }}
            />
            <span
              style={{
                display: "block",
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#a50309",
              }}
            />
          </span>

          {/* "LIVE" badge */}
          <span
            style={{
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: "#a50309",
              background: "rgba(165,3,9,0.08)",
              borderRadius: "4px",
              padding: "2px 6px",
              animation: "footerBlink 2.4s ease-in-out infinite",
              flexShrink: 0,
            }}
          >
            LIVE
          </span>

          {/* Divider */}
          <span
            style={{
              width: 1,
              height: 16,
              background: "rgba(165,3,9,0.15)",
              flexShrink: 0,
            }}
          />

          {/* Eye SVG (no extra import needed) */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1e3a5f"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0, opacity: 0.7 }}
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>

          {/* Label */}
          <span
            style={{
              fontSize: "12px",
              color: "#1e3a5f",
              fontWeight: 500,
              letterSpacing: "0.01em",
              flexShrink: 0,
            }}
          >
            Visitors
          </span>

          {/* Count */}
          <span
            key={animated}
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "#a50309",
              letterSpacing: "0.02em",
              minWidth: "52px",
              textAlign: "right",
              animation: "footerCountSlide 0.35s ease",
            }}
          >
            {animated.toLocaleString()}
          </span>
        </div>
      </div>
    </>
  );
};

// ── Main Footer ─────────────────────────────────────────────────────────────
const Footer: React.FC = () => {
  const { t } = useTranslation("common");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data[0]))
      .catch((err) => console.error(err));

    // Visitor Count API
    fetch("/api/visitor")
      .then((res) => res.json())
      .then((data) => setVisitorCount(data.count))
      .catch((err) => console.error(err));
  }, []);

  const footerSections: FooterSection[] = [
    {
      title: t("footer.sections.quickLinks"),
      links: [
        { name: t("footer.links.home"), href: "/" },
        { name: t("footer.links.about"), href: "/about-us" },
        {
          name: t("footer.links.scholarshipProgramme"),
          href: "/scholarship-programme",
        },
        { name: t("footer.links.blog"), href: "/blogs" },
        { name: t("footer.links.contact"), href: "/contact-us" },
        { name: t("footer.links.gallery"), href: "/gallery" },
      ],
    },
    {
      title: t("footer.sections.courses"),
      links: [
        { name: t("footer.links.onlineCourse"), href: "/online-live-course" },
        { name: t("footer.links.offlineCourse"), href: "/offline-course" },
        { name: t("footer.links.mainsCorner"), href: "/mains-corner" },
        { name: t("footer.links.mentorshipProgramme"), href: "/coming-soon" },
        { name: t("footer.links.interviewGuidancer"), href: "/coming-soon" },
        { name: t("footer.links.essayAnswerWriting"), href: "/coming-soon" },
      ],
    },
    {
      title: "CURRENT AFFAIRS",
      links: [
        {
          name: "What to Read in Hindu",
          href: "/current-affairs/what-to-read-in-hindu",
        },
        {
          name: "What to Read in Indian Express",
          href: "/current-affairs/what-to-read-in-indian-express",
        },
        {
          name: "Editorial Analysis",
          href: "/current-affairs/editorial-analysis",
        },
        {
          name: "Daily Current Affairs Analysis",
          href: "/current-affairs/daily-current-affairs-analysis",
        },
        {
          name: "Daily Current Affairs Quiz",
          href: "/current-affairs/daily-current-affairs-quiz",
        },
        {
          name: "Important Facts of the Day",
          href: "/current-affairs/important-facts-of-the-day",
        },
      ],
    },
    {
      title: t("footer.sections.policies"),
      links: [
        {
          name: t("footer.links.privacyRefundPolicy"),
          href: "/privacy-refund-policy",
        },
        { name: t("footer.links.termsConditions"), href: "/terms-conditions" },
        { name: t("footer.links.dataPolicy"), href: "/data-policy" },
      ],
    },
  ];

  const socialMedia = settings
    ? [
        {
          icon: Facebook,
          href: settings.facebook,
          label: "Facebook",
          backgroundColor: "bg-[#3b579d]",
        },
        {
          icon: Instagram,
          href: settings.instagram,
          label: "Instagram",
          backgroundColor: "bg-[#a408f3]",
        },
        {
          icon: Youtube,
          href: settings.youtube,
          label: "YouTube",
          backgroundColor: "bg-red-600",
        },
        {
          icon: Linkedin,
          href: settings.linkedin,
          label: "LinkedIn",
          backgroundColor: "bg-[#0274b3]",
        },
        {
          icon: Twitter,
          href: settings.twitter,
          label: "Twitter",
          backgroundColor: "bg-[#1d9bf0]",
        },
        {
          icon: Send,
          href: settings.telegram,
          label: "Telegram",
          backgroundColor: "bg-[#29a9eb]",
        },
      ]
    : [];

  if (!settings) return null;

  return (
    <footer className="bg-[#ecf4fc] py-12 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Contact Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="logo w-[300px] md:w-[200px] flex flex-col items-center md:items-start text-center md:text-left mx-auto md:mx-0">
                <Image
                  src={settings.image.url}
                  alt="Logo"
                  width={160}
                  height={100}
                  className="mx-auto md:mx-0"
                />
                <div className="text-md font-medium text-blue-950 mt-2 text-center md:text-left">
                  Empowering minds for a brighter future.
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm text-blue-950">
              <div>
                <span className="font-semibold">
                  {" "}
                  {t("footer.sections.address")}:
                </span>{" "}
                <a
                  href="https://maps.app.goo.gl/EDCVmQbp1YNhk1277"
                  target="_blank"
                  rel="nooperner noreferrer"
                  className="text-slate-700 hover:underline"
                >
                  {settings?.address}
                </a>
              </div>
              <div>
                <span className="font-semibold">
                  {t("footer.sections.phone")}:
                </span>{" "}
                <a
                  href={`tel:${settings?.phone || "+919312511015"}`}
                  className="text-slate-700 hover:underline"
                >
                  {settings?.phone || "+91 9312511015"}
                </a>
              </div>
              <div>
                <span className="font-semibold">
                  {t("footer.sections.whatsapp")}:
                </span>{" "}
                <a
                  href="https://wa.me/919312511015"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:underline"
                >
                  +91 9312511015
                </a>
              </div>

              <div>
                <span className="font-semibold">
                  {t("footer.sections.email")}:
                </span>{" "}
                <a
                  href="mailto:info@dikshantias.com"
                  className="text-slate-700 hover:underline"
                >
                  info@dikshantias.com
                </a>
              </div>
              <div className="mt-5">
                <a
                  href="https://maps.app.goo.gl/EDCVmQbp1YNhk1277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#a50309] text-white rounded-md inline-block"
                >
                  {t("footer.sections.getDirection")}
                </a>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              {section.title && (
                <h3 className="font-semibold text-[#a50309] mb-4 text-sm">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="flex">
                    <ChevronsRight className="text-sm text-red-800" />
                    <a
                      href={link.href}
                      className="text-sm text-blue-950 hover:text-[#990312] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Media and Download App */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <h4 className="text-sm font-semibold text-[#8a0101] mb-3">
                {t("footer.sections.socialMedia")}
              </h4>
              <div className="flex space-x-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-8 h-8 text-white rounded-full flex items-center justify-center hover:bg-[#f43144] hover:text-white transition-colors ${social.backgroundColor}`}
                    aria-label={social.label}
                    target="_blank"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Download App */}
          <div className="text-right">
            <Link
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
              className="bg-red-700 rounded-sm text-sm px-5 py-3 font-medium text-gray-50 my-3 mx-1"
            >
              {t("footer.sections.downloadApp")}
            </Link>
          </div>
        </div>

        {/* ── Improved Live Visitor Counter ── */}
        <LiveVisitorCounter count={visitorCount} />

        {/* Copyright */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-xs text-blue-950">
            {settings.name} © 2026. | All Rights Reserved. | Develop By Hover
            Business Services LLP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
