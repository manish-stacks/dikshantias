"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function decodeHtml(html?: string): string {
  if (!html) return "";
  return html
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\\u0026/g, "&")
    .replace(/&ndash;/g, "–")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ");
}

interface HinduDetailsProps {
  slug?: string;
  title?: string;
  shortContent?: string;
  content?: string;
  imageUrl?: string;
  tags?: string[];
  prelims?: string[];
  mains?: string[];
  faq?: {
    question: {
      en: string;
      hi: string;
    };
    answer: {
      en: string;
      hi: string;
    };
  }[];
  onClose?: () => void;
}

const HinduDetailsComplete: React.FC<HinduDetailsProps> = ({
  slug,
  title,
  shortContent,
  content,
  imageUrl,
  tags = [],
  faq = [],
  onClose,
}) => {
  const decodedContent = decodeHtml(content);
  /* language from header */
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith("hi") ? "hi" : "en";
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const [factsOfTheDay, setFacts] = useState<any[]>([]);
  const [dailyCurrentAffairs, setDaily] = useState<any[]>([]);
  const [editorialAnalysis, setEditorial] = useState<any[]>([]);

  const [sliderData, setSliderData] = useState<any[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;

    async function loadSlider() {
      try {
        const res = await fetch(
          `/api/admin/current-affairs/related?slug=${slug}`,
        );

        const data = await res.json();

        setSliderData(data);
      } catch (err) {
        console.log("related error", err);
      }
    }

    loadSlider();
  }, [slug]);

  const sliderColors = [
    "bg-blue-50 border-blue-200",
    "bg-emerald-50 border-emerald-200",
    "bg-amber-50 border-amber-200",
    "bg-rose-50 border-rose-200",
    "bg-indigo-50 border-indigo-200",
    "bg-purple-50 border-purple-200",
    "bg-cyan-50 border-cyan-200",
    "bg-teal-50 border-teal-200",
  ];

  const visibleCards = 3;

