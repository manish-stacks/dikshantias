"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PageContent {
  en?: {
    title?: string;
    shortContent?: string;
    content?: string;
    pdf?: { url?: string };
  };
  hi?: {
    title?: string;
    shortContent?: string;
    content?: string;
    pdf?: { url?: string };
  };
}

const AboutUPSC: React.FC = () => {
  const { i18n, t } = useTranslation("common");

  const lang = i18n.language === "hi" ? "hi" : "en";

  const [data, setData] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/admin/page-content");

        const json = await res.json();

        const aboutData = json.find(
          (item: any) =>
            item.exam === "UPSC" &&
            item.page === "About" &&
            item.status === true,
        );

        setData(aboutData);
      } catch (error) {
        console.error("Page content load error", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Content not available
      </div>
    );
  }

  return (
    <section className="bg-white py-12 px-4 border-t mt-3 border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* TITLE */}

        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#040c33]">
          {data?.[lang]?.title}
        </h1>

        {/* SHORT CONTENT */}

        {data?.[lang]?.shortContent && (
          <p className="text-gray-600 mb-6 leading-relaxed">
            {data?.[lang]?.shortContent}
          </p>
        )}

        {/* HTML CONTENT */}

        {data?.[lang]?.content && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: data?.[lang]?.content || "",
            }}
          />
        )}

        {/* PDF BUTTONS */}

        {data?.[lang]?.pdf?.url && (
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={data?.[lang]?.pdf?.url}
              download
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition"
            >
              {t("download_pdf")}
            </a>

            <a
              href={data?.[lang]?.pdf?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 border border-gray-300 hover:border-red-600 hover:text-red-600 text-sm font-semibold rounded-lg transition"
            >
              {t("view_pdf")}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutUPSC;
