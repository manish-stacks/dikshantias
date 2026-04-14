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

        data.sort((a: Course, b: Course) => a.displayOrder - b.displayOrder);

        setCourses(data);
      } catch (error) {
        console.error("Fetch error", error);
      }
    };

    fetchCourses();
  }, []);

  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentCourses = courses.slice(startIndex, startIndex + itemsPerPage);

  const downloadBtn =
    "inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm px-3 py-1 rounded";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-3 md:px-16">
      {/* heading */}

      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {t("ELearning")}
        </h1>

        <p className="text-gray-500 text-sm">{t("Browse")}</p>
      </div>

      {/* table */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100 text-left text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-2">{t("EName")}</th>

              <th className="px-4 py-2">{t("MonthYear")}</th>

              <th className="px-4 py-2 text-center">{t("Download")}</th>
            </tr>
          </thead>

          <tbody>
            {currentCourses.map((course) => (
              <tr key={course._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">
                  {i18n.language === "hi" ? course.titleHI : course.titleEN}
                </td>

                <td className="px-4 py-2 text-gray-600">{course.monthYear}</td>

                <td className="px-4 py-2 text-center flex justify-center gap-2">
                  {course.fileLinkEN && (
                    <a
                      href={course.fileLinkEN.url}
                      download
                      className={downloadBtn}
                    >
                      <Download size={14} />
                      {t("English")}
                    </a>
                  )}

                  {course.fileLinkHI && (
                    <a
                      href={course.fileLinkHI.url}
                      download
                      className={downloadBtn}
                    >
                      <Download size={14} />
                      {t("Hindi")}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}

      {courses.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            {t("Prev")}
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === i + 1 ? "bg-red-600 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded text-sm"
          >
            {t("Next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default ELearningPage;
