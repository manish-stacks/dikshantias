"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

const HoliOfferPage = () => {
  const { t } = useTranslation("common");

  const demoCourses = [
    {
      title: t("coursesDemo.gs_ncert"),
      demo1: "https://youtube.com/live/FZCrsdcFXAU",
      demo2: "https://youtube.com/live/dLSyy2VC4fE",
    },
    {
      title: t("coursesDemo.gs_bpsc"),
      demo1: "https://youtube.com/live/b2PjcxSHrGw",
      demo2: "https://youtu.be/11EDkVTnugA",
    },
    {
      title: t("coursesDemo.csat_hindi"),
      demo1: "https://youtube.com/live/AFsS0viwVpY",
      demo2: "https://youtube.com/live/2cwyREv9Tps",
    },
    {
      title: t("coursesDemo.csat_english"),
      demo1: "https://youtube.com/live/dcEaP56h_RU",
      demo2: "https://youtube.com/live/VRmdmkUr3g8",
    },
    {
      title: t("coursesDemo.gs_upsc"),
      demo1: "https://youtube.com/live/NfLIUdYsqIQ",
      demo2: "https://youtu.be/EaknUVS0dE4",
    },
    {
      title: t("coursesDemo.sociology"),
      demo1: "https://youtube.com/live/b7_gwnwlOQ0",
      demo2: "https://youtu.be/hh8FvwQMKgM",
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE - IMAGE */}
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

        {/* RIGHT SIDE */}

        <div className="flex flex-col p-6 md:p-10 bg-[#F8FAFC] space-y-12">
          {/* DEMO SECTION */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A] mb-8">
              {t("demoSection.watch")}{" "}
              <span className="text-[#FB2C36]">{t("demoSection.demo")}</span>
            </h2>
            <div className="space-y-4">
              {demoCourses.map((course, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between 
                  border border-gray-200 p-5 rounded-2xl 
                  hover:shadow-lg transition duration-300 bg-white"
                >
                  {/* Title */}
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 sm:mb-0">
                    {course.title}
                  </h3>

                  {/* Buttons */}
                  <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                    <a
                      href={course.demo1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none text-center 
                        bg-[#1E3A8A] hover:bg-[#1E40AF] 
                        text-white px-4 py-2 rounded-lg text-sm font-medium 
                        transition-all duration-300 hover:scale-105"
                    >
                      ▶{t("demoSection.demo1")}
                    </a>

                    <a
                      href={course.demo2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none text-center 
                      bg-[#FB2C36] hover:bg-[#DC2626] 
                      text-white px-4 py-2 rounded-lg text-sm font-medium 
                      transition-all duration-300 hover:scale-105"
                    >
                      ▶ {t("demoSection.demo2")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OFFER CONTENT */}
          <div>
            <span className="text-sm uppercase tracking-widest text-[#FB2C36] font-semibold mb-4 block">
              {t("holiOffer.badge")}
            </span>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A] leading-tight mb-6">
              {t("holiOffer.title")}{" "}
              <span className="text-[#FB2C36]">{t("holiOffer.highlight")}</span>
            </h1>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {t("holiOffer.description")}
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-[#FB2C36] hover:bg-[#DC2626] text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <Download size={18} />
              {t("holiOffer.button")}
            </a>

            <p className="text-sm text-gray-500 mt-4">{t("holiOffer.note")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoliOfferPage;
