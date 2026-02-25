"use client";

import Image from "next/image";
import { Download } from "lucide-react";

export default function HoliOfferPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Image */}
        <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-6">
          <Image
            src="/img/holioffer.png"
            alt="Holi Scholarship Offer"
            width={900}
            height={1200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col justify-center p-8 md:p-12 bg-[#F8FAFC]">
          <span className="text-sm uppercase tracking-widest text-[#FB2C36] font-semibold mb-4">
            Limited Time Holi Scholarship
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] leading-tight mb-6">
            Celebrate Holi with a{" "}
            <span className="text-[#FB2C36]">99% Scholarship</span>
          </h1>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            This Holi, take a confident step toward your UPSC dream. Unlock
            exclusive scholarship benefits available for a short time only.
          </p>

          <div className="space-y-4">
            <a
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
              target="_blank"
              className="inline-flex items-center justify-center gap-3 bg-[#FB2C36] hover:bg-[#DC2626] text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <Download size={18} />
              Download App & Claim Offer
            </a>

            <p className="text-sm text-gray-500">
              Seats are limited. Offer valid for a short duration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
