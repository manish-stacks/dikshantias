"use client";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left Section (Logo + Toggle) */}
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

        {/* Hamburger Toggle (mobile) */}
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
      <div className="flex items-center gap-6 relative">
        {/* Profile with Dropdown */}
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
              <p className="text-sm font-semibold text-gray-800">Dikshant IAS</p>
            </div>
          </button>

          {/* Dropdown Menu */}
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
