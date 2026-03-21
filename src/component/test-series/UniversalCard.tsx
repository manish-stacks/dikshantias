"use client";

import { Clock, CheckCircle, Lock, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function UniversalCard({
  type, // "bundle" | "test" | "quiz"
  data,
  isPurchased,
  onClick,
}) {
  const isBundle = type === "bundle";
  const isQuiz = type === "quiz";

  const price = data.discountPrice || data.price;
  const originalPrice = data.price;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-all cursor-pointer overflow-hidden hover:shadow-md"
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/9] bg-gray-50">
        <Image
          src={data.imageUrl || data.image || "/placeholder.png"}
          alt={data.title}
          fill
          className="object-cover"
        />

        {/* TOP BADGES */}
        <div className="absolute top-2 left-2 right-2 flex justify-between">
          <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded">
            {isBundle ? "Bundle" : isQuiz ? "Quiz" : "Test"}
          </span>

          {isPurchased && (
            <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle size={10} /> Enrolled
            </span>
          )}

          {isQuiz && !data.isFree && (
            <span className="bg-amber-600 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
              <Lock size={10} /> Premium
            </span>
          )}
        </div>

        {/* DURATION */}
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
          <Clock size={10} />
          {data.timeDurationForTest ||
            data.durationMinutes ||
            data.duration ||
            "?"}{" "}
          min
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {data.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {data.description}
        </p>

        {/* EXTRA INFO */}
        {isBundle && (
          <p className="text-xs text-blue-600 mt-2 font-medium">
            {data.testSeries?.length || 0} Series Included
          </p>
        )}

        {isQuiz && (
          <p className="text-xs text-gray-500 mt-2">
            {data.totalQuestions} Questions
          </p>
        )}

        {/* PRICE + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            {originalPrice > price && (
              <span className="text-[11px] text-gray-400 line-through block">
                ₹{originalPrice}
              </span>
            )}
            <p className="text-base font-bold text-gray-900">
              {data.isFree ? "Free" : `₹${price}`}
            </p>
          </div>

          <button className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1">
            {isPurchased
              ? "Continue"
              : isQuiz
              ? "Start"
              : isBundle
              ? "View"
              : "Enroll"}
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}