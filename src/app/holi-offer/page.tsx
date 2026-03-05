"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const HoliOfferPage = () => {
  const { t } = useTranslation("common");

  useEffect(() => {
    const increaseVisit = async () => {
      try {
        await fetch("/api/holi-offer-visit", {
          method: "POST",
        });
      } catch (error) {
        console.error("Visit count failed");
      }
    };

    increaseVisit();
  }, []);

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
    <div className="min-h-screen bg-white-50 pt-0 md:pt-0">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden grid md:grid-cols-2">
        {/* LEFT SIDE - IMAGE */}
        <div className="relative bg-[#FFFF] pt-1 flex items-center justify-center p-3">
          <Image
            src="/img/holi-dhamaka.png"
            alt={t("holiOffer.alt")}
            width={900}
            height={1200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* RIGHT SIDE */}

        <div className="flex flex-col p-6 md:p-10 bg-[#F8FAFC] space-y-10">
          {/* ================= DEMO SECTION ================= */}
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A] mb-6 text-center md:text-left">
              {t("demoSection.watch")}{" "}
              <span className="text-[#FB2C36]">{t("demoSection.demo")}</span>
            </h2>

            <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
              {demoCourses.map((course, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between 
          p-4 hover:bg-gray-50 transition duration-200 text-center md:text-left"
                >
                  {/* Title */}
                  <h3 className="text-base md:text-lg font-semibold text-[#FB2C36] mb-3 md:mb-0">
                    {course.title}
                  </h3>

                  {/* Buttons */}
                  <div className="flex justify-center md:justify-end gap-2">
                    <a
                      href={course.demo1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1E3A8A] hover:bg-[#1E40AF] 
              text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      ▶ {t("demoSection.demo1")}
                    </a>

                    <a
                      href={course.demo2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1E3A8A] hover:bg-[#1E40AF] 
              text-white px-4 py-2 rounded-md text-sm font-medium transition"
                    >
                      ▶ {t("demoSection.demo2")}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= OFFER CONTENT ================= */}
          <div className="text-center md:text-left">
            <span className="text-xs md:text-sm uppercase tracking-widest text-[#FB2C36] font-semibold mb-3 block">
              {t("holiOffer.badge")}
            </span>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight mb-4">
              <span className="text-[#1E3A8A] block">
                {t("holiOffer.title")}
              </span>

              <span className="text-[#FB2C36] block">
                {t("holiOffer.highlight")}
              </span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 text-justify md:text-left">
              {t("holiOffer.description")}
            </p>

            <a
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 
                bg-[#FB2C36] hover:bg-[#DC2626] text-white 
                px-6 py-3 rounded-lg text-sm md:text-base font-semibold 
                shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <Download size={18} />
              {t("holiOffer.button")}
            </a>

            <p className="text-xs md:text-sm text-gray-500 mt-3">
              {t("holiOffer.note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoliOfferPage;
