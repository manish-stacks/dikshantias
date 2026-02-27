"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Globe,
  Globe2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface ButtonData {
  id: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  textKey: string;
  bgColor: string;
  textColor: string;
  iconBg: string;
  action?: () => void;
}

export default function SlidingButtons({
  className = "",
}: {
  className?: string;
}) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { t, i18n } = useTranslation("common");

  const buttons: ButtonData[] = [
    {
      id: 2,
      icon: Globe,
      textKey: "visitHindi",
      bgColor: "bg-yellow-200",
      textColor: "text-yellow-900",
      iconBg: "bg-yellow-400",
      action: () => i18n.changeLanguage("hi"),
    },
    {
      id: 3,
      icon: Globe2,
      textKey: "visitEnglish",
      bgColor: "bg-pink-200",
      textColor: "text-pink-900",
      iconBg: "bg-pink-600",
      action: () => i18n.changeLanguage("en"),
    },
    {
      id: 1,
      icon: Download,
      textKey: "downloadApp",
      bgColor: "bg-purple-200",
      textColor: "text-purple-900",
      iconBg: "bg-purple-400",
      action: () =>
        window.open(
          "https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN",
        ),
    },
  ];

  // Auto-slide effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % buttons.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, [buttons.length]);

  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + buttons.length) % buttons.length);
  const nextSlide = () => setCurrentSlide((p) => (p + 1) % buttons.length);

  return (
    <div className={`w-full max-w-7xl mx-auto pt-2 md:pt-3 ${className}`}>
      {/* Desktop View - All buttons */}
      <div className="hidden md:flex md:justify-between items-center gap-6">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={`btn-${btn.id}-${btn.textKey}`}
              onClick={btn.action}
              className={`${btn.bgColor} ${btn.textColor} px-6 py-2 w-full rounded-lg flex items-center gap-3 font-semibold text-[10px] md:text-sm hover:scale-101 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2`}
              type="button"
              aria-label={t(btn.textKey)}
            >
              <div className={`${btn.iconBg} p-2 rounded-full`}>
                <Icon size={18} className="text-white" />
              </div>
              {t(btn.textKey)}
            </button>
          );
        })}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {buttons.map((btn) => {
            const Icon = btn.icon;
            return (
              <div
                key={`m-btn-${btn.id}-${btn.textKey}`}
                className="w-full flex-shrink-0 px-4"
              >
                <button
                  onClick={btn.action}
                  className={`${btn.bgColor} ${btn.textColor} w-full px-6 py-2 rounded-lg flex items-center justify-center gap-3 font-semibold text-[13px]`}
                  type="button"
                  aria-label={t(btn.textKey)}
                >
                  <div className={`${btn.iconBg} p-2 rounded-full`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-center">{t(btn.textKey)}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute bottom-[70px] left-4 p-1.5 rounded-full focus:outline-none focus:ring-1"
          disabled={currentSlide === 0}
          type="button"
          aria-label="Previous slide"
        >
          <ChevronLeft
            size={16}
            className={currentSlide === 0 ? "text-gray-400" : "text-gray-700"}
          />
        </button>
        <button
          onClick={nextSlide}
          className="absolute bottom-[70px] right-4 p-1.5 rounded-full focus:outline-none focus:ring-1"
          disabled={currentSlide === buttons.length - 1}
          type="button"
          aria-label="Next slide"
        >
          <ChevronRight
            size={16}
            className={
              currentSlide === buttons.length - 1
                ? "text-gray-400"
                : "text-gray-700"
            }
          />
        </button>
      </div>
    </div>
  );
}
