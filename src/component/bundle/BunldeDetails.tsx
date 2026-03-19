"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/lib/store/auth.store";
import {
    Clock,
    FileText,
    Star,
    Lock,
    CheckCircle,
    X,
    ChevronRight,
    Zap,
    AlertTriangle,
    BookOpen,
    Award,
    BarChart2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Quiz {
    id: number;
    image: string;
    displayIn: string;
    title: string;
    description: string;
    totalQuestions: number;
    timePerQuestion: number;
    durationMinutes: number;
    totalMarks: number;
    isActive: boolean;
    negativeMarking: boolean;
    negativeMarksPerQuestion: number | null;
    passingMarks: number;
    isFree: boolean;
    price: number | null;
    attemptLimit: number;
    status: string;
    showHints: boolean;
    showExplanations: boolean;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    createdAt: string;
    updatedAt: string;
}

interface QuizBundle {
    id: number;
    imageUrl: string;
    title: string;
    slug: string;
    description: string;
    isActive: boolean;
    price: number;
    discountPrice: number;
    gst: number;
    displayOrder: number;
    expirBundle: string | null;
    createdAt: string;
    updatedAt: string;
    quizzes: Quiz[];
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

const Stat = ({
    icon,
    label,
    value,
    accent,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent?: string;
}) => (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
        <span className={`${accent ?? "text-gray-400"}`}>{icon}</span>
        <div>
            <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
            <p className="text-xs font-bold text-gray-800 leading-none">{value}</p>
        </div>
    </div>
);

// ─── Quiz card ────────────────────────────────────────────────────────────────

const QuizCard = ({
    quiz,
    unlocked,
    onOpen,
}: {
    quiz: Quiz;
    unlocked: boolean;
    onOpen: () => void;
}) => {
    const accessible = unlocked || quiz.isFree;

    return (
        <div
            className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${accessible
                    ? "border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer"
                    : "border-gray-100 opacity-70"
                }`}
            onClick={accessible ? onOpen : undefined}
        >
            {/* Image strip */}
            <div className="relative h-28 overflow-hidden bg-gray-100">
                <img
                    src={quiz.image}
                    alt={quiz.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Lock / Free badge */}
                <div className="absolute top-2 right-2">
                    {quiz.isFree ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                            <Zap size={9} /> FREE
                        </span>
                    ) : !accessible ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-medium">
                            <Lock size={9} /> Locked
                        </span>
                    ) : null}
                </div>

                {accessible && (
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                            <ChevronRight size={12} className="text-blue-600" />
                        </div>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-3">
                <h3 className="text-xs font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
                    {quiz.title}
                </h3>

                <div className="grid grid-cols-3 gap-1.5">
                    <Stat icon={<FileText size={10} />} label="Qs" value={quiz.totalQuestions} />
                    <Stat icon={<Clock size={10} />} label="Mins" value={quiz.durationMinutes} />
                    <Stat icon={<Award size={10} />} label="Marks" value={quiz.totalMarks} accent="text-amber-500" />
                </div>

                {quiz.negativeMarking && (
                    <p className="text-[10px] text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <AlertTriangle size={9} />
                        −{quiz.negativeMarksPerQuestion ?? 1} negative marking
                    </p>
                )}
            </div>
        </div>
    );
};

// ─── Quiz detail modal ────────────────────────────────────────────────────────

const QuizModal = ({
    quiz,
    unlocked,
    onClose,
    onStart,
}: {
    quiz: Quiz;
    unlocked: boolean;
    onClose: () => void;
    onStart: () => void;
}) => {
    const accessible = unlocked || quiz.isFree;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header image */}
                <div className="relative h-36 overflow-hidden bg-gray-100">
                    <img src={quiz.image} alt={quiz.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                    >
                        <X size={14} />
                    </button>
                    <div className="absolute bottom-3 left-4 right-12">
                        <h3 className="text-sm font-bold text-white leading-snug">{quiz.title}</h3>
                        {quiz.description && (
                            <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{quiz.description}</p>
                        )}
                    </div>
                </div>

                {/* Stats grid */}
                <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                            { icon: <FileText size={12} />, label: "Questions", value: quiz.totalQuestions, color: "text-blue-500" },
                            { icon: <Clock size={12} />, label: "Duration", value: `${quiz.durationMinutes} min`, color: "text-violet-500" },
                            { icon: <Award size={12} />, label: "Total Marks", value: quiz.totalMarks, color: "text-amber-500" },
                            { icon: <BarChart2 size={12} />, label: "Passing Marks", value: quiz.passingMarks, color: "text-emerald-500" },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className={`w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm ${s.color}`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400">{s.label}</p>
                                    <p className="text-xs font-bold text-gray-800">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {quiz.showHints && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-medium text-blue-600">Hints available</span>
                        )}
                        {quiz.showExplanations && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-medium text-emerald-600">With explanations</span>
                        )}
                        {quiz.negativeMarking && (
                            <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-100 text-[10px] font-medium text-red-600">
                                −{quiz.negativeMarksPerQuestion ?? 1} negative
                            </span>
                        )}
                        {quiz.attemptLimit > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-medium text-amber-600">
                                {quiz.attemptLimit} attempt{quiz.attemptLimit > 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {accessible ? (
                        <button
                            onClick={onStart}
                            className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                        >
                            <Zap size={13} /> Start Quiz Now
                        </button>
                    ) : (
                        <div className="w-full h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center gap-2">
                            <Lock size={12} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500">Purchase bundle to unlock</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const BundleSkeleton = () => (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="flex gap-6 mb-8">
            <div className="w-56 h-44 rounded-2xl bg-gray-200 flex-shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-8 bg-gray-200 rounded-xl w-32 mt-4" />
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-gray-200 h-48" />
            ))}
        </div>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const BundleDetails = ({ id }: { id: string }) => {
    const router = useRouter();
    const { user } = useAuthStore();

    const [bundle, setBundle] = useState<QuizBundle | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPurchased, setIsPurchased] = useState(false);
    const [paying, setPaying] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    // ── Fetch ──────────────────────────────────────────────────────────────────

    const checkIfPurchased = async (bundleId: number) => {

        try {
            const res = await axiosInstance.get("/orders/already-purchased", {
                params: { type: "quiz_bundle", itemId: bundleId },

            });
            console.log(res.data)
            setIsPurchased(!!res.data?.purchased);
        } catch {
            setIsPurchased(false);
        }
    };

    const fetchBundle = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/quiz-bundles/${id}`);
            const data = res.data?.data ?? res.data;
            setBundle(data);
            if (data?.id) await checkIfPurchased(data.id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchBundle(); }, [fetchBundle]);

    // ── Payment ────────────────────────────────────────────────────────────────

    const loadRazorpay = () =>
        new Promise<boolean>((resolve) => {
            if ((window as any).Razorpay) { resolve(true); return; }
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });

    const verifyPayment = async (response: any) => {
        try {
            await axiosInstance.post(
                "/orders/verify",
                {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                },

            );
            setIsPurchased(true);
            setPaying(false);
            setPaymentStatus("success");
            setTimeout(() => { setPaymentStatus(null); fetchBundle(); }, 2500);
        } catch {
            setPaying(false);
            setPaymentStatus("failed");
            setTimeout(() => setPaymentStatus(null), 4000);
        }
    };

    const initiatePayment = async () => {
        if (paying || isPurchased || !bundle || !user) return;
        setPaying(true);
        setPaymentStatus(null);
        try {
            const orderRes = await axiosInstance.post(
                "/orders",
                { userId: (user as any).id, type: "quiz_bundle", itemId: bundle.id, amount: bundle.discountPrice ?? bundle.price },

            );
            const { razorOrder, key } = orderRes.data?.data ?? orderRes.data;
            const loaded = await loadRazorpay();
            if (!loaded) throw new Error("Razorpay failed to load");

            const rzp = new (window as any).Razorpay({
                key,
                amount: razorOrder.amount,
                currency: "INR",
                name: "Dikshant IAS",
                description: bundle.title,
                image: "https://dikshantiasnew-web.s3.amazonaws.com/logo.png",
                order_id: razorOrder.id,
                prefill: { name: (user as any).name ?? "", email: (user as any).email ?? "", contact: (user as any).phone ?? "" },
                theme: { color: "#2563EB" },
                handler: (res: any) => verifyPayment(res),
            });
            rzp.on("payment.failed", () => {
                setPaying(false);
                setPaymentStatus("failed");
                setTimeout(() => setPaymentStatus(null), 4000);
            });
            rzp.open();
        } catch {
            setPaying(false);
            setPaymentStatus("failed");
            setTimeout(() => setPaymentStatus(null), 4000);
        }
    };

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleStartQuiz = () => {
        if (!selectedQuiz) return;
        router.push(`/quiz/${selectedQuiz.id}`);
        setSelectedQuiz(null);
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    if (loading) return <BundleSkeleton />;

    if (!bundle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle size={20} className="text-red-500" />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">Bundle not found</p>
                    <button onClick={() => router.back()} className="mt-3 text-xs text-blue-600 hover:underline">Go back</button>
                </div>
            </div>
        );
    }

    const finalPrice = bundle.discountPrice ?? bundle.price;
    const discountPct = bundle.discountPrice
        ? Math.round(((bundle.price - bundle.discountPrice) / bundle.price) * 100)
        : 0;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">

            {/* ── Bundle hero ───────────────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row">

                    {/* Image */}
                    <div className="sm:w-52 sm:flex-shrink-0 h-44 sm:h-auto overflow-hidden bg-gray-100">
                        <img
                            src={bundle.imageUrl}
                            alt={bundle.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h1 className="text-base font-bold capitalize text-gray-900 leading-snug">{bundle.title}</h1>
                                {isPurchased && (
                                    <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-600">
                                        <CheckCircle size={9} /> Purchased
                                    </span>
                                )}
                            </div>
                            <p className="text-xs capitalize text-gray-500 leading-relaxed line-clamp-3 mb-3">{bundle.description}</p>

                            {/* Bundle meta pills */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                <span className="inline-flex capitalize items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-medium text-blue-600">
                                    <BookOpen size={9} /> {bundle.quizzes.length} quizzes
                                </span>
                                {bundle.expirBundle && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-medium text-amber-600">
                                        <Clock size={9} /> Expires {new Date(bundle.expirBundle).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-black text-gray-900">₹{finalPrice}</span>
                                {bundle.discountPrice && (
                                    <>
                                        <span className="text-xs text-gray-400 line-through">₹{bundle.price}</span>
                                        <span className="px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 text-[10px] font-bold">{discountPct}% OFF</span>
                                    </>
                                )}
                            </div>

                            {isPurchased ? (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <CheckCircle size={12} className="text-emerald-500" />
                                    <span className="text-xs font-semibold text-emerald-600">Already Purchased</span>
                                </div>
                            ) : (
                                <button
                                    onClick={initiatePayment}
                                    disabled={paying}
                                    className="h-8 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                                >
                                    {paying ? (
                                        <><span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
                                    ) : (
                                        <><Zap size={11} /> Buy Now – ₹{finalPrice}</>
                                    )}
                                </button>
                            )}

                            {/* Payment status banners */}
                            {paymentStatus === "success" && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <CheckCircle size={12} className="text-emerald-500" />
                                    <span className="text-xs font-medium text-emerald-700">Payment successful!</span>
                                </div>
                            )}
                            {paymentStatus === "failed" && (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200">
                                    <AlertTriangle size={12} className="text-red-500" />
                                    <span className="text-xs font-medium text-red-700">Payment failed. Try again.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quiz grid ────────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-gray-800">
                    Included Quizzes
                    <span className="ml-1.5 text-xs font-medium text-gray-400">({bundle.quizzes.length})</span>
                </h2>
                {!isPurchased && (
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Lock size={10} /> Purchase to unlock all
                    </p>
                )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {bundle.quizzes.map((quiz) => (
                    <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        unlocked={isPurchased}
                        onOpen={() => setSelectedQuiz(quiz)}
                    />
                ))}
            </div>

            {/* ── Quiz detail modal ─────────────────────────────────────────────── */}
            {selectedQuiz && (
                <QuizModal
                    quiz={selectedQuiz}
                    unlocked={isPurchased}
                    onClose={() => setSelectedQuiz(null)}
                    onStart={handleStartQuiz}
                />
            )}
        </div>
    );
};

export default BundleDetails;