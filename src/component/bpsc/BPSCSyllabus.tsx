"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPageContent } from "@/lib/getPageContent";

export default function BPSCSyllabus() {
  const { i18n, t } = useTranslation("common");

  const lang = i18n.language === "hi" ? "hi" : "en";

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getPageContent("BPSC", "Syllabus").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* HERO SECTION */}

      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        {/* decorative bg */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* LEFT */}
            <div>
              <span className="inline-block px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-full mb-4">
                {t("complete_preparation_guide")}
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 leading-snug tracking-tight max-w-2xl">
                {data?.[lang]?.title}
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                {data?.[lang]?.shortContent}
              </p>

              {/* buttons */}
              {data?.[lang]?.pdf?.url && (
                <div className="flex flex-wrap gap-4">
                  <a
                    href={data?.[lang]?.pdf?.url}
                    download
                    className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    {t("download_pdf")}
                  </a>

                  <a
                    href={data?.[lang]?.pdf?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-xl text-sm font-bold hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                  >
                    {t("view_pdf")}
                  </a>
                </div>
              )}
            </div>

            {/* RIGHT DESIGN */}
            <div className="relative hidden md:block">
              <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-12 border border-red-200 shadow-xl">
                <div className="space-y-4">
                  <div className="h-12 bg-red-600 rounded-lg opacity-80" />
                  <div className="h-12 bg-red-500 rounded-lg opacity-60" />
                  <div className="h-12 bg-red-400 rounded-lg opacity-40" />

                  <div className="space-y-2 mt-6">
                    <div className="h-3 bg-red-300 rounded opacity-50" />
                    <div className="h-3 bg-red-300 rounded opacity-40 w-5/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT SECTION */}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
          {data?.[lang]?.content && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: data?.[lang]?.content || "",
              }}
            />
          )}
        </div>
      </section>
    </>
  );
}
