"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Star, Clock, Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "@/lib/axios";

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
  emiSchedule?: { amount: number; dueDate: string }[];
  category?: string;
  c_status: "Start Soon" | "In Progress" | "Partially Complete" | "Completed";
  createdAt?: string;
  updatedAt?: string;
  isFree?: boolean; // added (optional)
}

interface CourseWithPurchase extends Course {
  isPurchased: boolean;
}

const CourseCard: React.FC<{ course: CourseWithPurchase }> = ({ course }) => {
  const router = useRouter();

  const handleAction = () => {
    if (course.isPurchased) {
      router.push(`/my-course?courseId=${course.id}&unlocked=true`);
    } else {
      router.push(`/online-live-course/${course.slug}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Card Header with Image and Badge */}
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
        <Image
          src={course?.imageUrl || "/img/Prelims-Foundation-Course.webp"}
          alt={course?.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />

        {course.category && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {course.category}
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white rounded-lg px-2 sm:px-3 py-1 shadow-md">
          <div className="text-gray-400 text-xs sm:text-sm line-through">
            ₹{course.batchPrice ?? "-"}
          </div>
          <div className="text-red-600 text-sm sm:text-lg font-bold -mt-1">
            ₹{course.batchDiscountPrice ?? course.batchPrice ?? "-"}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 ">
        <h3 className="text-[20px] font-bold text-[#00072c] mb-2 line-clamp-3">
          {course.name}
        </h3>

        <div className="flex items-center justify-between mb-4 text-sm text-[#00072c]">
          {course?.shortDescription}
          {/* <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-orange-500" />
            <span>
              Start: {course.startDate ? new Date(course.startDate).toLocaleDateString() : "TBA"}
            </span>
          </div> */}
        </div>

        <button
          onClick={handleAction}
          className={`w-full font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
            course.isPurchased
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {course.isPurchased ? "Go to Classroom" : "View Details"}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const OnlineCourse: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const checkPurchaseStatus = useCallback(async (batch: Course) => {
    if (batch.isFree) return true;

    try {
      const res = await axiosInstance.get("/orders/already-purchased", {
        params: { type: "batch", itemId: batch.id },
      });
      return res.data?.purchased === true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const fetchCoursesAndStatus = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${apiUrl}/batchs?limit=100`);
        const data = res.data;

        // Filter only online + active courses
        const onlineCourses: Course[] = (data.items || []).filter(
          (course: Course) => course.category === "online" && course.status === "active"
        );

        // Check purchase status for each course
        const coursesWithStatus = await Promise.all(
          onlineCourses.map(async (course) => {
            const isPurchased = await checkPurchaseStatus(course);
            return { ...course, isPurchased };
          })
        );

        setCourses(coursesWithStatus);
      } catch (error) {
        console.error("Error fetching courses or purchase status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndStatus();
  }, [checkPurchaseStatus]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <Skeleton height={160} className="rounded-lg" />
            <div className="mt-2 w-24">
              <Skeleton height={20} />
            </div>
            <div className="mt-3">
              <Skeleton width="80%" height={22} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Skeleton width={60} height={18} />
              <Skeleton width={80} height={18} />
            </div>
            <div className="mt-4">
              <Skeleton height={48} borderRadius={8} />
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
          priority
        />
      </div>

      <div className="bg-gray-50 py-8 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-7 md:mt-1">
            {courses.slice(0, visibleCount).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {visibleCount < courses.length && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 4)}
                className="group relative px-8 py-3 font-semibold text-white bg-[#e7000b] rounded-lg shadow-lg transition-all duration-300 hover:bg-[#b00008] hover:scale-105 flex items-center gap-2"
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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