"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Zap, BadgePercent, ArrowRight, GraduationCap } from "lucide-react";
import axiosInstance from "@/lib/axios";

export interface Course {
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
  isFree?: boolean;
  createdAt?: string;
  updatedAt?: string;
  program?: { id: number; name: string; slug: string };
  subjects?: unknown[];
}

const STATUS_CONFIG = {
  "Start Soon": {
    label: "Starting Soon",
    classes: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  "In Progress": {
    label: "In Progress",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-400 animate-pulse",
  },
  "Partially Complete": {
    label: "Ongoing",
    classes: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-400",
  },
  Completed: {
    label: "Completed",
    classes: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
};

function getDiscount(original?: number, discounted?: number): number | null {
  if (!original || !discounted || original <= discounted) return null;
  return Math.round(((original - discounted) / original) * 100);
}

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, className = "" }) => {
  const router = useRouter();
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);

  const checkPurchaseStatus = useCallback(async (batch: Course) => {
    if (batch.isFree) {
      setIsPurchased(true);
      setCheckingPurchase(false);
      return;
    }
    try {
      const res = await axiosInstance.get("/orders/already-purchased", {
        params: { type: "batch", itemId: batch.id },
      });
      const { purchased = false } = res.data || {};
      setIsPurchased(purchased);
    } catch {
      setIsPurchased(false);
    } finally {
      setCheckingPurchase(false);
    }
  }, []);

  useEffect(() => {
    checkPurchaseStatus(course);
  }, [course, checkPurchaseStatus]);

  const discount = getDiscount(course.batchPrice, course.batchDiscountPrice);
  const status = STATUS_CONFIG[course.c_status] ?? STATUS_CONFIG["Start Soon"];

  const formattedStart = course.startDate
    ? new Date(course.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden flex flex-col
        border border-slate-100
        shadow-[0_2px_12px_rgba(0,0,0,0.06)]
        hover:shadow-[0_8px_32px_rgba(231,0,11,0.12)]
        hover:-translate-y-1 hover:border-red-100
        transition-all duration-300 ease-out
        ${className}`}
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={course.imageUrl || "/img/Prelims-Foundation-Course.webp"}
          alt={course.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Dark scrim at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-3 left-3 flex items-center gap-1
            bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full
            shadow-md shadow-red-900/30">
            <BadgePercent size={11} />
            {discount}% OFF
          </div>
        )}

        {/* EMI badge */}
        {course.isEmi && (
          <div className="absolute top-3 right-3
            bg-white/95 text-[#00072c] text-[10px] font-bold px-2 py-1 rounded-lg
            shadow-md border border-slate-100 backdrop-blur-sm">
            EMI Available
          </div>
        )}

        {/* Price floated over bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-2">
          <span className="text-white text-xl font-extrabold tracking-tight drop-shadow">
            ₹{course.batchDiscountPrice?.toLocaleString("en-IN")}
          </span>
          {course.batchPrice && course.batchPrice !== course.batchDiscountPrice && (
            <span className="text-white/60 text-xs line-through">
              ₹{course.batchPrice?.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Status pill */}
        <div className="flex items-center gap-1.5 w-fit">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${status.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-[#00072c] leading-snug line-clamp-2 flex-1">
          {course.name}
        </h3>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
          {formattedStart && (
            <span className="flex items-center gap-1">
              <Clock size={11} className="text-red-400" />
              {formattedStart}
            </span>
          )}
          {course.program?.name && (
            <span className="flex items-center gap-1 truncate">
              <GraduationCap size={11} className="text-red-400 flex-shrink-0" />
              <span className="truncate">{course.program.name}</span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* CTA */}
        {checkingPurchase ? (
          <div className="h-11 rounded-xl bg-slate-100 animate-pulse" />
        ) : isPurchased ? (
          <button
            onClick={() =>
              router.push(`/my-course?courseId=${course.id}&unlocked=true`)
            }
            className="w-full flex items-center justify-center gap-2
              bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]
              text-white text-sm font-bold py-3 rounded-xl
              transition-all duration-200 shadow-sm shadow-emerald-200"
          >
            <GraduationCap size={15} />
            Go to Classroom
          </button>
        ) : (
          <Link href={`/online-live-course/${course.slug}`} className="block">
            <button
              className="w-full flex items-center justify-center gap-2
              bg-[#e7000b] hover:bg-[#b00008] active:scale-[0.98]
              text-white text-sm font-bold py-3 rounded-xl
              transition-all duration-200 shadow-sm shadow-red-200
              group/btn"
            >
              View Details
              <ArrowRight
                size={15}
                className="group-hover/btn:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          </Link>
        )}
      </div>

      {/* Hover left-border accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-red-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom rounded-full" />
    </div>
  );
};

export default CourseCard;