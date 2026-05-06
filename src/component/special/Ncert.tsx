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
    <section className="relative py-20 overflow-hidden bg-[#fafafa]">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-red-100/40 blur-3xl rounded-full" />

      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-blue-100/40 blur-3xl rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 px-6 py-3 rounded-full shadow-sm mb-7">
            <GraduationCap className="w-5 h-5 text-red-600" />

            <span className="text-sm font-bold tracking-wide text-red-700 uppercase">
              NCERT Study Materials
            </span>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
            Download
            <span className="block mt-2 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              NCERT Books PDF
            </span>
          </h2>

          {/* Subtitle */}
          <div className="flex justify-center mt-5">
            <div className="px-5 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold">
              Class 6th to 12th • All Subjects Available
            </div>
          </div>
        </div>

        {/* Dynamic Cards */}
        <div className="space-y-6">
          {ncertData.map((item, index) => (
            <div
              key={item._id}
              className="group bg-white/90 backdrop-blur-xl border border-gray-100 rounded-[30px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              {/* Header */}
              <button
                onClick={() => setOpenClass(openClass === index ? null : index)}
                className="w-full px-7 md:px-10 py-7 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-5">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {item.className}
                    </h3>

                    {/* <p className="text-gray-500 mt-1">
                      {item.subjects.length} Subjects Available
                    </p> */}
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center transition-all duration-500 ${
                    openClass === index ? "rotate-180 bg-red-50" : "rotate-0"
                  }`}
                >
                  <ChevronDown className="w-6 h-6 text-red-600" />
                </div>
              </button>

              {/* Content */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  openClass === index
                    ? "max-h-[1000px] opacity-100 pb-8"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-7 md:px-10">
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {item.subjects.map((subject, subIndex) => (
                      <div
                        key={subIndex}
                        className="group/item relative overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-5 hover:border-red-200 hover:shadow-lg transition-all duration-300"
                      >
                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 blur-2xl opacity-0 group-hover/item:opacity-60 transition-all duration-500" />

                        <div className="relative flex items-center justify-between">
                          {/* Subject */}
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">
                              {subject.subjectName}
                            </h4>

                            <p className="text-sm text-gray-500 mt-1">
                              NCERT PDF Notes
                            </p>
                          </div>

                          {/* Download */}
                          <a
                            href={subject.pdf}
                            target="_blank"
                            className="shrink-0 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
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
