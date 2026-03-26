'use client';
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  Building2,
  BookOpen,
  FileText
} from 'lucide-react';
import { useTranslation, TFunction } from 'react-i18next';
import Link from "next/link";

interface Course {
  id: string;
  bgColor: string;
  circleColor: string;
  icon: React.ReactNode;
  link?: string; // ✅ make optional
}

interface CourseCardProps {
  course: Course;
  t: TFunction;
}

const courses: Course[] = [
  { id: 'online', bgColor: 'bg-red-100', circleColor: 'bg-red-300', icon: <Monitor className="w-8 h-8 text-red-600" />, link: '/online-live-course' },
  { id: 'distance', bgColor: 'bg-purple-300', circleColor: 'bg-purple-500', icon: <Building2 className="w-8 h-8 text-purple-700" /> , link: '/' },
  { id: 'test', bgColor: 'bg-yellow-200', circleColor: 'bg-yellow-500', icon: <BookOpen className="w-8 h-8 text-yellow-500" /> ,link: '/test-series' },
  { id: 'scholarship', bgColor: 'bg-rose-200', circleColor: 'bg-rose-300', icon: <FileText className="w-8 h-8 text-rose-700" />, link: '/scholarship-programme'},
  { id: 'Quiz', bgColor: 'bg-blue-200', circleColor: 'bg-blue-400', icon: <BookOpen className="w-8 h-8 text-blue-500" /> ,link: '/quiz' }
];

const BestIasCoaching: React.FC = () => {
  const { t } = useTranslation('common');
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slidesToShow, setSlidesToShow] = useState<number>(4);

  // Responsive slides
  useEffect(() => {
    const updateSlidesToShow = (): void => {
      const width = window.innerWidth;
      if (width >= 1024) setSlidesToShow(4);
      else if (width >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const maxSlides = Math.max(0, courses.length - slidesToShow);
  const nextSlide = () => setCurrentSlide(prev => (prev + 1 > maxSlides ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 < 0 ? maxSlides : prev - 1));
  const goToSlide = (index: number) => setCurrentSlide(Math.min(index, maxSlides));

  // Autoplay
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [maxSlides]);

  return (
    <div className="bg-white py-8 md:py-16 md:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-5">
          <h2 className="text-xl md:text-3xl lg:text-3xl font-bold text-[#040c33] text-center lg:text-left px-2 md:px-0">
            {t('coursess.sectionTitle.part1')}{' '}
            <span className="text-[#f43144]">{t('coursess.sectionTitle.highlight')}</span>{' '}
            {t('coursess.sectionTitle.part2')}
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${(currentSlide * 100) / slidesToShow}%)` }}
            >
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <CourseCard course={course} t={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          {courses.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 md:p-3 z-10 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 md:p-3 z-10 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Dots */}
          {courses.length > slidesToShow && (
            <div className="flex justify-center mt-6 md:mt-8 gap-2">
              {Array.from({ length: maxSlides + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-6 h-2 md:w-7 md:h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-[#f43144]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Fixed CourseCard component
const CourseCard: React.FC<CourseCardProps> = ({ course, t }) => {
  const content = (
    <div
      className={`${course.bgColor} rounded-3xl p-5 md:p-8 h-65 md:h-96 relative overflow-hidden group hover:shadow-lg transition-transform hover:-translate-y-2 duration-300`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg shadow-sm">{course.icon}</div>
      </div>

      <h3 className="text-[15px] md:text-2xl font-bold text-[#040c33] mb-2">
        {t(`coursess.${course.id}.title`)}
      </h3>
      <p className="text-sm md:text-base text-blue-950 font-medium mb-2">
        {t(`coursess.${course.id}.subtitle`)}
      </p>

      {/* Show overlay if no link */}
      {!course.link && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-gray-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Coming Soon
        </div>
      )}
    </div>
  );

  return course.link ? (
    <Link href={course.link}>{content}</Link>
  ) : (
    <div className="cursor-default">{content}</div>
  );
};

export default BestIasCoaching;
