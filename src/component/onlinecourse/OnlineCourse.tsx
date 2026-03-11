"use client";

import React, { useEffect, useState } from "react";
import { Star, Clock, Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Course {
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

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl  transition-shadow duration-300">
      {/* Card Header with Image and Badge */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
        <Image
          src={course?.imageUrl || "/img/Prelims-Foundation-Course.webp"}
          alt={course?.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />

        {/* Badge */}
        {course.category && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {course.category}
          </div>
        )}

        {/* Price */}
        <div className="absolute top-3 right-3 bg-white rounded-lg px-2 sm:px-3 py-1 shadow-md">
          <div className="text-gray-400 text-xs sm:text-sm line-through">
            ₹{course.batchPrice}
          </div>
          <div className="text-red-600 text-sm sm:text-lg font-bold -mt-1">
            ₹{course.batchDiscountPrice}
          </div>
        </div>

        {/* Rating */}
        {/* <div className="absolute bottom-3 left-3 bg-yellow-100 rounded-full px-2 py-1 flex items-center shadow">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current mr-1" />
          <span className="text-xs sm:text-sm font-medium text-gray-800">
            {course.rating ?? 4.9}
          </span>
        </div> */}
      </div>

      {/* Card Content */}
      <div className="p-6 mt-2 md:mt-2">
        <h3 className="text-[18px] font-bold text-[#00072c] mb-2">
          {course.name}
        </h3>

        {/* Duration and Lessons */}
        <div className="flex items-center justify-between mb-4 text-sm text-[#00072c]">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-orange-500" />
            <span>
              Start: {new Date(course.startDate || "").toLocaleDateString()}
            </span>
          </div>

          {/* <div className="flex items-center">
            <Book className="w-4 h-4 mr-1 text-orange-500" />
            <span>Status - {course.c_status}</span>
          </div> */}
        </div>

        {/* Buttons */}
        <div className="space-y-3 text-center">
          <Link href={`/online-live-course/${course.slug}`} className="w-full">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
              View Details
              <svg
                className="w-4 h-4 ml-2"
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
            </button>
          </Link>

          {/* Hidden old View Details link */}
          <span className="hidden">
            <Link
              href={`/online-live-course/${course.slug}`}
              className="w-full text-blue-800 hover:text-blue-950 font-medium py-2 transition-colors duration-200"
            >
              View Details
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

const OnlineCourse: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${apiUrl}/batchs?limit=100`);
        const data = await res.json();

        console.log("data", data);

        // ✅ filter only online courses
        const onlineCourses = data.items.filter(
          (course: Course) => course.category === "online",
        );

        const isActiveCourses = onlineCourses.filter(
          (course: Course) => course.status === "active",
        );

        console.log("onlineCourses", isActiveCourses);
        setCourses(isActiveCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col"
          >
            {/* Image Placeholder */}
            <Skeleton height={160} className="rounded-lg" />

            {/* Badge */}
            <div className="mt-2 w-24">
              <Skeleton height={20} />
            </div>

            {/* Title */}
            <div className="mt-3">
              <Skeleton width={`80%`} height={22} />
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mt-2">
              <Skeleton width={60} height={18} />
              <Skeleton width={80} height={18} />
            </div>

            {/* Rating */}
            <div className="mt-2">
              <Skeleton width={100} height={16} />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-4">
              <Skeleton height={40} borderRadius={8} />
              <Skeleton height={20} width={`60%`} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="container max-w-7xl mx-auto my-4 mt-2 md:mt-3 px-2 md:px-0">
        <Image
          src="/img/online-course/online-course-hero.webp"
          width={1920}
          height={500}
          alt="Online Course Hero"
          className="rounded-xl"
        />
      </div>

      {/* Courses Section */}
      <div className="bg-gray-50 py-8 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 -mt-7 md:mt-1 lg:grid-cols-4 gap-6">
            {courses.slice(0, visibleCount).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* See More Button */}
          {visibleCount < courses.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount(visibleCount + 4)}
                className="group relative px-8 py-3 font-semibold text-white bg-[#e7000b] rounded-lg shadow-lg 
                                 transition-all duration-300 hover:bg-[#b00008] hover:scale-105 flex items-center gap-2"
              >
                See More
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OnlineCourse;
