"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import HinduDetails from "@/app/current-affairs/HinduDetails";
import { ArrowLeft } from "lucide-react";

interface CurrentAffairItem {
  _id: string;
  title: { en: string; hi: string };
  slug: string;
  shortContent?: {
    en: string;
    hi: string;
  };
  content?: { en: string; hi: string };
  image?: { url: string };
  metaKeywords?: string[];
  imageAlt?: string;
  tags?: string[];
  rating?: number;
  prelims?: string[];
  mains?: string[];
}

export default function DetailsClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage || i18n.language) as "en" | "hi";

  const [item, setItem] = useState<CurrentAffairItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAffair() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/current-affairs/${slug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch current affair");
        }
        const data = await res.json();
        setItem(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching affair:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchAffair();
    }
  }, [slug]);

  // Loading State
if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* TITLE */}
        <div className="h-7 w-2/3 bg-slate-200 rounded mb-6"></div>

        {/* 2 COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-3 space-y-6">
            {/* TAGS */}
            <div className="bg-white border rounded-xl p-4 flex gap-2 flex-wrap">
              <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
              <div className="h-6 w-24 bg-slate-200 rounded-md"></div>
              <div className="h-6 w-16 bg-slate-200 rounded-md"></div>
              <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
            </div>

            {/* SHORT CONTENT */}
            <div className="bg-white border rounded-xl p-5 space-y-2">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-11/12"></div>
              <div className="h-4 bg-slate-200 rounded w-10/12"></div>
              <div className="h-4 bg-slate-200 rounded w-9/12"></div>
            </div>

            {/* IMAGE */}
            <div className="h-[220px] md:h-[280px] lg:h-[340px] bg-slate-200 rounded-2xl"></div>

            {/* ARTICLE CONTENT */}
            <div className="bg-white border rounded-2xl p-6 space-y-3">
              <div className="h-5 w-40 bg-slate-200 rounded"></div>

              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-11/12"></div>
              <div className="h-4 bg-slate-200 rounded w-10/12"></div>

              <div className="h-5 w-52 bg-slate-200 rounded mt-4"></div>

              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-9/12"></div>
              <div className="h-4 bg-slate-200 rounded w-7/12"></div>

              <div className="h-5 w-44 bg-slate-200 rounded mt-4"></div>

              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded w-8/12"></div>
              <div className="h-4 bg-slate-200 rounded w-6/12"></div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-4">
            {/* APP CARD */}
            <div className="bg-white border rounded-2xl p-4 space-y-3">
              <div className="h-40 bg-slate-200 rounded-xl"></div>

              <div className="h-4 w-32 bg-slate-200 rounded"></div>

              <div className="h-3 bg-slate-200 rounded"></div>

              <div className="h-8 bg-slate-200 rounded-xl"></div>
            </div>

            {/* FACTS */}
            <div className="bg-white border rounded-2xl p-4 space-y-3">
              <div className="h-4 w-40 bg-slate-200 rounded"></div>

              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 rounded w-4/6"></div>
            </div>

            {/* DAILY */}
            <div className="bg-white border rounded-2xl p-4 space-y-3">
              <div className="h-4 w-40 bg-slate-200 rounded"></div>

              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  // Error State
  if (error || !item) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-x-hidden">
        <div className="text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {error ? "Error Loading Content" : "No Content Found"}
            </h2>
            <p className="text-slate-600 mb-4">
              {error
                ? error
                : "The requested current affair could not be found."}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="overflow-x-hidden">
      {/* Main Component */}
      <HinduDetails
        slug={item.slug}
        title={item.title?.[lang]}
        shortContent={item.shortContent?.[lang]}
        content={item.content?.[lang]}
        imageUrl={item.image?.url}
        tags={item.metaKeywords || []}
        prelims={item.prelims || []}
        mains={item.mains || []}
        faq={item.faq || []}
        onClose={() => router.back()}
      />
    </div>
  );
}
