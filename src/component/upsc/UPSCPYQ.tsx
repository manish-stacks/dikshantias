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

const subjects = [
  {
    name: "World History",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    name: "Science & Technology",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    name: "Polity",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  {
    name: "International Relations",
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    name: "Agriculture",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    name: "Indian Society",
    color: "bg-pink-50 text-pink-700 border-pink-200",
  },
  {
    name: "Post Independent India",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    name: "Environment and Ecology",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    name: "Social Justice",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  {
    name: "Ancient History and Art & Culture",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
  {
    name: "Modern History",
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    name: "Internal Security",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    name: "Governance",
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
  {
    name: "Geography",
    color: "bg-lime-50 text-lime-700 border-lime-200",
  },
  {
    name: "Ethics (Case Studies)",
    color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  },
  {
    name: "Ethics (Theoretical Questions)",
    color: "bg-violet-50 text-violet-700 border-violet-200",
  },
  {
    name: "Disaster Management",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    name: "Economic Development",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
];
const UPSCPYQ: React.FC = () => {
  const { i18n, t } = useTranslation("common");
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].name);

  const lang = i18n.language === "hi" ? "hi" : "en";
  const [allData, setAllData] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="prose max-w-none"
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
                    UPSC PYQ – Topic-wise Analysis
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    Dive into subject-wise PYQs with curated insights, helping
                    you understand patterns, concepts, and answer-writing
                    strategies for the UPSC exam.
                  </p>
                </div>
                {/* Subjects */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3">
                  {subjects.map((sub) => (
                    <div
                      key={sub.name}
                      onClick={() => setSelectedSubject(sub.name)}
                      className={`cursor-pointer group p-3 rounded-xl border transition-all duration-300 flex items-center justify-between
                          ${
                            selectedSubject === sub.name
                              ? "bg-red-600 text-white border-red-600 shadow-md scale-[1.02]"
                              : sub.color
                          }`}
                    >
                      <span className="text-sm font-medium leading-tight">
                        {sub.name}
                      </span>
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                        ${
                          selectedSubject === sub.name
                            ? "bg-white"
                            : "bg-gray-300 group-hover:bg-red-400"
                        }`}
                      />
                    </div>
                  ))}
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
