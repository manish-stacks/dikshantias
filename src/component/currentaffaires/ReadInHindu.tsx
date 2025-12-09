'use client'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Card {
  date: string;
  month: string;
  year: string;
  title: string;
  bgColor: string;
  dateColor: string;
  url:string;
}

const ReadInHindu: React.FC = () => {
  const cards: Card[] = [
    {
      date: "25",
      month: "Apr",
      year: "2025",
      title: "25 April 2025, What to read in The Hindu",
      bgColor: "bg-blue-100",
      dateColor: "bg-blue-200",
      url:"/"
    },
    {
      date: "24",
      month: "Apr", 
      year: "2025",
      title: "24 April 2025, What to read in The Hindu",
      bgColor: "bg-cyan-100",
      dateColor: "bg-cyan-200",
      url:"/"
    },
    {
      date: "23",
      month: "Apr",
      year: "2025", 
      title: "23 April 2025, What to read in The Hindu",
      bgColor: "bg-teal-100",
      dateColor: "bg-teal-200",
      url:"/01"
    },
    {
      date: "22",
      month: "Apr",
      year: "2025",
      title: "22 April 2025, What to read in The Hindu", 
      bgColor: "bg-emerald-100",
      dateColor: "bg-emerald-200",
      url:"/02"
    },
    {
      date: "18",
      month: "Apr",
      year: "2025",
      title: "18 April 2025, What to read in The Hindu",
      bgColor: "bg-pink-100", 
      dateColor: "bg-pink-200",
      url:"/03"
    },
    {
      date: "16",
      month: "Apr",
      year: "2025",
      title: "16 April 2025, What to read in The Hindu",
      bgColor: "bg-lime-100",
      dateColor: "bg-lime-200",
      url:"/04"
    },
    {
      date: "15",
      month: "Apr",
      year: "2025",
      title: "15 April 2025, What to read in The Hindu",
      bgColor: "bg-yellow-100",
      dateColor: "bg-yellow-200",
      url:"/05"
    },
    {
      date: "14",
      month: "Apr", 
      year: "2025",
      title: "14 April 2025, What to read in The Hindu",
      bgColor: "bg-orange-100",
      dateColor: "bg-orange-200",
      url:"/06"
    },
    {
      date: "11",
      month: "Apr",
      year: "2025",
      title: "11 April 2025, What to read in The Hindu",
      bgColor: "bg-red-100",
      dateColor: "bg-red-200",
      url:"/07"
    }
  ];

  return (
    <>
    <div className='container max-w-7xl mx-auto -mt-14 md:mt-3 my-4 px-2 md:px-0'>
        <Image src="/img/current-affairs-banner.webp" width={1920} height={500} alt='About Us' className='rounded-xl' />
    </div>
    
    <div className="bg-white p-4 md:p-6 lg:p-8 mb-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card: Card, index: number) => (
            <div 
              key={index}
              className={`${card.bgColor} rounded-lg border border-gray-200 overflow-hidden`}
            >
              <div className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  {/* Date Section */}
                  <div className={`${card.dateColor} rounded-md px-3 py-2 flex-shrink-0 text-center min-w-[60px]`}>
                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {card.month}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-[#00072c] leading-none">
                      {card.date}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {card.year}
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-[#00072c] leading-tight mb-3 line-clamp-2">
                      {card.title}
                    </h3>
                    
                    <Link href='/current-affairs/what-we-ready-in-hindu/01' className="text-red-600 hover:text-red-700 text-xs md:text-sm font-medium uppercase tracking-wide transition-colors duration-200 flex items-center gap-1">
                      VIEW DETAILS
                      <svg 
                        className="w-3 h-3 md:w-4 md:h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default ReadInHindu; 