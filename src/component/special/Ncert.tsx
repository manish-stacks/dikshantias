"use client";

import React, { useEffect, useState } from "react";

import { ChevronDown, Download, BookOpen, GraduationCap } from "lucide-react";

interface Subject {
  subjectName: string;
  pdf: string;
}

interface NCERTBook {
  _id: string;
  className: string;
  subjects: Subject[];
}

const NCERTSubjects = () => {
  const [openClass, setOpenClass] = useState<number | null>(0);

  const [ncertData, setNcertData] = useState<NCERTBook[]>([]);

  // FETCH DATA
  useEffect(() => {
    fetchNCERTBooks();
  }, []);

  const fetchNCERTBooks = async () => {
    try {
      const res = await fetch("/api/admin/ncert-books");

      const data = await res.json();

      setNcertData(data);
    } catch (error) {
      console.error("Error fetching NCERT books:", error);
    }
  };

  return (
    <section className="relative py-5 pb-10 overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-[#f9fafb]">
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-red-100/40 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-yellow-100/30 blur-3xl rounded-full" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* HERO BANNER */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#071726] shadow-[0_10px_35px_rgba(0,0,0,0.12)] mb-6">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#071726] via-[#0b2235] to-[#102d46]" />

          {/* Soft Glow */}
          <div className="absolute -top-16 -left-10 w-52 h-52 bg-red-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 right-0 w-52 h-52 bg-yellow-400/10 blur-3xl rounded-full" />

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative px-5 py-4 md:px-5 md:py-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full mb-4">
              <GraduationCap className="w-3.5 h-3.5 text-yellow-400" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-300">
                NCERT Study Materials
              </span>
            </div>

            {/* Heading */}
            <h2 className="flex items-center flex-wrap gap-2 text-2xl md:text-4xl font-black tracking-tight leading-none">
              <span className="text-white">DOWNLOAD</span>

              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                NCERT PDF
              </span>
            </h2>
            {/* Description */}
            <p className="mt-2 text-xs md:text-sm text-gray-300 leading-relaxed max-w-2xl">
              Free NCERT Books, Notes & Study Materials for Classes 6th to 12th.
            </p>
          </div>
        </div>

        {/* ACCORDION CARDS */}
        <div className="space-y-5">
          {ncertData.map((item, index) => (
            <div
              key={item._id}
              className="group overflow-hidden rounded-3xl border border-gray-200/70 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
            >
              {/* HEADER */}
              <button
                onClick={() => setOpenClass(openClass === index ? null : index)}
                className="w-full px-6 md:px-8 py-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                    <BookOpen className="w-6 h-6 text-white" />

                    <div className="absolute inset-0 rounded-2xl border border-white/20" />
                  </div>

                  {/* Text */}
                  <div className="text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                      {item.className}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.subjects.length} Subjects Available
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className={`w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-500 ${
                    openClass === index ? "rotate-180 bg-red-50" : ""
                  }`}
                >
                  <ChevronDown className="w-5 h-5 text-red-600" />
                </div>
              </button>

              {/* CONTENT */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  openClass === index
                    ? "max-h-[1200px] opacity-100 pb-6"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 md:px-8">
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {item.subjects.map((subject, subIndex) => (
                      <div
                        key={subIndex}
                        className="group/item relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5 hover:border-red-200 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Hover Glow */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-red-100 blur-3xl opacity-0 group-hover/item:opacity-60 transition-all duration-500" />

                        <div className="relative flex items-center justify-between gap-4">
                          {/* Subject */}
                          <div>
                            <h4 className="text-base md:text-lg font-bold text-gray-900">
                              {subject.subjectName}
                            </h4>

                            <p className="text-xs text-gray-500 mt-1">
                              NCERT PDF Notes
                            </p>
                          </div>

                          {/* Download */}
                          <a
                            href={subject.pdf}
                            target="_blank"
                            className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NCERTSubjects;
