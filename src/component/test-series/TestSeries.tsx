"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
    BookOpen,
    FileText,
    Clock,
    PlayCircle,
    CheckCircle,
    Inbox,
    ArrowRight,
} from "lucide-react";

const TABS = [
    { key: "all", label: "All" },
    { key: "prelims", label: "Prelims" },
    { key: "mains", label: "Mains" },
    { key: "combo", label: "Combo" },
    { key: "mine", label: "My Tests" },
];

const TYPE_COLOR: any = {
    prelims: {
        bg: "bg-sky-50",
        text: "text-sky-700",
        border: "border-sky-200",
    },
    mains: {
        bg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200",
    },
    combo: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
    },
};

interface SeriesItem {
    id: string;
    slug: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    type: string;
    price: number;
    discount_price?: number;
    total_tests?: number;
    total_live?: number;
    validity_days?: number;
    is_purchased?: boolean;
}

const getSeriesType = (series: SeriesItem) => series.type;

const formatPrice = (price: number, discountPrice?: number) => {
    const p = Number(price);
    const d = discountPrice ? Number(discountPrice) : null;
    if (p === 0) return { label: "FREE", original: null, discount: null };
    if (d && d < p) {
        return {
            label: `₹${d.toFixed(0)}`,
            original: `₹${p.toFixed(0)}`,
            discount: Math.round(((p - d) / p) * 100),
        };
    }
    return { label: `₹${p.toFixed(0)}`, original: null, discount: null };
};

function SeriesCard({ item, onPress }: { item: SeriesItem; onPress: (item: SeriesItem) => void }) {
    const seriesType = getSeriesType(item);
    const typeStyle = TYPE_COLOR[seriesType] || TYPE_COLOR.prelims;
    const pricing = formatPrice(item.price, item.discount_price);

    return (
        <div
            onClick={() => onPress(item)}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]"
        >
            {/* Thumbnail */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {item.thumbnail_url ? (
                    <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-12 w-12 text-slate-300" />
                    </div>
                )}

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Type Badge */}
     

                {/* Purchased Badge */}
                {item.is_purchased && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                        <CheckCircle size={10} />
                        Purchased
                    </div>
                )}
            </div>

            {/* Left accent line on hover */}
            <div className="absolute left-0 top-0 h-full w-[3px] bg-red-400 opacity-0 transition-opacity group-hover:opacity-100 rounded-l-2xl" />

            {/* Content */}
            <div className="p-5">
                <h3 className="line-clamp-2 text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                </h3>

                {item.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 leading-relaxed">
                        {item.description}
                    </p>
                )}

                {/* Stats */}
                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <FileText size={12} className="text-red-500" />
                        {item.total_tests || 0} Tests
                                   <div className={` rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
                    {seriesType}
                </div>
                    </div>

                    {item.total_live ? (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {item.total_live} Live
                        </div>
                    ) : null}

                    {item.validity_days && (
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-red-500" />
                            {item.validity_days}d validity
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                        {pricing.label === "FREE" ? (
                            <div className="text-lg font-black text-emerald-600">FREE</div>
                        ) : (
                            <div className="flex flex-wrap items-end gap-1.5">
                                <span className="text-lg font-black text-slate-900">{pricing.label}</span>
                                {pricing.original && (
                                    <span className="text-xs text-slate-400 line-through mb-0.5">{pricing.original}</span>
                                )}
                                {pricing.discount && (
                                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                        {pricing.discount}% OFF
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {item.is_purchased ? (
                        <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-red-300 hover:text-red-600 transition-colors">
                            <PlayCircle size={13} />
                            View
                        </button>
                    ) : pricing.label === "FREE" ? (
                        <button className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-colors">
                            Start Free
                            <ArrowRight size={12} />
                        </button>
                    ) : (
                        <button className="flex items-center gap-1.5 rounded-xl bg-red-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-400 transition-colors">
                            Buy Now
                            <ArrowRight size={12} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

const TestSeriesPage = () => {
    const router = useRouter();

    const [series, setSeries] = useState<SeriesItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 20;

    const fetchSeries = useCallback(async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/new/test-series?page=${pageNum}&limit=${LIMIT}`);
            const data = response.data?.data || response.data;
            const incoming = data?.series || [];
            const totalPages = data?.total_pages || 1;
            setSeries((prev) => (pageNum === 1 ? incoming : [...prev, ...incoming]));
            setHasMore(pageNum < totalPages);
            setPage(pageNum);
        } catch (error) {
            console.error("Failed to fetch series:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSeries(1);
    }, [fetchSeries]);

    const filteredSeries = useMemo(() => {
        return series.filter((item) => {
            const t = getSeriesType(item);
            if (activeTab === "all") return true;
            if (activeTab === "mine") return item.is_purchased;
            if (activeTab === "combo") return t === "combo";
            return t === activeTab;
        });
    }, [series, activeTab]);

    const handlePress = (item: SeriesItem) => {
        router.push(`/test-series/${item.slug}?purchased=${item.is_purchased ? "1" : "0"}`);
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
                .serif { font-family: 'Playfair Display', serif; }
                .grid-bg { background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 40px 40px; }
            `}</style>

            {/* ── HEADER ─────────────────────────────────── */}
            <div className="grid-bg border-b border-black/5">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <span className="h-px w-8 bg-red-400" />
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
                                    UPSC Preparation
                                </p>
                            </div>
                            <h1 className="serif text-5xl font-black text-slate-900">Test Series</h1>
                            <p className="mt-2 text-slate-500">Choose your preparation path</p>
                        </div>

                        {/* Count pill */}
                        <div className="rounded-2xl border border-black/8 bg-white px-5 py-3 shadow-sm">
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Available</p>
                            <p className="text-2xl font-black text-red-500">{filteredSeries.length}</p>
                        </div>
                    </div>

                    {/* ── TABS ─────────────────────────────── */}
                    <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                                    activeTab === tab.key
                                        ? "bg-red-500 text-white shadow-md shadow-red-200"
                                        : "bg-white text-slate-600 border border-slate-200 hover:border-red-300 hover:text-red-600"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── BODY ───────────────────────────────────── */}
            <div className="mx-auto max-w-7xl px-6 py-10">
                {loading && page === 1 ? (
                    <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Loading series…</p>
                    </div>
                ) : filteredSeries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center">
                        <Inbox className="h-12 w-12 text-slate-300" />
                        <h3 className="mt-4 text-lg font-bold text-slate-700">No series found</h3>
                        <p className="mt-1 text-sm text-slate-400">Check back soon for new content.</p>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredSeries.map((item) => (
                            <SeriesCard key={item.id} item={item} onPress={handlePress} />
                        ))}
                    </div>
                )}

                {/* ── LOAD MORE ───────────────────────────── */}
                {hasMore && !loading && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => fetchSeries(page + 1)}
                            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-red-300 hover:text-red-600 hover:shadow-md"
                        >
                            Load More
                            <ArrowRight size={15} />
                        </button>
                    </div>
                )}

                {/* inline load-more spinner */}
                {loading && page > 1 && (
                    <div className="mt-10 flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestSeriesPage;