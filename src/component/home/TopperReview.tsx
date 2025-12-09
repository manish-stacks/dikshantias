'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoItem {
  id: number;
  key: string; // Use translation key instead of hardcoded title
  youtubeUrl: string;
}

const videos: VideoItem[] = [
  { id: 1, key: 'shruti', youtubeUrl: 'https://www.youtube.com/embed/Kb5r2kHeLOM' },
  { id: 2, key: 'gamini', youtubeUrl: 'https://www.youtube.com/embed/az1ywMBYl3I' },
  { id: 3, key: 'prince', youtubeUrl: 'https://www.youtube.com/embed/jhtHC2h7tOw' },
  { id: 4, key: 'madhav', youtubeUrl: 'https://www.youtube.com/embed/rcZuEQxVDlw' },
  { id: 5, key: 'shruti', youtubeUrl: 'https://www.youtube.com/embed/Kb5r2kHeLOM' },
  { id: 6, key: 'gamini', youtubeUrl: 'https://www.youtube.com/embed/az1ywMBYl3I' },
];

export default function TopperReview() {
  const { t } = useTranslation('common'); // useTranslation hook
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, videos.length - itemsPerView);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 > maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex]);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [itemsPerView]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <div className="py-5 px-1 bg-[#ecf4fc] mb-10 mt-10 md:mt-10">
      <div className="max-w-7xl mx-auto rounded-3xl">
        <h2 className="text-xl md:text-3xl font-bold text-[#040c33] mb-4 md:mb-5 px-3">
          {t('topperReview.heading')} <span className="text-[#f43144]">{t('topperReview.brand')}</span>
          <span className="block text-sm md:text-base lg:text-lg font-normal text-gray-600 mt-1">
            {t('topperReview.subheading')}
          </span>
        </h2>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)` }}
            >
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="flex-shrink-0 px-3 pb-6"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="bg-white border border-white rounded-xl shadow-lg overflow-hidden p-2">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={video.youtubeUrl}
                        title={t(`topperReview.videos.${video.key}`)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                      />
                    </div>
                    <div className="p-3 text-blue-950 text-sm text-center font-bold bg-white">
                      {t(`topperReview.videos.${video.key}`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {videos.length > itemsPerView && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-6 h-2 md:w-7 md:h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex ? 'bg-[#f43144]' : 'bg-[#ff7d8a]'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
