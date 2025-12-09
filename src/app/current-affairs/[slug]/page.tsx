'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import HinduDetails from '@/app/current-affairs/HinduDetails';


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
  const { i18n } = useTranslation('common');
  const lang = i18n.language as 'en' | 'hi';
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const router = useRouter();


  const params = useParams();
  const subCategorySlug = params?.slug as string | undefined;

  const bgColors = ['bg-[#DBEAFE]', 'bg-[#CEFAFE]', 'bg-[#D0FAE5]', 'bg-[#FEF9C2]', 'bg-[#FFEDD4]', 'bg-[#FFE2E2]'];
  const dateColors = ['bg-[#BFDBFE]', 'bg-[#A5F3FC]', 'bg-[#A7F3D0]', 'bg-[#FEF08A]', 'bg-[#FED7AA]', 'bg-[#FCA5A5]'];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const subRes = await fetch('/api/admin/sub-categories');
        const subcategories: SubCategory[] = await subRes.json();
        const subCategory = subcategories.find((sub) => sub.slug === subCategorySlug);
        if (!subCategory) {
          setCards([]);
          return;
        }

        const res = await fetch('/api/admin/current-affairs');
        const data: CurrentAffairItem[] = await res.json();

        const filteredData = data.filter((item) => {
          const subId = typeof item.subCategory === 'string' ? item.subCategory : item.subCategory?._id;
          return subId === subCategory._id;
        });

        const formattedCards: Card[] = filteredData.map((item, index) => {
          const bgColor = bgColors[index % bgColors.length];
          const dateColor = dateColors[index % dateColors.length];
          const affairDate = new Date(item.affairDate);
          return {
            _id: item._id,
            title: item.title,
            slug: item.slug,
            content: item.content || { en: '', hi: '' },
            date: affairDate.getDate().toString(),
            month: affairDate.toLocaleString('default', { month: 'short' }),
            year: affairDate.getFullYear().toString(),
            bgColor,
            dateColor,
            imageUrl: item.image?.url || '',
            imageAlt: item.imageAlt || item.title?.en || '',
          };
        });

        formattedCards.sort((a, b) => {
          const dateA = new Date(`${a.month} ${a.date}, ${a.year}`).getTime();
          const dateB = new Date(`${b.month} ${b.date}, ${b.year}`).getTime();
          return dateB - dateA;
        });

        setCards(formattedCards);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (subCategorySlug) fetchCards();
  }, [subCategorySlug]);

  // Pagination logic
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const currentCards = cards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (num: number) => setCurrentPage(num);

  if (loading) {
    return (
      <div className="bg-white p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (!cards.length) return <p className="text-center py-10">No data found.</p>;

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

  return (
    <>
      <div className="container max-w-7xl mx-auto -mt-14 md:mt-3 my-4 px-2 md:px-0">
        <Image
          src="/img/current-affairs-banner.webp"
          width={1920}
          height={500}
          alt="Current Affairs Banner"
          className="rounded-xl"
        />
      </div>

      <div className="bg-white p-4 md:p-6 lg:p-8 mb-5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {currentCards.map((card) => (
              <div key={card._id} className={`${card.bgColor} rounded-lg border border-gray-200 overflow-hidden`}>
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`${card.dateColor} rounded-md px-3 py-2 flex-shrink-0 text-center min-w-[60px]`}>
                      <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">{card.month}</div>
                      <div className="text-2xl md:text-3xl font-bold text-[#00072c] leading-none">{card.date}</div>
                      <div className="text-xs text-gray-600 mt-1">{card.year}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-[#00072c] leading-tight mb-3 line-clamp-2">
                        {card.title[lang]}
                      </h3>
                      {/* <button
                        onClick={() => setActiveCard(card)}
                        className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium uppercase tracking-wide transition-colors duration-200 flex items-center gap-1"
                      >
                        VIEW DETAILS
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button> */}

                      <button
                        onClick={() => router.push(`/current-affairs/view/${card.slug}`)}
                        className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium uppercase tracking-wide transition-colors duration-200 flex items-center gap-1"
                      >
                        VIEW DETAILS
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {cards.length > cardsPerPage && (
            <div className="flex justify-center items-center mt-10 space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm font-medium border ${currentPage === 1
                  ? 'text-gray-400 border-gray-200'
                  : 'text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageClick(i + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-medium border ${currentPage === i + 1
                    ? 'bg-red-600 text-white border-red-600'
                    : 'text-gray-700 hover:bg-gray-100 border-gray-300'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm font-medium border ${currentPage === totalPages
                  ? 'text-gray-400 border-gray-200'
                  : 'text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
              >
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
