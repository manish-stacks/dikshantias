"use client";

import ScholershipFaq from "@/component/ScholershipFaq";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

const ScholarshipPage: React.FC = () => {
  const { t } = useTranslation("common");

  const notesSteps = t("scholarships.notes", { returnObjects: true }) as
    | string[]
    | string;

  const applySteps = t("scholarships.apply", { returnObjects: true }) as
    | string[]
    | string;

  return (
      <>
        {/* Hero Section */}
        <div className="container max-w-7xl mx-auto my-4 px-2 mt-2 md:mt-3 md:px-0">
          <Image
            src="https://dikshantiasnew-web.s3.ap-south-1.amazonaws.com/sliders/1774513098087-ed3223d7-b8d5-4afd-8f31-f36d085ffa0c-desktop_banner.png"
            // src="/img/Scholarship-banner.png"
            width={1920}
            height={500}
            alt="Scholarship Hero"
            className="rounded-xl"
          />
        </div>
  
        {/* Scholarship Intro */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center px-2 md:px-0">
            <div>
              <div className="content md:pr-4 md:pt-4 text-center md:text-start">
                <h2 className="text-xl md:text-3xl lg:text-3xl font-bold text-red-700 mb-4">
                  {t("scholarships.title")}
                </h2>
                <p className="text-justify text-blue-950">
                  {t("scholarships.desc1")}
                </p>
                <p className="text-justify text-blue-950">
                  {t("scholarships.desc2")}
                </p>
  
                <h3 className="font-bold mt-4 text-[#040c33]">
                  {t("scholarships.funded")}
                </h3>
                <p className="text-justify text-blue-950">
                  {t("scholarships.register")}
                </p>
              </div>
            </div>
            <div>
              <div className="image md:pl-4 mt-6 md:pt-4">
                <Image
                  src="/img/scholarship-program.jpg"
                  width={1920}
                  height={500}
                  alt="Scholarship Program"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
  
        {/* Notes & Apply section */}
        <div className="bg-[#ecf4fc] mt-20 py-10 md:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center px-14 md:px-0">
              {/* Notes */}
              <div>
                <div className="content text-center md:text-start md:pr-4 pt-4">
                  <h3 className="text-xl md:text-3xl lg:text-3xl font-bold text-red-700 mb-4">
                    {t("scholarships.notesTitle")}
                  </h3>
                  <ul className="space-y-2 list-disc text-start text-blue-950">
                    {Array.isArray(notesSteps) ? (
                      notesSteps.map((step, idx) => <li key={idx}>{step}</li>)
                    ) : (
                      <li>{notesSteps}</li>
                    )}
                  </ul>
                </div>
              </div>
  
              {/* Apply */}
              <div>
                <div className="content md:pl-4 pt-4 text-center md:text-start">
                  <h3 className="text-xl md:text-3xl lg:text-3xl font-bold text-red-700 mb-4">
                    {t("scholarships.applyTitle")}
                  </h3>
                  <ul className="space-y-2 list-disc text-start text-blue-950">
                    {Array.isArray(applySteps) ? (
                      applySteps.map((step, idx) => <li key={idx}>{step}</li>)
                    ) : (
                      <li>{applySteps}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Mission & FAQ */}
        <div className="py-8 md:py-18">
          <div className="max-w-7xl mx-auto">
            <div className="items-center text-center md:text-left px-2 md:px-0">
              <div>
                <div className="content md:pr-4">
                  <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#040c33] mb-4">
                    {t("scholarships.mission")}
                  </h3>
                  <ScholershipFaq />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  )
};

export default ScholarshipPage;
