"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Course {
  _id: string;
  titleEN: string;
  titleHI: string;
  monthYear: string;
  active: boolean;
  displayOrder: number;
  fileLinkEN?: { url: string; key: string };
  fileLinkHI?: { url: string; key: string };
}

const ELearningPage = () => {
  const { t, i18n } = useTranslation("common");
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/admin/elearnings");
        const data = await res.json();
        // Optionally sort by displayOrder
        data.sort((a: Course, b: Course) => a.displayOrder - b.displayOrder);
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + itemsPerPage);

  const downloadBtnClass =
    "inline-flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs md:text-sm font-medium py-1 px-3 rounded-md transition-all";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-16">
      <header className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
          {t("ELearning")}
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          {t("Browse")}
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-sm overflow-hidden text-sm md:text-base">
          <thead className="bg-gray-100 text-gray-700 uppercase text-left">
            <tr>
              <th className="px-4 py-2">{t("EName")}</th>
              <th className="px-4 py-2">{t("MonthYear")}</th>
              <th className="px-4 py-2 text-center">{t("Download")}</th>
            </tr>
          </thead>
          <tbody>
            {currentCourses.map((course) => (
              <tr key={course._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2 font-medium text-gray-800">
                  {i18n.language === "hi" ? course.titleHI : course.titleEN}
                </td>
                <td className="px-4 py-2 text-gray-600">{course.monthYear}</td>
                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  {course.fileLinkEN && (
                    <a href={course.fileLinkEN.url} download className={downloadBtnClass}>
                      <Download className="w-3 h-3 md:w-4 md:h-4" /> {t("English")}
                    </a>
                  )}
                  {course.fileLinkHI && (
                    <a href={course.fileLinkHI.url} download className={downloadBtnClass}>
                      <Download className="w-3 h-3 md:w-4 md:h-4" /> {t("Hindi")}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* Pagination */}
    {courses.length > itemsPerPage && (
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
        >
          {t("Prev")}
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === index + 1 ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-sm"
        >
          {t("Next")}
        </button>
      </div>
    )}

    </div>
  );
};

export default ELearningPage;
