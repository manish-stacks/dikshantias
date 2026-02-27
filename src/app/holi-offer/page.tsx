"use client";

import Image from "next/image";
import { Download, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

const HoliOfferPage = () => {
  const { t } = useTranslation("common");

  const demoCourses = [
    {
      title: "GS - NCERT",
      demo1: "https://youtube.com/live/FZCrsdcFXAU",
      demo2: "https://youtube.com/live/dLSyy2VC4fE",
    },
    {
      title: "GS - BPSC",
      demo1: "https://youtube.com/live/b2PjcxSHrGw",
      demo2: "https://youtu.be/11EDkVTnugA",
    },
    {
      title: "CSAT (Hindi Med.)",
      demo1: "https://youtube.com/live/AFsS0viwVpY",
      demo2: "https://youtube.com/live/2cwyREv9Tps",
    },
    {
      title: "CSAT (English Med.)",
      demo1: "https://youtube.com/live/dcEaP56h_RU",
      demo2: "https://youtube.com/live/VRmdmkUr3g8",
    },
    {
      title: "GS - UPSC (English Med.)",
      demo1: "https://youtube.com/live/NfLIUdYsqIQ",
      demo2: "https://youtu.be/EaknUVS0dE4",
    },
    {
      title: "SOCIOLOGY (Optional Subject)",
      demo1: "https://youtube.com/live/b7_gwnwlOQ0",
      demo2: "https://youtu.be/hh8FvwQMKgM",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12">
      {/* ================= OFFER SECTION ================= */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden grid md:grid-cols-2">
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

      {/* ================= DEMO SECTION ================= */}

      <div className="w-full max-w-6xl mx-auto mt-24 bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1E3A8A] mb-12">
          Watch <span className="text-[#FB2C36]">Demo Classes</span>
        </h2>

        <div className="space-y-6">
          {demoCourses.map((course, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-200 p-6 rounded-2xl hover:shadow-md transition duration-300"
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-0">
                {course.title}
              </h3>

              <div className="flex flex-wrap gap-4">
                <a
                  href={course.demo1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  ▶ Demo - 1
                </a>

                <a
                  href={course.demo2}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#FB2C36] hover:bg-[#DC2626] text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  ▶ Demo - 2
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HoliOfferPage;
