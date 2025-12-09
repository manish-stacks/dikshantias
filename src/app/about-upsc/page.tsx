"use client";

import React from "react";
import { useTranslation } from 'react-i18next';

const AboutUPSC: React.FC = () => {
   const { t } = useTranslation("common")

  return (
    <section className="bg-white py-12 px-4 border-t mt-3 border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* About UPSC CSE Section */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold text-[#040c33] mb-4">
            {t("aboutupsc.aboutTitle")}
          </h2>
          <p className="text-sm text-blue-950 mb-4 leading-relaxed">
            {t("aboutupsc.aboutDesc")}
          </p>

          <h3 className="text-base font-semibold text-[#040c33] mb-3">
            {t("aboutupsc.skillsTitle")}
          </h3>
          <p className="text-sm text-blue-950 mb-4 leading-relaxed">
            {t("aboutupsc.skillsDesc")}
          </p>

          <h3 className="text-base font-semibold text-[#040c33] mb-3">
            {t("aboutupsc.successTitle")}
          </h3>
          <p className="text-sm text-blue-950 mb-4 leading-relaxed">
            {t("aboutupsc.successDesc1")}
          </p>
          <p className="text-sm text-blue-950 mb-4 leading-relaxed">
            {t("aboutupsc.successDesc2")}
          </p>
          <p className="text-sm text-blue-950 mb-4 leading-relaxed">
            {t("aboutupsc.successDesc3")}
          </p>
          <p className="text-sm text-blue-950 mb-6 leading-relaxed">
            {t("aboutupsc.successDesc4")}
          </p>

          <h3 className="text-base font-semibold text-[#040c33] mb-3">
            {t("aboutupsc.communityTitle")}
          </h3>
          <p className="text-sm text-blue-950 mb-6 leading-relaxed">
            {t("aboutupsc.communityDesc")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUPSC;
