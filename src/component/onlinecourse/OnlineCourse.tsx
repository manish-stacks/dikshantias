"use client";

import React, { useEffect, useState } from "react";
import { Star, Clock, Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Course {
  _id: string;
  title: string;
  shortContent: string;
  duration: string;
  lectures: number;
  originalPrice: number;
  price: number;
  courseMode: string;
  badge?: string;
  badgeColor?: string;
  image: {
    url: string;
    alt: string;
  };
  rating?: number;
  url?: string;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl  transition-shadow duration-300">
      {/* Card Header with Image and Badge */}
      <div className="relative h-38 md:h-32 bg-gradient-to-br from-gray-700 to-gray-900">
        <div className="absolute">
          <Image
            src={course.image?.url || "/img/Prelims-Foundation-Course.webp"}
            width={900}
            height={300}
            alt={course.image?.alt || course.title}
            className="object-cover h-full w-full"
          />

          {/* <div className="relative w-[600px] h-[200px] overflow-hidden">
                        <Image
                            src={course.image?.url || "/img/Prelims-Foundation-Course.webp"}
                            alt={course.image?.alt || course.title}
                            fill
                            className="object-cover"
                        />
                        </div> */}
        </div>

        {/* Badge */}
        {course.badge && (
          <div
            className={`absolute top-4 left-4 ${course.badgeColor} text-white px-3 py-1 rounded-full text-sm font-medium`}
          >
            {course.badge}
          </div>
        )}

        {/* Price */}
        <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1">
          <div className="text-gray-400 text-sm line-through">
            ₹{course.originalPrice}
          </div>
          <div className="text-red-600 text-lg font-bold -mt-1.5">
            ₹{course.price}
          </div>
        </div>

        {/* Rating (static for now) */}
        <div className="absolute top-36 left-4 bg-yellow-100 rounded-full px-2 py-1 flex items-center">
          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
          <span className="text-sm font-medium text-gray-800">
            {course.rating ?? 4.9}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 mt-6 md:mt-12">
        <h3 className="text-[18px] font-bold text-[#00072c] mb-2">
          {course.title}
        </h3>

        {/* Duration and Lessons */}
        <div className="flex items-center justify-between mb-4 text-sm text-[#00072c]">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-orange-500" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Book className="w-4 h-4 mr-1 text-orange-500" />
            <span>No of hours - {course.lectures}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 text-center">
          <Link href={`/online-course/${course.slug}`} className="w-full">
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
              href={`/online-course/${course.slug}`}
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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/admin/courses");
        const data = await res.json();

        // ✅ filter only online courses
        const onlineCourses = data.filter(
          (course: Course) => course.courseMode === "online",
        );
        setCourses(onlineCourses);
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
      <div className="container max-w-7xl mx-auto my-4 mt-6 md:mt-3 px-2 md:px-0">
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
              <CourseCard key={course._id} course={course} />
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
