"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, Download } from "lucide-react";

export default function HomePopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-3">
      {/* Popup Container */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => setShow(false)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-pink-600 text-white text-center py-3 text-lg font-semibold">
          🎉 Holi 99% Scholarship Offer
        </div>

        {/* Image Section - Fully Visible */}
        <div className="w-full flex justify-center bg-white">
          <Image
            src="/img/holi.png"
            alt="Holi Offer"
            width={800}
            height={1000}
            className="w-full h-auto max-h-[55vh] object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 text-center">
          <h2 className="text-lg md:text-xl font-bold text-purple-700 mb-2">
            Celebrate Holi with Success 🌈
          </h2>

          <p className="text-gray-600 text-sm md:text-base mb-4">
            Get up to 99% scholarship on selected UPSC courses.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm md:text-base transition"
            >
              <Download size={16} />
              Download App
            </a>
            {/* 
            <a
              href="/contact"
              className="bg-purple-700 hover:bg-purple-800 text-white px-5 py-2 rounded-lg text-sm md:text-base transition"
            >
              Claim Course
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
