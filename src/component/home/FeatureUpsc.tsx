'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";

interface Program {
  _id: string;
  slug: string;
  badge?: string;
  badgeColor?: string;
  title: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  rating?: number;
  duration: string; // from API
  students?: string; // optional
  lectures?: number; // fallback if students not present
  features: string[];
  moreFeatures?: number;
  image: string;
  backcolor?: string;
}

const FeatureUpsc: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slidesToShow, setSlidesToShow] = useState<number>(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch courses from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch('/api/admin/courses');
        const data = await res.json();
        const formatted = data.map((course) => ({
          _id: course._id,
          slug: course.slug,
          badge: course.badge || '',
          badgeColor: course.badgeColor || 'bg-gray-500',
          title: course.title,
          description: course.shortContent || '',
          originalPrice: course.originalPrice,
          currentPrice: course.price,
          duration: course.duration ? `${course.duration} Hours` : 'N/A',
           students: course.students || `No of hours - ${course.lectures || 0}`,
          features: course.features || [],
          moreFeatures: course.features?.length > 2 ? course.features.length - 2 : 0,
          image: course.image?.url || '/img/default-course.webp',
          backcolor: 'purple-200',
        }));
        setPrograms(formatted);
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      }
    };
    fetchPrograms();
  }, []);

  // Update slidesToShow based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setSlidesToShow(4);
      else if (width >= 768) setSlidesToShow(2);
      else setSlidesToShow(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxSlides = Math.max(0, programs.length - slidesToShow);

  useEffect(() => {
    if (currentSlide > maxSlides) setCurrentSlide(maxSlides);
  }, [slidesToShow, programs.length, currentSlide, maxSlides]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  }, [maxSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  const goToSlide = (index: number) => setCurrentSlide(Math.min(index, maxSlides));

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 3000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="bg-white md:px-4 px-2 mb-6 md:mb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-3xl font-bold text-[#040c33] mb-3 md:mb-5 text-start">
            Featured UPSC <span className="text-[#f43144]">Coaching Programs</span>
          </h2>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <div ref={sliderRef} className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${(currentSlide * 100) / slidesToShow}%)`,
              }}
            >
              {programs.map((program) => (
                <div
                  key={program._id}
                  className="flex-shrink-0 md:px-3 px-0"
                  style={{ width: `${100 / slidesToShow}%` }}
                >
                  <ProgramCard program={program} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {programs.length > slidesToShow && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 md:p-3 z-10 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 md:p-3 z-10 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {programs.length > slidesToShow && (
            <div className="flex justify-center mt-6 md:mt-8 gap-2">
              {Array.from({ length: maxSlides + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-7 h-2 md:w-7 md:h-3 rounded-full ${
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

// Program Card Component
interface ProgramCardProps {
  program: Program;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow bg-white h-full relative">
      {/* Badge */}
      {program.badge && (
        <div className={`absolute top-4 left-4 ${program.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium z-10`}>
          {program.badge}
        </div>
      )}

      {/* Price */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow p-2 z-10 text-sm">
        <div className="text-blue-400 line-through text-xs">₹{program.originalPrice.toLocaleString()}</div>
        <div className="text-[#f43144] font-bold">₹{program.currentPrice.toLocaleString()}</div>
      </div>

      {/* Image */}
      <div className="h-48 relative">
        <Image src={program.image} alt={program.title} layout="fill" objectFit="cover" className="rounded-t-2xl" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-auto">
        <h3 className="text-lg font-bold text-[#040c33]">{program.title}</h3>
        <p className="text-blue-950 text-sm mt-1 mb-3 line-clamp-2">{program.description}</p>

        <div className="flex justify-between text-[#ee6b36] text-sm mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {program.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {program.students}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {program.features.slice(0, 2).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-blue-950">
              <CheckCircle className="w-4 h-4 text-green-500" />
              {feature}
            </div>
          ))}
          {program.features.length > 2 && (
            <div className="text-[#f43144] text-sm font-medium">
              +{program.features.length - 2 + (program.moreFeatures || 0)} more features
            </div>
          )}
        </div>

        {/* Buttons */}
        {/* <div className="mt-auto flex gap-2.5 items-center">
          <Link href={`/online-course/${program.slug}`}>
          <button className="bg-blue-950 hover:bg-[#d12a3a] w-full text-white py-2 px-5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
            View Details
          </button>
        </Link>
          <button className="bg-[#f43144] hover:bg-blue-950 text-white py-2 px-5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
            Enroll Now
          </button>
        </div>   */}
        <div className="mt-auto flex justify-center w-full">
          <Link href={`/online-course/${program.slug}`} className="w-full">
            <button className="bg-blue-950 hover:bg-[#d12a3a] w-full text-white py-2 px-5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureUpsc;
