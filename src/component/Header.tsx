"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown, Menu, X, Phone, Play, LogOut, User,
  BookOpen, Video, Wifi, MapPin, FileText, Trophy,
  ClipboardList, Newspaper, GraduationCap, Zap, BarChart2, Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SlidingButtons from "./SlidingButtons";
import { useAuthStore } from "@/lib/store/auth.store";
import DikshantAuthModal from "@/components/auth-model/DikshantAuthModal";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: { _id: string; name: string; slug: string };
  active: boolean;
}

interface SettingsData {
  image: { url: string };
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
}

type DropdownKey = "courses" | "currentAffairs" | "quiz" | "testSeries" | null;

const COURSES_MENU = [
  { href: "/online-live-course", icon: Wifi, label: "Online Live Course", desc: "Interactive live sessions" },
  { href: "/offline-course", icon: MapPin, label: "Offline Mode", desc: "Classroom training" },
  { href: "/video-courses", icon: Video, label: "Video Courses", desc: "Learn at your pace" },
];


/* ────────────────────────────────────────────────────────────── */
/*  Main Header                                                   */
/* ────────────────────────────────────────────────────────────── */
const Header: React.FC = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<DropdownKey>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  const { t, i18n } = useTranslation("common");
  const { loggedIn, user, logout } = useAuthStore();
  const [lang, setLang] = useState(i18n.language || "en");
  const displayName = user?.name || user?.mobile || "User";

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* fetch data */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/sub-categories");
        const data = await res.json();
        setSubCategories(data.filter((i: SubCategory) => i.active));
      } catch { }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data[0]);
      } catch { }
    })();
  }, []);

  /* dropdown helpers */
  const handleMouseEnter = (menu: DropdownKey) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(menu);
  };
  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((v) => !v);
    setOpenMobileDropdown(null);
  };
  const handleMobileDropdownToggle = (menu: DropdownKey) =>
    setOpenMobileDropdown((v) => (v === menu ? null : menu));

  const changeLanguage = (lng: "en" | "hi") => {
    i18n.changeLanguage(lng);
    setLang(lng);
  };

  const handleLogout = async () => {
    try { await logout(); window.location.href = "/"; } catch { }
  };
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    <>
      {/* ── Top announcement bar ──────────────────────── */}
      <div className="bg-red-600 text-white text-xs py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-white/80" />
            Admissions Open for {currentYear}–{nextYear} Batch — Limited Seats!
          </span>
          <div className="flex items-center gap-4">
            <a href="tel:09312511015" className="hover:underline flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 9312511015
            </a>
            <span className="opacity-40">|</span>
            <button
              onClick={() => changeLanguage("en")}
              className={`hover:underline ${lang === "en" ? "font-bold" : "opacity-70"}`}
            >EN</button>
            <span className="opacity-40">/</span>
            <button
              onClick={() => changeLanguage("hi")}
              className={`hover:underline ${lang === "hi" ? "font-bold" : "opacity-70"}`}
            >हि</button>
          </div>
        </div>
      </div>

      {/* ── Main sticky header ────────────────────────── */}
      <header className={`sticky top-0 z-40 w-full bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm border-b border-gray-100"}`}>
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {settings?.image?.url ? (
                <Image src={settings.image.url} alt={settings.name} width={150} height={44} className="h-10 w-auto object-contain" />
              ) : (
                <Image src="/img/dikshant-logo.png" alt="Logo" width={150} height={44} className="h-10 w-auto object-contain" />
              )}
            </Link>

            {/* ── Desktop nav ───────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-0.5">
              <NavLink href="/about-us">{t("about") || "About"}</NavLink>

              <DropdownMenu label={t("courses") || "Courses"} menuKey="courses"
                openDropdown={openDropdown} onEnter={handleMouseEnter} onLeave={handleMouseLeave}>
                <MegaDropdown items={COURSES_MENU} />
              </DropdownMenu>

              <DropdownMenu label={t("currentAffairs") || "Current Affairs"} menuKey="currentAffairs"
                openDropdown={openDropdown} onEnter={handleMouseEnter} onLeave={handleMouseLeave}>
                <div className="py-2 min-w-[220px]">
                  {subCategories.map((item) => (
                    <Link key={item._id} href={`/current-affairs/${item.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors">
                      <Newspaper className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              </DropdownMenu>



              <NavLink href="/quiz">{t("Quiz") || "Quiz"}</NavLink>

              <NavLink href="/test-series">{t("Test Series") || "Test Series"}</NavLink>



              <NavLink href="/scholarship-programme">{t("scholarship") || "Scholarship"}</NavLink>
              <NavLink href="/blogs">{t("blogs") || "Blogs"}</NavLink>
            </nav>

            {/* ── Right actions ─────────────────────────── */}
            <div className="flex items-center gap-2.5">
              {/* Phone – xl only */}
              <a href="tel:09312511015"
                className="hidden xl:flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors">
                <span className="bg-red-50 p-2 rounded-full">
                  <Phone className="w-4 h-4 text-red-600" />
                </span>
                <div className="leading-tight">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">Helpline</div>
                  <div className="text-xs font-semibold">+91 9312511015</div>
                </div>
              </a>

              {/* Auth buttons */}
              <div className="hidden md:flex items-center gap-2">
                {loggedIn ? (
                  <>
                    <Link href="/dashboard"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-800 transition">
                      <User className="w-4 h-4" />
                      <span className="max-w-[100px] truncate">{displayName}</span>
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm font-medium text-gray-700 transition">
                      <LogOut className="w-4 h-4" />
                      {t("logout") || "Logout"}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setOpenLogin(true)}
                      className="px-4 py-1.5 rounded-lg border border-red-500 text-red-600 text-sm font-medium hover:bg-red-50 transition">
                      {t("login") || "Login"}
                    </button>
                    <Link href="/register"
                      className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition shadow-sm">
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>

              {loggedIn ? (
                <div className="flex gap-2 lg:hidden p-2 ">
                  <Link href="/dashboard" onClick={toggleMobileMenu}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-gray-100 text-sm font-medium text-gray-800">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                </div>
              ) : (
                <div className="flex gap-2 lg:hidden p-2 ">
                  <button onClick={() => { toggleMobileMenu(); setOpenLogin(true); }}
                    className="flex-1 gap-1 py-1 px-2 rounded-xl border border-red-500 text-red-600 text-sm font-semibold">
                    Login
                  </button>
                </div>
              )}

              {/* Hamburger */}
              <button onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                aria-label="Toggle menu">
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Tablet quick-links strip (md–lg) ─────────── */}
        <div className="hidden md:flex lg:hidden bg-gray-50 border-t border-gray-100 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-4 py-1.5 min-w-max">
            {[
              { href: "/online-live-course", label: "Live Courses" },
              { href: "/video-courses", label: "Video Courses" },
              { href: "/quiz/daily", label: "Daily Quiz" },
              { href: "/test-series/prelims", label: "Test Series" },
              { href: "/current-affairs", label: "Current Affairs" },
              { href: "/blogs", label: "Blogs" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-red-600 whitespace-nowrap rounded-full hover:bg-white hover:shadow-sm transition">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Sliding Buttons */}
      <SlidingButtons />

      {/* ── Mobile Sidebar ────────────────────────────── */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="absolute inset-0 bg-black/60" onClick={toggleMobileMenu} />

        <div className={`absolute left-0 top-0 h-full w-[18rem] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>

          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
            <Link href="/" onClick={toggleMobileMenu}>
              <Image src="/img/dikshant-logo.png" alt="Logo" width={120} height={36} className="h-9 w-auto" />
            </Link>
            <button onClick={toggleMobileMenu} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
            <MobileLink href="/about-us" onClick={toggleMobileMenu}>Home</MobileLink>

            <MobileLink href="/about-us" onClick={toggleMobileMenu}>About Dikshant</MobileLink>
            <MobileLink href="/about-upsc" onClick={toggleMobileMenu}>About UPSC</MobileLink>

            <MobileAccordion label={t("courses") || "Courses"}
              isOpen={openMobileDropdown === "courses"} onToggle={() => handleMobileDropdownToggle("courses")}>
              {COURSES_MENU.map((item) => (
                <MobileSubLink key={item.href} href={item.href} icon={item.icon} onClick={toggleMobileMenu}>
                  {item.label}
                </MobileSubLink>
              ))}
            </MobileAccordion>

            <MobileAccordion label={t("currentAffairs") || "Current Affairs"}
              isOpen={openMobileDropdown === "currentAffairs"} onToggle={() => handleMobileDropdownToggle("currentAffairs")}>
              {subCategories.map((item) => (
                <MobileSubLink key={item._id} href={`/current-affairs/${item.slug}`} icon={Newspaper} onClick={toggleMobileMenu}>
                  {item.name}
                </MobileSubLink>
              ))}
            </MobileAccordion>
            <MobileLink href="/quiz" onClick={toggleMobileMenu}>Quiz</MobileLink>

            <MobileLink href="/test-series" onClick={toggleMobileMenu}>Test Series</MobileLink>




            <MobileLink href="/scholarship-programme" onClick={toggleMobileMenu}>
              {t("scholarship") || "Scholarship"}
            </MobileLink>
            <MobileLink href="/blogs" onClick={toggleMobileMenu}>
              {t("blogs") || "Blogs"}
            </MobileLink>
          </div>

          {/* Drawer footer */}
          <div className="flex-shrink-0 border-t border-gray-100 p-4 space-y-3">
            <a href={`tel:${settings?.phone || "+919312511015"}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition">
              <span className="bg-red-600 p-2 rounded-lg">
                <Phone className="w-4 h-4 text-white" />
              </span>
              <div>
                <div className="text-[11px] text-gray-400">Talk to Experts</div>
                <div className="font-semibold text-sm text-gray-800">{settings?.phone || "+91 9312511015"}</div>
              </div>
            </a>

            {loggedIn ? (
              <div className="flex gap-2">
                <Link href="/dashboard" onClick={toggleMobileMenu}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 text-sm font-medium text-gray-800">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <button onClick={handleLogout}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { toggleMobileMenu(); setOpenLogin(true); }}
                  className="flex-1 py-2.5 rounded-xl border border-red-500 text-red-600 text-sm font-semibold">
                  Login
                </button>
                <Link href="/register" onClick={toggleMobileMenu}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold text-center">
                  Sign Up Free
                </Link>
              </div>
            )}

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition">
              <Play className="w-4 h-4" /> Watch Live Demo
            </button>
          </div>
        </div>
      </div>

      <DikshantAuthModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </>
  );
};

export default Header;

/* ── Small reusable pieces ───────────────────────────────────── */

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Link href={href} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
    {children}
  </Link>
);

interface DropdownMenuProps {
  label: string;
  menuKey: DropdownKey;
  openDropdown: DropdownKey;
  onEnter: (k: DropdownKey) => void;
  onLeave: () => void;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label, menuKey, openDropdown, onEnter, onLeave, badge, badgeColor = "bg-red-500", children,
}) => {
  const isOpen = openDropdown === menuKey;
  return (
    <div className="relative" onMouseEnter={() => onEnter(menuKey)} onMouseLeave={onLeave}>
      <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${isOpen ? "text-red-600 bg-red-50" : "text-gray-700 hover:text-red-600 hover:bg-red-50"}`}>
        {label}
        {badge && (
          <span className={`ml-0.5 text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
};

const MegaDropdown: React.FC<{
  items: { href: string; icon: React.ElementType; label: string; desc: string }[];
}> = ({ items }) => (
  <div className="py-2 min-w-[240px]">
    {items.map((item) => (
      <Link key={item.href} href={item.href}
        className="flex items-start gap-3 px-4 py-2.5 hover:bg-red-50 group transition-colors mx-1 rounded-lg">
        <span className="mt-0.5 p-1.5 rounded-md bg-red-100 group-hover:bg-red-200 transition-colors flex-shrink-0">
          <item.icon className="w-3.5 h-3.5 text-red-600" />
        </span>
        <div>
          <div className="text-sm font-medium text-gray-800 group-hover:text-red-600 transition-colors">{item.label}</div>
          <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
        </div>
      </Link>
    ))}
  </div>
);

const MobileLink: React.FC<{ href: string; onClick: () => void; children: React.ReactNode }> = ({ href, onClick, children }) => (
  <Link href={href} onClick={onClick}
    className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
    {children}
  </Link>
);

const MobileAccordion: React.FC<{
  label: string; isOpen: boolean; onToggle: () => void;
  badge?: string; badgeColor?: string; children: React.ReactNode;
}> = ({ label, isOpen, onToggle, badge, badgeColor = "bg-red-500", children }) => (
  <div>
    <button onClick={onToggle}
      className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isOpen ? "text-red-600 bg-red-50" : "text-gray-700 hover:bg-gray-50"}`}>
      <span className="flex items-center gap-2">
        {label}
        {badge && (
          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </span>
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180 text-red-500" : ""}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="ml-2 mt-1 space-y-0.5 pb-1">{children}</div>
    </div>
  </div>
);

const MobileSubLink: React.FC<{
  href: string; icon: React.ElementType; onClick: () => void; children: React.ReactNode;
}> = ({ href, icon: Icon, onClick, children }) => (
  <Link href={href} onClick={onClick}
    className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
    <Icon className="w-4 h-4 opacity-50 flex-shrink-0" />
    {children}
  </Link>
);