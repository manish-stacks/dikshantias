"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const DirectorMessage: React.FC = () => {
  const { t } = useTranslation("common");

  // Founder data keys only (translations handled in JSON files)
  const founders = [
    {
      id: 1,
      key: "founders.pandey", // will match JSON structure
      image: "/img/ss-pandey.jpg",
      url: "https://drsspandey.com/",
    },
    {
      id: 2,
      key: "founders.ashutosh",
      image: "/img/ashutosh-dixit.jpg",
      url: "/ashutosh-dixit",
    },
  ];

  return (
    <div className="bg-[#ecf4fc] py-18 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {founders.map((founder) => (
            <div
              key={founder.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl p-2 text-center md:text-left transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image */}
                <div className="md:w-70 w-40 h-40 mx-auto rounded-full md:rounded-none md:h-auto overflow-hidden">
                  <Image
                    width={500}
                    height={600}
                    src={founder.image ?? "/default-image.jpg"}
                    alt={t(`${founder.key}.name`)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 py-4 px-2 md:p-6">
                  <h2 className="text-[18px] md:text-xl font-bold text-[#860106] mb-2">
                    {t(`${founder.key}.name`)}
                  </h2>
                  <p className="text-[#092370] font-medium text-sm mb-1">
                    {t(`${founder.key}.title`)}
                  </p>
                  <p className="text-blue-950 text-md text-justify leading-relaxed mb-4">
                    {t(`${founder.key}.description`)}
                  </p>
                  <Link
                    href={founder.url}
                    className="text-[#b10208] font-semibold text-sm hover:underline"
                  >
                    {t("readMore", { defaultValue: "Read More" })}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectorMessage;
