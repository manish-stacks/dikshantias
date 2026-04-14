"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const HoliOfferPage = () => {
  const { t } = useTranslation("common");

  // count page visit
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
      title: t("coursesDemo.gs_upsc_hindi"),
      demo1: "https://www.youtube.com/live/b7_gwnwlOQ0",
      demo2: "https://youtube.com/live/U4K6au34Kso",
    },
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
    {
      title: t("coursesDemo.sociology_ugc"),
      demo1: "https://youtube.com/live/q-kYad9XgpA",
      demo2: "https://youtube.com/live/aMmosC52lCA",
    },
  ];

  return (
    <div className="min-h-screen bg-white pt-2">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 p-4">
        {/* IMAGE */}
        <div className="flex items-center justify-center">
          <Image
            src="/img/Summer-Special-Offer.png"
            alt="Summer Offer"
            width={900}
            height={1200}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        {/* CONTENT */}
        <div className="space-y-8">
          {/* Demo videos */}
          <div>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mb-6">
              {t("demoSection.watch")}{" "}
              <span className="text-[#FB2C36]">{t("demoSection.demo")}</span>
            </h2>

            <div className="border rounded-lg overflow-hidden">
              {demoCourses.map((course, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row justify-between items-center gap-3 p-4 border-b"
                >
                  <h3 className="font-semibold text-[#FB2C36]">
                    {course.title}
                  </h3>

                  <div className="flex gap-2">
                    <a
                      href={course.demo1}
                      target="_blank"
                      className="bg-[#1E3A8A] text-white px-4 py-2 rounded text-sm"
                    >
                      Demo 1
                    </a>

                    <a
                      href={course.demo2}
                      target="_blank"
                      className="bg-[#1E3A8A] text-white px-4 py-2 rounded text-sm"
                    >
                      Demo 2
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Offer text */}

          <div>
            <h1 className="text-3xl font-bold text-[#1E3A8A] mb-3">
              {t("holiOffer.title")}
            </h1>

            <p className="text-gray-600 mb-6">{t("holiOffer.description")}</p>

            <a
              href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant"
              target="_blank"
              className="inline-flex items-center gap-2 bg-[#FB2C36] text-white px-6 py-3 rounded-lg"
            >
              <Download size={18} />
              {t("holiOffer.button")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoliOfferPage;
