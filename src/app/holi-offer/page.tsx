"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

const HoliOfferPage = () => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden grid md:grid-cols-2">
        {/* Left Side - Image */}
        <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-6">
          <Image
            src="/img/holioffers.png"
            alt={t("holiOffer.alt")}
            width={900}
            height={1200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col justify-center p-8 md:p-12 bg-[#F8FAFC]">
          <span className="text-sm uppercase tracking-widest text-[#FB2C36] font-semibold mb-4">
            {t("holiOffer.badge")}
          </span>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E3A8A] leading-tight mb-6">
            {t("holiOffer.title")}{" "}
            <span className="text-[#FB2C36]">{t("holiOffer.highlight")}</span>
          </h1>

          <p className="text-gray-600 text-base leading-relaxed mb-8">
            {t("holiOffer.description")}
          </p>

          <div className="space-y-4">
            <a
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#FB2C36] hover:bg-[#DC2626] text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <Download size={18} />
              {t("holiOffer.button")}
            </a>

            <p className="text-sm text-gray-500">{t("holiOffer.note")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoliOfferPage;
