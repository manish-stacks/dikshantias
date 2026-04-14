"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import HinduDetails from "@/app/current-affairs/HinduDetails";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
}

interface CurrentAffairItem {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  affairDate: string;
  content?: { en: string; hi: string };
  subCategory?: string | { _id: string };
  image?: { url: string };
  imageAlt?: string;
}

interface Card {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  content: { en: string; hi: string };
  date: string;
  month: string;
  year: string;
  bgColor: string;
  dateColor: string;
  imageUrl: string;
  imageAlt: string;
}

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
    <div className="p-4 md:p-6 flex gap-4">
      <div className="bg-gray-300 rounded-md px-3 py-4 flex-shrink-0 min-w-[60px]" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>
);

const ReadInHindu: React.FC = () => {
  const { i18n } = useTranslation("common");

  const lang = i18n.language as "en" | "hi";

  const router = useRouter();

  const params = useParams();

  const subCategorySlug = params?.slug as string;

  const [cards, setCards] = useState<Card[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const bgColors = [
    "bg-[#DBEAFE]",
    "bg-[#CEFAFE]",
    "bg-[#D0FAE5]",
    "bg-[#FEF9C2]",
    "bg-[#FFEDD4]",
    "bg-[#FFE2E2]",
  ];

  const dateColors = [
    "bg-[#BFDBFE]",
    "bg-[#A5F3FC]",
    "bg-[#A7F3D0]",
    "bg-[#FEF08A]",
    "bg-[#FED7AA]",
    "bg-[#FCA5A5]",
  ];

useEffect(() => {
  const fetchCards = async () => {
    try {
      setLoading(true);

      // get subcategory id
      const subRes = await fetch("/api/admin/sub-categories");

      const subcategories: SubCategory[] = await subRes.json();

      const subCategory = subcategories.find(
        (sub) => sub.slug === subCategorySlug,
      );

      if (!subCategory) {
        setCards([]);

        return;
      }

      // fetch paginated data
      const res = await fetch(
        `/api/admin/current-affairs?subCategory=${subCategory._id}&page=${currentPage}`,
      );
      const result = await res.json();

      const data: CurrentAffairItem[] = result.data;

      // set total pages
      setTotalPages(Math.ceil(result.total / result.limit));

      // format cards
      const formatted: Card[] = data.map((item, index) => {
        const date = new Date(item.affairDate);

        return {
          _id: item._id,

          title: item.title,

          slug: item.slug,

          content: item.content || { en: "", hi: "" },

          date: date.getDate().toString(),

          month: date.toLocaleString("default", { month: "short" }),

          year: date.getFullYear().toString(),

          bgColor: bgColors[index % bgColors.length],

          dateColor: dateColors[index % dateColors.length],

          imageUrl: item.image?.url || "",

          imageAlt: item.imageAlt || item.title?.en || "",
        };
      });

      setCards(formatted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (subCategorySlug) {
    fetchCards();
  }
}, [subCategorySlug, currentPage]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handlePageClick = (num: number) => setCurrentPage(num);

  // loading skeleton
  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 })

            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      </div>
    );
  }

  // no data
  if (!cards.length) return <p className="text-center py-10">No data found.</p>;

  // detail view
  if (activeCard) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <HinduDetails
          title={activeCard.title[lang]}
          content={activeCard.content[lang]}
          imageUrl={activeCard.imageUrl}
          imageAlt={activeCard.imageAlt}
          onClose={() => setActiveCard(null)}
        />
      </div>
    );
  }

  // list view UI
  return (
    <>
      {/* banner */}

      <div className="container max-w-7xl mx-auto mt-2 md:mt-3 my-4 px-2 md:px-0">
        <Image
          src="/img/current-affairs-banner.webp"
          width={1920}
          height={500}
          alt="Current Affairs Banner"
          className="rounded-xl"
        />
      </div>

      {/* cards */}

      <div className="bg-white p-4 md:p-6 lg:p-8 mb-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => (
              <div
                key={card._id}
                className={`${card.bgColor} rounded-lg border border-gray-200 overflow-hidden`}
              >
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* date */}

                    <div
                      className={`${card.dateColor} rounded-md px-3 py-2 flex-shrink-0 text-center min-w-[60px]`}
                    >
                      <div className="text-xs font-medium text-gray-600 uppercase">
                        {card.month}
                      </div>

                      <div className="text-2xl font-bold text-[#00072c]">
                        {card.date}
                      </div>

                      <div className="text-xs text-gray-600">{card.year}</div>
                    </div>

                    {/* content */}

                    <div className="flex-1">
                      <h3 className="text-sm md:text-base font-semibold text-[#00072c] mb-3 line-clamp-2">
                        {card.title[lang]}
                      </h3>

                      <button
                        onClick={() =>
                          router.push(`/current-affairs/view/${card.slug}`)
                        }
                        className="text-red-600 text-xs md:text-sm font-medium flex items-center gap-1"
                      >
                        VIEW DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}

          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button onClick={handlePrev} className="px-3 py-1 border rounded">
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageClick(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-red-600 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button onClick={handleNext} className="px-3 py-1 border rounded">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReadInHindu;