useEffect(() => {
  async function loadSidebar() {
    try {
      const res = await fetch("/api/admin/current-affairs/sidebar", {
        cache: "force-cache",
      });

      const data = await res.json();

      setFacts(data.facts || []);
      setDaily(data.daily || []);
      setEditorial(data.editorial || []);
    } catch (err) {
      console.error("Sidebar error", err);
    }
  }

  loadSidebar();
}, []);

  const titleColors = [
    "text-blue-700",
    "text-emerald-700",
    "text-rose-700",
    "text-indigo-700",
    "text-amber-700",
    "text-purple-700",
  ];

  // generate color index from title
  const colorIndex =
    title?.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    titleColors.length;

  const titleColor = titleColors[colorIndex];

  const tagColors = [
    "bg-blue-50 text-blue-700 border-blue-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-rose-50 text-rose-700 border-rose-200",
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-purple-50 text-purple-700 border-purple-200",
    "bg-cyan-50 text-cyan-700 border-cyan-200",
    "bg-teal-50 text-teal-700 border-teal-200",
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Header with Close Button */}
        <div className="flex justify-between items-start mb-8 md:mb-10">
          <div className="flex-1 pr-4 md:pr-8">
            <h3
              className={`
              ${titleColor}
              text-xl sm:text-2xl md:text-3xl lg:text-2xl
              font-bold
              leading-snug
              tracking-tight
            `}
            >
              {title}
            </h3>

            <div
              className={`
                    mt-2
                    h-[3px]
                    w-16 md:w-24
                    rounded-full
                    bg-current
                    opacity-70
                  `}
            />
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 md:p-3 hover:bg-slate-100 rounded-xl transition shadow-sm"
              aria-label="Close"
            >
              <X className="w-5 h-5 md:w-6 md:h-6 text-slate-500" />
            </button>
          )}
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side (4/5 width) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tags Section */}
            {tags.length > 0 && (
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => {
                    const colorClass = tagColors[index % tagColors.length];
                    return (
                      <span
                        key={index}
                        className={`
                          ${colorClass}
                          text-[11px] md:text-xs
                          font-semibold
                          px-3 py-1
                          rounded-md
                          border
                          transition
                          hover:shadow-sm
                          tracking-wide
                        `}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Prelims & Mains Box */}
            {shortContent && (
              <div
                className="
                      bg-rose-50 
                      border border-rose-200 
                      border-l-4 border-rose-500 
                      p-4 md:p-5 
                      rounded-xl 
                      shadow-sm"
              >
                <div
                  className="
                        text-slate-700
                        text-base
                        leading-relaxed
                        text-justify
                        [&>p]:mb-4
                        [&>p]:leading-7
                        [&>p]:text-justify"
                  dangerouslySetInnerHTML={{
                    __html: `<p>${shortContent}</p>`,
                  }}
                />
              </div>
            )}

            {/* Featured Image */}
            {imageUrl && (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <img
                  src={imageUrl}
                  alt={title}
                  className="
                      w-full
                      h-auto
                      object-cover
                    "/>
              </div>
            )}

            {/* Article Content */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div
                className="
                  text-slate-700 leading-relaxed space-y-5 text-base

                  [&>h1]:text-3xl [&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:font-bold [&>h1]:text-slate-900
                  [&>h2]:text-2xl [&>h2]:mt-6 [&>h2]:mb-4 [&>h2]:font-bold [&>h2]:text-slate-900
                  [&>h3]:text-xl [&>h3]:mt-5 [&>h3]:mb-3 [&>h3]:font-bold [&>h3]:text-slate-900

                  [&>p]:mb-4 [&>p]:leading-7

                  [&>ul]:list-disc
                  [&>ul]:pl-6
                  [&>ul]:mb-5
                  [&>ul>li]:mb-3 [&>ul>li]:text-slate-700

                  [&>ol]:list-decimal
                  [&>ol]:pl-6
                  [&>ol]:mb-5
                  [&>ol>li]:mb-3

                  [&>blockquote]:border-l-4
                  [&>blockquote]:border-blue-400
                  [&>blockquote]:pl-5
                  [&>blockquote]:italic
                  [&>blockquote]:text-slate-600
                  [&>blockquote]:my-6
                  [&>blockquote]:bg-blue-50
                  [&>blockquote]:py-4
                  [&>blockquote]:px-4
                  [&>blockquote]:rounded-lg

                  [&>img]:rounded-xl
                  [&>img]:my-6
                  [&>img]:shadow-lg
                "
                dangerouslySetInnerHTML={{ __html: decodedContent }}
              />
            </div>

            {/*  Frequently Asked Questions (FAQs) */}
            {/* FAQ */}

            {faq?.length > 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
                  Frequently Asked Questions (FAQs)
                </h2>

                <div className="space-y-3">
                  {faq.map((item, index) => {
                    const colors = [
                      "bg-blue-50 border-blue-200",
                      "bg-emerald-50 border-emerald-200",
                      "bg-amber-50 border-amber-200",
                      "bg-rose-50 border-rose-200",
                      "bg-indigo-50 border-indigo-200",
                      "bg-purple-50 border-purple-200",
                    ];

                    const colorClass = colors[index % colors.length];

                    return (
                      <div
                        key={index}
                        className={`${colorClass} rounded-xl border overflow-hidden`}
                      >
                        <button
                          onClick={() =>
                            setOpenFAQ(openFAQ === index ? null : index)
                          }
                          className="w-full flex justify-between items-center text-left p-4 md:p-5"
                        >
                          <span className="font-semibold text-slate-800">
                            {item.question?.[lang]}
                          </span>

                          <span className="text-lg font-bold text-slate-500">
                            {openFAQ === index ? "−" : "+"}
                          </span>
                        </button>

                        {openFAQ === index && (
                          <div className="px-4 md:px-5 pb-4 md:pb-5">
                            <p className="text-slate-600 text-sm leading-relaxed">
                              {item.answer?.[lang]}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Related Articles Slider */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              {/* header */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                  Explore More
                </h2>

                <div className="flex gap-2">
                  {/* left */}
                  <button
                    onClick={() => setSlideIndex(Math.max(slideIndex - 1, 0))}
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 shadow-sm"
                  >
                    ←
                  </button>

                  {/* right */}
                  <button
                    onClick={() =>
                      setSlideIndex(
                        Math.min(
                          slideIndex + 1,
                          sliderData.length - visibleCards,
                        ),
                      )
                    }
                    className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 shadow-sm"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* cards */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-all duration-300"
                  style={{
                    transform: `translateX(-${slideIndex * (100 / visibleCards)}%)`,
                  }}
                >
                  {sliderData.map((item: any, index: number) => {
                    const colorClass =
                      sliderColors[index % sliderColors.length];

                    return (
                      <Link
                        key={index}
                        href={`/current-affairs/view/${item.slug}`}
                        className="w-full md:w-1/3 p-2 flex-shrink-0 group"
                      >
                        <div
                          className={`
                              h-full
                              ${colorClass}
                              rounded-xl
                              p-4
                              border
                              shadow-sm
                              hover:shadow-lg
                              transition
                              relative
                              overflow-hidden
                            `}
                        >
                          {/* gradient top border */}
                          <div
                            className="
                            absolute top-0 left-0 w-full h-[3px]
                            bg-gradient-to-r
                            from-rose-500 via-pink-500 to-orange-400
                            "
                          />

                          {/* dynamic category badge */}
                          <div
                            className="
                                inline-block
                                text-[11px]
                                font-semibold
                                bg-rose-50
                                text-rose-700
                                px-3 py-1
                                rounded
                                border border-rose-200
                                mb-3
                                "
                          >
                            {item.subCategory || item.category}
                          </div>

                          {/* title */}
                          <h3
                            className="
                              text-sm
                              font-semibold
                              text-slate-800
                              leading-snug
                              line-clamp-3
                              group-hover:text-indigo-700
                              transition
                            "
                          >
                            {item.title?.[lang]}
                          </h3>

                          {/* read more */}
                          <div
                            className="
                                mt-4
                                text-xs
                                font-semibold
                                text-rose-600
                                group-hover:underline
                                underline-offset-4
                                decoration-rose-300
                                transition
                                "
                          >
                            Read article →
                          </div>

                          {/* hover glow */}
                          <div
                            className="
                                absolute inset-0
                                bg-white
                                opacity-0
                                group-hover:opacity-5
                                transition
                              "
                          />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side (1/5 width) */}
          <div className="lg:col-span-1 space-y-4 sticky top-6 h-fit">
            {/* Advertisement Banner */}

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group bg-white">
              {/* image full visible */}
              <a
                href="https://dikshantias.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="/img/appads.png"
                  alt="Dikshant IAS App Download"
                  className="w-full object-contain bg-slate-50 p-2"
                />
              </a>

              {/* content area */}
              <div className="p-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  Dikshant IAS Learning App
                </h3>

                <p className="text-xs text-slate-500 mb-3">
                  Online Live Classes • Video Courses • Test Series
                </p>

                {/* buttons */}
                <a
                  href="https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#E7000B] text-white text-xs font-semibold py-2.5 rounded-xl shadow-md hover:bg-red-700 hover:shadow-lg transition"
                >
                  Get it on Android
                </a>
              </div>
            </div>
            {/* Trending News Section */}

            <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
              {/* Header */}
              <div className="bg-blue-700 px-5 py-4 text-white font-semibold text-sm flex items-center gap-2 rounded-t-2xl">
                Important Facts of the Day
              </div>

              {/* Items */}
              <div className="p-4 space-y-3">
                {factsOfTheDay?.map((fact: any) => (
                  <Link
                    key={fact.slug}
                    href={`/current-affairs/view/${fact.slug}`}
                    className="block w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-all border-l-4 border-blue-300 group"
                  >
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {fact.title?.[lang]}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-emerald-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
              {/* Header */}
              <div className="bg-emerald-700 px-5 py-4 text-white font-semibold text-sm flex items-center gap-2 rounded-t-2xl">
                Daily Current Affairs
              </div>

              {/* Items */}
              <div className="p-4 space-y-3">
                {dailyCurrentAffairs?.map((item: any) => (
                  <Link
                    key={item.slug}
                    href={`/current-affairs/view/${item.slug}`}
                    className="block w-full text-left p-3 rounded-lg hover:bg-emerald-50 transition-all border-l-4 border-emerald-300 group"
                  >
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {item.title?.[lang]}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-white border-2 border-red-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="bg-[#E7000B] px-5 py-4 text-white font-semibold text-sm rounded-t-2xl">
                Editorial Analysis
              </div>

              <div className="p-4 space-y-3">
                {editorialAnalysis?.map((news: any) => (
                  <Link
                    key={news.slug}
                    href={`/current-affairs/view/${news.slug}`}
                    className="block w-full text-left p-3 rounded-lg hover:bg-red-50 transition-all border-l-4 border-red-300 group"
                  >
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-red-700 transition-colors line-clamp-2">
                      {news.title?.[lang]}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar Sections */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HinduDetailsComplete;
