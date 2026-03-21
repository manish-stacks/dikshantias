"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Program {
  id: number;
  name: string;
  slug: string;

  imageUrl?: string;

  displayOrder?: number;
  programId?: number;
  subjectId?: number[];

  startDate?: string;
  endDate?: string;

  registrationStartDate?: string;
  registrationEndDate?: string;

  status: "active" | "inactive";

  shortDescription?: string;
  longDescription?: string;

  batchPrice?: number;
  batchDiscountPrice?: number;
  gst?: number;
  offerValidityDays?: number;

  quizIds?: number[];
  testSeriesIds?: number[];

  isEmi: boolean;
  emiTotal?: number;

  emiSchedule?: {
    amount: number;
    dueDate: string;
  }[];

  category?: string;

  c_status: "Start Soon" | "In Progress" | "Partially Complete" | "Completed";

  createdAt?: string;
  updatedAt?: string;
}

const FeatureUpsc: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slidesToShow, setSlidesToShow] = useState<number>(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch courses from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${apiUrl}/batchs?limit=100`);
        const data = await res.json();
        // const formatted = data.map((course) => ({
        //   id: course._id,
        //   slug: course.slug,
        //   badge: course.badge || "",
        //   badgeColor: course.badgeColor || "bg-gray-500",
        //   title: course.title,
        //   description: course.shortContent || "",
        //   originalPrice: course.originalPrice,
        //   currentPrice: course.price,
        //   duration: course.duration ? `${course.duration}` : "N/A",
        //   students: course.students || `No. of hours - ${course.lectures || 0}`,
        //   features: course.features || [],
        //   moreFeatures:
        //     course.features?.length > 2 ? course.features.length - 2 : 0,
        //   image: course.image?.url || "/img/default-course.webp",
        //   backcolor: "purple-200",
        // }));
        setPrograms(data?.items || []);
      } catch (err) {
        console.error("Failed to fetch programs:", err);
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  const goToSlide = (index: number) =>
    setCurrentSlide(Math.min(index, maxSlides));

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
            Featured UPSC{" "}
            <span className="text-[#f43144]">Coaching Programs</span>
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
                  key={program.id}
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
                  className={`w-7 h-2 md:w-7 md:h-3 rounded-full ${currentSlide === index ? "bg-[#f43144]" : "bg-gray-300"
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
    <div className="rounded overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow bg-white h-full relative">
      {/* Badge */}
      {program.category && (
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
          {program.category}
        </div>
      )}

      {/* Price */}
      <div className="absolute top-3 right-3 bg-white rounded-lg px-2 sm:px-3 py-1 shadow-md">
        <div className="text-gray-400 text-xs sm:text-sm line-through">
          ₹{program.batchPrice}
        </div>
        <div className="text-red-600 text-sm sm:text-lg font-bold -mt-1">
          ₹{program.batchDiscountPrice}
        </div>
      </div>

      {/* Image */}
      {/* <div className="h-48 relative">
        <Image
          src={program.image}
          alt={program.title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
        />
      </div> */}

      <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
        <Image
          src={program.imageUrl || "/img/Prelims-Foundation-Course.webp"}
          alt={program.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-auto">
        <h3 className="text-lg font-bold text-[#040c33]">{program.name}</h3>
        {/* <p className="text-blue-950 text-sm mt-1 mb-3 line-clamp-2">
          {program.description}
        </p> */}

        <div className="flex items-center justify-between mb-4 text-sm text-[#00072c]">
          {/* <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-orange-500" />
            <span>
              Start: {new Date(program.startDate || "").toLocaleDateString()}
            </span>
          </div> */}
          {program?.shortDescription}
          {/* <div className="flex items-center">
                    <Book className="w-4 h-4 mr-1 text-orange-500" />
                    <span>Status - {program.c_status}</span>
                  </div> */}
        </div>

        {/* Features */}
        {/* <div className="space-y-2 mb-4">
          {program.features.slice(0, 2).map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-blue-950"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
              {feature}
            </div>
          ))}
          {program.features.length > 2 && (
            <div className="text-[#f43144] text-sm font-medium">
              +{program.features.length - 2 + (program.moreFeatures || 0)} more
              features
            </div>
          )}
        </div> */}
        <div className="mt-auto flex justify-center w-full">
          <Link href={`/online-live-course/${program.slug}`} className="w-full">
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
