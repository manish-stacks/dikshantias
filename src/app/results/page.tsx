"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface Topper {
  _id: string;
  name: { en: string; hi: string };
  service: { en: string; hi: string };
  year: string;
  rank: { en: string; hi: string };
  image: { url: string };
  active: boolean;
}

export default function ResultsPage() {
  const { t, i18n } = useTranslation("common");
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const lang = i18n.language === "hi" ? "hi" : "en";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("/api/admin/results");
        const data = await res.json();
        const activeResults = data.filter((item: Topper) => item.active);
        setToppers(activeResults);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const showMore = () => setVisibleCount((prev) => prev + 6);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {lang === "hi" ? "सभी परिणाम" : "All Results"}
      </h1>
      <h2 className="text-2xl font-bold mb-6">{t('ourResultsSubtitle')}</h2>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[#040c33] border border-[#000622] py-8 rounded-2xl animate-pulse"
              >
                <div className="w-28 h-28 rounded-full bg-gray-700 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-500 rounded w-1/4 mx-auto"></div>
              </div>
            ))
          : toppers.slice(0, visibleCount).map((topper) => (
              <div
                key={topper._id}
                className="text-center bg-[#040c33] border border-[#000622] py-8 rounded-2xl"
              >
                <div className="relative inline-block mb-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 md:border-3 border-orange-400 mx-auto">
                    <Image
                      src={topper.image?.url || "/placeholder.svg"}
                      alt={topper.name[lang]}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {topper.rank[lang]}
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">{topper.name[lang]}</h3>
                <p className="text-white/80 font-medium mb-1">{topper.service[lang]}</p>
                <p className="text-orange-300 text-sm">{topper.year}</p>
              </div>
            ))}
      </div>

      {!loading && visibleCount < toppers.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={showMore}
            className="px-6 py-2 bg-[#a50309] text-white rounded-md hover:bg-[#c70b1b] transition-colors"
          >
            {lang === "hi" ? "और दिखाएँ" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
