"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import {
    Clock,
    FileText,
    Star,
    Lock,
    CheckCircle,
    X,
    ChevronRight,
    AlertTriangle,
    BookOpen,
    Search,
    Package,
    Layers,
    BarChart2,
    Award,
    Zap,
} from "lucide-react";
import TestseriesImage from "./TestSeries.png"
import Image from "next/image";

interface TestSeriesItem {
    id: number | string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    discountPrice: number;
    timeDurationForTest?: number;
    displayIn?: string;
}

interface Bundle {
    id: number | string;
    title: string;
    description: string;
    price: number;
    discountPrice: number;
    gst: number;
    testSeries: TestSeriesItem[];
}

interface Quiz {
    id: number | string;
    title: string;
    description: string;
    image?: string;
    totalQuestions: number;
    durationMinutes?: number;
    duration?: number;
    price?: number;
    isFree?: boolean;
    level?: string;
}

const TABS = [
    { id: "all", label: "All to All Test", icon: Layers },
    { id: "bundle", label: "Bundles to Package", icon: Package },
    { id: "objective", label: "Objective to Prelims Tests", icon: FileText },
    { id: "subjective", label: "Mains Tests", icon: FileText },
    { id: "my", label: "My Tests", icon: Star },
];

export default function TestSeriesPage() {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("all");
    const [testSeries, setTestSeries] = useState<TestSeriesItem[]>([]);
    const [bundles, setBundles] = useState<Bundle[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [purchasedMap, setPurchasedMap] = useState<Record<string | number, boolean>>({});
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [bundleLoading, setBundleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkPurchases = useCallback(async (items: TestSeriesItem[]) => {
        if (!items.length) return;
        const map: Record<string | number, boolean> = {};
        await Promise.all(
            items.map(async (item) => {
                try {
                    const res = await axiosInstance.get("/orders/already-purchased", {
                        params: { itemId: item.id, type: "test" },
                    });
                    map[item.id] = !!res.data?.purchased;
                } catch {
                    map[item.id] = false;
                }
            })
        );
        setPurchasedMap((prev) => ({ ...prev, ...map }));
    }, []);

    const fetchBundles = useCallback(async () => {
        setBundleLoading(true);
        try {
            const res = await axiosInstance.get("/testseries-bundles");
            if (res.data?.success) {
                setBundles(res.data.data || []);
                const allSeries = (res.data.data || []).flatMap((b: Bundle) => b.testSeries || []);
                await checkPurchases(allSeries);
            }
        } catch {
        } finally {
            setBundleLoading(false);
        }
    }, [checkPurchases, activeTab]);

    const fetchTestSeries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get("/testseriess", {
                params: { limit: 120, sortBy: "displayOrder", sortOrder: "ASC" },
            });
            const data = res.data?.data || [];
            setTestSeries(data);
            await checkPurchases(data);
        } catch {
            setError("Failed to load test series. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [checkPurchases]);

    const fetchQuizzes = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/quiz/quizzes", {
                params: { displayIn: "TestSeries", search: searchQuery.trim() || undefined, limit: 60 },
            });
            setQuizzes(res.data.data || []);
        } catch {
            setError("Failed to load objective quizzes.");
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        fetchTestSeries();
        fetchBundles();
        fetchQuizzes();
    }, [fetchTestSeries, fetchBundles]);

    useEffect(() => {
        if (activeTab === "objective") fetchQuizzes();
    }, [activeTab, searchQuery, fetchQuizzes]);

    const visibleTestSeries = useMemo(() => {

        let filtered = [...testSeries];

        // My Tests
        if (activeTab === "my") {
            return filtered.filter((t) => purchasedMap[t.id]);
        }

        // Subjective (Mains)
        if (activeTab === "subjective") {
            return filtered.filter((t) => t.type === "subjective");
        }
        console.log(filtered)
        // All tab → NO FILTER
        return filtered;

    }, [activeTab, testSeries, purchasedMap]);

    const enrolledCount = Object.values(purchasedMap).filter(Boolean).length;

    const renderBundleCard = (bundle: Bundle) => {
        const savings = bundle.price - bundle.discountPrice;
        const savingsPercent = Math.round((savings / bundle.price) * 100);
        return (
            <div
                key={bundle.id}
                onClick={() => router.push(`/bundle/${bundle.id}`)}
                className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-colors cursor-pointer overflow-hidden"
            >
                <div className="bg-red-600 px-4 py-4 text-white">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <span className="inline-block bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded mb-2">
                                {savingsPercent}% OFF
                            </span>
                            <h3 className="text-sm font-semibold leading-snug line-clamp-2">{bundle.title}</h3>
                            <p className="text-xs text-red-100 mt-1 line-clamp-1">{bundle.description}</p>
                        </div>
                        <div className="text-center shrink-0">
                            <Package size={22} className="mx-auto mb-1 opacity-80" />
                            <div className="text-lg font-bold leading-none">{bundle.testSeries?.length || 0}</div>
                            <div className="text-[10px] opacity-75">Series</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-2">
                    {bundle.testSeries?.slice(0, 3).map((s) => (
                        <div key={s.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                            <img src={s.imageUrl} alt={s.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium line-clamp-1">{s.title}</p>
                                <p className="text-xs text-red-600 font-semibold">
                                    ₹{s.discountPrice}
                                    <span className="text-gray-400 line-through ml-1.5">₹{s.price}</span>
                                </p>
                            </div>
                            <CheckCircle size={14} className="text-green-500 shrink-0" />
                        </div>
                    ))}
                    {bundle.testSeries?.length > 3 && (
                        <p className="text-center text-xs text-blue-600 font-medium pt-1">
                            +{bundle.testSeries.length - 3} more series
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                        <div>
                            <p className="text-base font-bold text-gray-900">₹{bundle.discountPrice}</p>
                            <p className="text-[10px] text-gray-400">+{bundle.gst}% GST · Save ₹{savings}</p>
                        </div>
                        <button className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors">
                            Get Bundle <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="relative overflow-hidden bg-gradient-to-br from-red-400 via-rose-400 to-red-500 text-white mt-3">

                {/* Main container (reduced height) */}
                <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 lg:py-14">

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                        {/* Left Content */}
                        <div className="space-y-6">

                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-xs font-medium border border-white/20">
                                <Zap className="w-3.5 h-3.5" />
                                <span>Master Competitive Exams</span>
                            </div>

                            {/* Heading (reduced size) */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                                <span className="block">Test Series & Practice</span>
                                <span className="block mt-1 bg-gradient-to-r from-white via-rose-100 to-white bg-clip-text text-transparent">
                                    Ace Every Exam
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-sm sm:text-base text-white/90 max-w-lg">
                                Structured tests, smart bundles, quizzes & analytics — everything you need to crack your next exam.
                            </p>

                            {/* Stats (smaller + tighter) */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                        <Award className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">{testSeries?.length - 1 || 0}+</div>
                                        <div className="text-[10px] opacity-80">Tests</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                        <BarChart2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">Analytics</div>
                                        <div className="text-[10px] opacity-80">Detailed</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">Bundles</div>
                                        <div className="text-[10px] opacity-80">Save 40%</div>
                                    </div>
                                </div>

                            </div>


                        </div>

                        {/* Right Image (slightly smaller) */}
                        <div className="relative hidden lg:block">

                            <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>

                            <div className="relative rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl">

                                <Image
                                    src={TestseriesImage}
                                    alt="Test Series"
                                    className="w-full h-auto object-cover"
                                />

                                <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-red-600">
                                    2026 Updated
                                </div>

                            </div>
                        </div>

                    </div>
                </div>


            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="flex gap-2 flex-wrap">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${isActive
                                        ? "bg-red-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <Icon size={14} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {activeTab === "objective" && (
                        <div className="relative ml-auto">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search objective tests..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-64 pl-9 pr-8 bg-gray-100 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4" />
                        <p className="text-sm text-gray-500">Loading content...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md mx-auto">
                        <AlertTriangle size={32} className="mx-auto text-red-500 mb-3" />
                        <h3 className="text-sm font-semibold text-red-800 mb-1">Something went wrong</h3>
                        <p className="text-xs text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => { setError(null); fetchTestSeries(); fetchBundles(); }}
                            className="h-9 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div>
                        {(activeTab === "all" || activeTab === "bundle") && (
                            <div className="py-3">
                                {activeTab === "all" && <span>Bundle Test Series</span>}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {bundles.length === 0 ? (
                                        <div className="col-span-full py-16 text-center text-gray-400">
                                            <Package size={40} className="mx-auto mb-3 opacity-40" />
                                            <p className="text-sm font-medium">No Bundles Available</p>
                                            <p className="text-xs mt-1">Check back soon for exciting bundle offers!</p>
                                        </div>
                                    ) : (
                                        bundles.map(renderBundleCard)
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "my" && (
                            <div className="py-3">
                                {/* {activeTab === "all" && <span>My Test Series</span>} */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {visibleTestSeries.length === 0 ? (
                                        <div className="col-span-full py-16 text-center text-gray-400">
                                            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                                            <p className="text-sm font-medium">
                                                {activeTab === "my" ? "No Enrolled Tests" : "No Test Series Found"}
                                            </p>
                                            <p className="text-xs mt-1">
                                                {activeTab === "my" ? "Enroll in tests to see them here" : "New series coming soon!"}
                                            </p>
                                        </div>
                                    ) : (
                                        visibleTestSeries.map((item) => {
                                            const isPurchased = !!purchasedMap[item.id];
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => router.push(`/test-series/${item.id}?purchased=${isPurchased}`)}
                                                    className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-colors cursor-pointer overflow-hidden"
                                                >
                                                    <div className="relative">
                                                        <div className="relative w-full aspect-[16/9]">
                                                            <Image
                                                                src={item.imageUrl}
                                                                alt={item.title}
                                                                fill
                                                                className="object-contain rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
                                                            <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                                                                Featured
                                                            </span>
                                                            {isPurchased && (
                                                                <span className="bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                                                    <CheckCircle size={10} /> Enrolled
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {item.timeDurationForTest || "?"} min
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>

                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div>
                                                                {item.discountPrice < item.price && (
                                                                    <span className="text-[11px] text-gray-400 line-through block">₹{item.price}</span>
                                                                )}
                                                                <p className="text-base font-bold text-gray-900">
                                                                    ₹{item.discountPrice || item.price}
                                                                </p>
                                                            </div>
                                                            <button className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors">
                                                                {isPurchased ? "Continue" : "Enroll"}
                                                                <ChevronRight size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {(activeTab === "all" || activeTab === "subjective") && (
                            <div className="py-3">
                                {activeTab === "all" && <span>Subjective Test Series</span>}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {visibleTestSeries.length === 0 ? (
                                        <div className="col-span-full py-16 text-center text-gray-400">
                                            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                                            <p className="text-sm font-medium">
                                                {activeTab === "my" ? "No Enrolled Tests" : "No Test Series Found"}
                                            </p>
                                            <p className="text-xs mt-1">
                                                {activeTab === "my" ? "Enroll in tests to see them here" : "New series coming soon!"}
                                            </p>
                                        </div>
                                    ) : (
                                        visibleTestSeries.map((item) => {
                                            const isPurchased = !!purchasedMap[item.id];
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => router.push(`/test-series/${item.id}?purchased=${isPurchased}`)}
                                                    className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-colors cursor-pointer overflow-hidden"
                                                >
                                                    <div className="relative">
                                                        <div className="relative w-full aspect-[16/9]">
                                                            <Image
                                                                src={item.imageUrl}
                                                                alt={item.title}
                                                                fill
                                                                className="object-contain rounded-lg"
                                                            />
                                                        </div>
                                                        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
                                                            <span className="bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                                                                Featured
                                                            </span>
                                                            {isPurchased && (
                                                                <span className="bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                                                    <CheckCircle size={10} /> Enrolled
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {item.timeDurationForTest || "?"} min
                                                        </div>
                                                    </div>

                                                    <div className="p-4">
                                                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>

                                                        <div className="mt-4 flex items-center justify-between">
                                                            <div>
                                                                {item.discountPrice < item.price && (
                                                                    <span className="text-[11px] text-gray-400 line-through block">₹{item.price}</span>
                                                                )}
                                                                <p className="text-base font-bold text-gray-900">
                                                                    ₹{item.discountPrice || item.price}
                                                                </p>
                                                            </div>
                                                            <button className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors">
                                                                {isPurchased ? "Continue" : "Enroll"}
                                                                <ChevronRight size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {(activeTab === "all" || activeTab === "objective") && (
                            <div className="py-3">
                                {activeTab === "all" && <span>Objective Test Series</span>}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {quizzes.length === 0 ? (
                                        <div className="col-span-full py-16 text-center text-gray-400">
                                            <FileText size={40} className="mx-auto mb-3 opacity-40" />
                                            <p className="text-sm font-medium">
                                                {searchQuery ? "No matching quizzes" : "No Objective Quizzes"}
                                            </p>
                                            <p className="text-xs mt-1">{searchQuery ? "Try different keywords" : "Coming soon!"}</p>
                                        </div>
                                    ) : (
                                        quizzes.map((quiz) => (
                                            <div
                                                key={quiz.id}
                                                onClick={() => router.push(`/quiz/${quiz.id}`)}
                                                className="bg-white rounded-xl border border-gray-200 hover:border-red-300 transition-colors cursor-pointer overflow-hidden"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={quiz.image || "https://i.ibb.co/5WvN9fMJ/image.png"}
                                                        alt={quiz.title}
                                                        className="w-full h-36 object-cover"
                                                    />
                                                    {quiz.isFree ? (
                                                        <span className="absolute top-2.5 left-2.5 bg-green-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                                                            Free
                                                        </span>
                                                    ) : (
                                                        <span className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                                                            <Lock size={9} /> Premium
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="p-4">
                                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                                                        {quiz.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{quiz.description}</p>

                                                    <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <FileText size={12} /> {quiz.totalQuestions} Qs
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={12} /> {quiz.durationMinutes || quiz.duration || "?"} min
                                                        </span>
                                                        {!quiz.isFree && (
                                                            <span className="text-red-600 font-semibold">₹{quiz.price || 0}</span>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between">
                                                        <span className="text-[11px] font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
                                                            {quiz.level || "Beginner"}
                                                        </span>
                                                        <button className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors">
                                                            Start Quiz <ChevronRight size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}