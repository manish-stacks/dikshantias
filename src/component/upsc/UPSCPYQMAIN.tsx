"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface PageContent {
  subject?: string;
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
  exam?: string;
  page?: string;
  status?: boolean;
}

const colors = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-red-50 text-red-700 border-red-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "bg-green-50 text-green-700 border-green-200",
];

const UPSCPYQ: React.FC = () => {
  const { i18n, t } = useTranslation("common");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const lang = i18n.language === "hi" ? "hi" : "en";
  const [allData, setAllData] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch("/api/admin/subjects?exam=UPSC&type=MAINS");
      const data = await res.json();

      const list = data.data || [];

      setSubjects(list);

      if (list.length > 0) {
        setSelectedSubject(list[0].slug);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    fetch("/api/admin/page-content")
      .then((res) => res.json())
      .then((res) => {
        const pyqList = res.filter(
          (item: PageContent) =>
            item.exam === "UPSC" && item.page === "PYQ" && item.status === true,
        );
        setAllData(pyqList);
      })
      .finally(() => setLoading(false));
  }, []);

  const normalize = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, " ");

  const data = allData.find(
    (item) => normalize(item.subject || "") === normalize(selectedSubject),
  );
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-5">
          <div className="h-10 bg-gray-200 rounded w-1/2" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }
  {
    !data ? (
      <div className="text-center text-gray-500 py-10">
        No content available for this subject
      </div>
    ) : (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{
          __html: data?.[lang]?.content || "",
        }}
      />
    );
  }
  return (
    <>
      {/* HERO SECTION */}

      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        {/* decorative bg */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-30" />

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto">
            {/* RIGHT DESIGN BOX */}

            <div className="relative hidden md:block">
              <div className="bg-white rounded-2xl p-4 md:p-5 border shadow-xl">
                <div className="mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    UPSC PYQ (Mains) – Topic-wise Analysis
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Dive into subject-wise PYQs with curated insights, helping
                    you understand patterns, concepts, and answer-writing
                    strategies for the UPSC exam.
                  </p>
                </div>
                {/* Subjects */}
                <div className="flex flex-wrap gap-3">
                  {subjects.map((sub, index) => {
                    const color = colors[index % colors.length];

                    return (
                      <div
                        key={sub._id}
                        onClick={() => setSelectedSubject(sub.slug)}
                        className={`cursor-pointer group px-4 py-2 rounded-md border transition-all duration-300 flex items-center gap-2
                            ${
                                selectedSubject === sub.slug
                                ? "bg-red-600 text-white border-red-600 shadow-md scale-[1.02]"
                                : color
                            }`}>
                        <span className="text-sm font-medium whitespace-nowrap">
                          {sub.name}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full transition-all duration-300
                        ${
                        selectedSubject === sub.slug
                            ? "bg-white"
                            : "bg-gray-300 group-hover:bg-red-400"
                        }`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border">
          {!data ? (
            <div className="text-center text-gray-500 py-10">
              No content available for this subject
            </div>
          ) : (
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
};

export default UPSCPYQ;
