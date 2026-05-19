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
    Layers,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const TABS = [
    { key: "all",     label: "All Series" },
    { key: "prelims", label: "Prelims"    },
    { key: "mains",   label: "Mains"      },
    { key: "combo",   label: "Combo"      },
    { key: "mine",    label: "My Tests"   },
];

const TYPE_PILL: Record<string, string> = {
    prelims: "bg-sky-50 text-sky-600 ring-1 ring-sky-200",
    mains:   "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
    combo:   "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
};

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const formatPrice = (price: number, discount?: number) => {
    const p = Number(price);
    const d = discount ? Number(discount) : null;
    if (p === 0) return { label: "FREE", original: null, pct: null };
    if (d && d < p)
        return {
            label: `₹${d.toFixed(0)}`,
            original: `₹${p.toFixed(0)}`,
            pct: Math.round(((p - d) / p) * 100),
        };
    return { label: `₹${p.toFixed(0)}`, original: null, pct: null };
};

/* ─────────────────────────────────────────────
   SERIES CARD
───────────────────────────────────────────── */

function SeriesCard({
    item,
    onPress,
    index,
}: {
    item: SeriesItem;
    onPress: (item: SeriesItem) => void;
    index: number;
}) {
    const typeStyle = TYPE_PILL[item.type] ?? TYPE_PILL.prelims;
    const pricing   = formatPrice(item.price, item.discount_price);

    return (
        <article
            onClick={() => onPress(item)}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-100 cursor-pointer
                       transition-all duration-300
                       hover:border-red-100 hover:shadow-[0_16px_48px_rgba(230,0,11,0.10)]
                       hover:-translate-y-1"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            {/* ── THUMBNAIL ─────────────────────────── */}
            <div className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-slate-50 to-slate-100">
                {item.thumbnail_url ? (
                    <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-12 w-12 text-slate-200" />
                    </div>
                )}

                {/* gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* type badge — bottom left */}
                <span className={`absolute bottom-3 left-3 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${typeStyle}`}>
                    {item.type}
                </span>

                {item.is_purchased && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white">
                        <CheckCircle size={9} />
                        Owned
                    </span>
                )}

                {/* red top accent bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 to-rose-400 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300" />
            </div>

            {/* ── CONTENT ───────────────────────────── */}
            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 tracking-[-0.01em]">
                    {item.title}
                </h3>

                {item.description && (
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-400">
                        {item.description}
                    </p>
                )}

                {/* stat chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                        <FileText size={11} className="text-slate-400" />
                        {item.total_tests ?? 0} Tests
                    </span>

                    {!!item.total_live && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {item.total_live} Live
                        </span>
                    )}

                    {!!item.validity_days && (
                        <span className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            <Clock size={11} className="text-slate-400" />
                            {item.validity_days}d
                        </span>
                    )}
                </div>

                {/* ── FOOTER ─────────────────────────── */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 mt-5">
                    {/* price */}
                    <div className="flex flex-col gap-0.5">
                        {pricing.label === "FREE" ? (
                            <span className="text-lg font-black text-emerald-600">FREE</span>
                        ) : (
                            <>
                                <div className="flex items-end gap-1.5">
                                    <span className="text-lg font-black text-slate-900 leading-none">{pricing.label}</span>
                                    {pricing.pct && (
                                        <span className="mb-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: "#E6000B" }}>
                                            -{pricing.pct}% OFF
                                        </span>
                                    )}
                                </div>
                                {pricing.original && (
                                    <span className="text-[11px] text-slate-400 line-through">{pricing.original}</span>
                                )}
                            </>
                        )}
                    </div>

                    {/* CTA */}
                    {item.is_purchased ? (
                        <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-[12px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                            <PlayCircle size={13} />
                            Resume
                        </button>
                    ) : pricing.label === "FREE" ? (
                        <button className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-[12px] font-bold text-white hover:bg-emerald-600 transition-colors shadow-sm">
                            Start Free <ArrowRight size={12} />
                        </button>
                    ) : (
                        <button
                            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
                            style={{ backgroundColor: "#E6000B" }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#c40009")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E6000B")}
                        >
                            Buy Now <ArrowRight size={13} />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ─────────────────────────────────────────────
   STAT CHIP  (header)
───────────────────────────────────────────── */

function StatChip({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-red-50">
                <Icon size={16} className="text-red-500" />
            </div>
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-0.5 text-lg font-black text-slate-900 leading-none">{value}</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

const TestSeriesPage = () => {
    const router = useRouter();

    const [series, setSeries]     = useState<SeriesItem[]>([]);
    const [loading, setLoading]   = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage]         = useState(1);
    const [hasMore, setHasMore]   = useState(true);

    const LIMIT = 20;

    const fetchSeries = useCallback(async (pageNum = 1) => {
        try {
            setLoading(true);
            const res  = await axiosInstance.get(`/new/test-series?page=${pageNum}&limit=${LIMIT}`);
            const data = res.data?.data ?? res.data;
            const incoming   = data?.series ?? [];
            const totalPages = data?.total_pages ?? 1;
            setSeries((prev) => (pageNum === 1 ? incoming : [...prev, ...incoming]));
            setHasMore(pageNum < totalPages);
            setPage(pageNum);
        } catch (err) {
            console.error("Failed to fetch series:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSeries(1); }, [fetchSeries]);

    const filteredSeries = useMemo(() => {
        return series.filter((item) => {
            if (activeTab === "all")  return true;
            if (activeTab === "mine") return item.is_purchased;
            return item.type === activeTab;
        });
    }, [series, activeTab]);

    const handlePress = (item: SeriesItem) =>
        router.push(`/test-series/${item.slug}?purchased=${item.is_purchased ? "1" : "0"}`);

    return (
        <div
            className="min-h-screen bg-[#F7F7F5]"
            style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap');
                .serif { font-family: 'Instrument Serif', serif; }
                ::-webkit-scrollbar { display: none; }
            `}</style>

            {/* ════════════════════════════════════════
                HERO HEADER
            ════════════════════════════════════════ */}
            <header className="relative bg-white border-b border-slate-100">

              

                <div className="mx-auto max-w-7xl px-6 pt-10 pb-0">

                    {/* ── TOP ROW ───────────────────── */}
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

                        {/* LEFT: headline */}
                        <div className="max-w-2xl">

                            {/* eyebrow */}
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-red-500">
                                    India's Premier UPSC Platform
                                </span>
                            </div>

                            {/* headline */}
                            <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] text-slate-900 leading-[1.0] lg:text-6xl">
                                Crack UPSC with
                                <br />
                                <span className="serif italic font-normal text-red-500">
                                    Premium&nbsp;Test&nbsp;Series
                                </span>
                            </h1>

                            <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
                                Real exam-level mocks, AIR rankings, detailed analytics
                                and smart tracking — built for serious aspirants.
                            </p>

                            {/* feature pills */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {["AIR Ranking", "Live Mock Tests", "Daily Practice", "Deep Analytics"].map((f) => (
                                    <span
                                        key={f}
                                        className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600"
                                    >
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: stat chips */}
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 shrink-0 pb-2 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <StatChip icon={Layers}     label="Total Series"  value={`${filteredSeries.length}`} />
                            <StatChip icon={Users}      label="Students"      value="25K+"  />
                            <StatChip icon={TrendingUp} label="Success Rate"  value="92%"   />
                            <StatChip icon={Zap}        label="Live Tests"    value="Active"/>
                        </div>
                    </div>

                    {/* ── TABS ──────────────────────── */}
                    <div className="mt-8 flex gap-2 overflow-x-auto pb-6">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                                    activeTab === tab.key
                                        ? "text-white shadow-sm"
                                        : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                                }`}
                                style={activeTab === tab.key ? { backgroundColor: "#E6000B" } : {}}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ════════════════════════════════════════
                BODY
            ════════════════════════════════════════ */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* LOADING (first page) */}
                {loading && page === 1 ? (
                    <div className="flex h-[400px] flex-col items-center justify-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                        <p className="text-[11px] uppercase tracking-widest text-slate-400">Loading…</p>
                    </div>

                /* EMPTY */
                ) : filteredSeries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center">
                        <Inbox className="h-10 w-10 text-slate-300" />
                        <h3 className="mt-4 text-base font-bold text-slate-700">No series found</h3>
                        <p className="mt-1 text-sm text-slate-400">Check back soon for new content.</p>
                    </div>

                /* GRID */
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredSeries.map((item, i) => (
                            <SeriesCard key={item.id} item={item} onPress={handlePress} index={i} />
                        ))}
                    </div>
                )}

                {/* LOAD MORE */}
                {hasMore && !loading && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => fetchSeries(page + 1)}
                            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-3 text-[13px] font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
                        >
                            Load more <ArrowRight size={14} />
                        </button>
                    </div>
                )}

                {/* inline spinner */}
                {loading && page > 1 && (
                    <div className="mt-10 flex justify-center">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-red-500" />
                    </div>
                )}
            </main>
        </div>
    );
};

export default TestSeriesPage;