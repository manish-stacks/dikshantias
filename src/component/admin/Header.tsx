"use client";

import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear Cache Function
  const handleClearCache = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/clear-cache", {
        method: "POST",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="inline-block">
          <Image
            src="/img/dikshant-logo.png"
            alt="Dikshant IAS Logo"
            width={160}
            height={60}
            className="object-contain"
          />
        </Link>

        {/* Hamburger Toggle */}
        <button className="lg:hidden p-2 rounded-md hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Clear Cache Button */}
        <button
          onClick={handleClearCache}
          disabled={loading}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-sm disabled:opacity-70"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Trash2 size={18} />
          )}

          <span className="hidden sm:block">
            {loading ? "Clearing..." : "Clear Cache"}
          </span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-full bg-[#e94e4e] flex items-center justify-center text-white font-semibold cursor-pointer">
              D
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs text-gray-500">Welcome</p>
              <p className="text-sm font-semibold text-gray-800">
                Dikshant IAS
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-xl py-2 border border-gray-100">
              <button
                onClick={() => {
                  localStorage.removeItem("adminToken");
                  window.location.href = "/admin/login";
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-[#e94e4e]/10 hover:text-[#e94e4e] transition-all duration-200"
              >
                <LogOut size={18} className="text-[#e94e4e]" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 