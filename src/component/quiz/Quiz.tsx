"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { Lock, CheckCircle } from "lucide-react";
import { PaymentStatus } from "./PaymentStatus";
import { ConfirmModal } from "./ConfirmModal";
import ilustartion from './illustration.png'
import { useAuthStore } from "@/lib/store/auth.store";
import DikshantAuthModal from "@/components/auth-model/DikshantAuthModal";
// ────────────────────────────────────────────────
//  TYPES
// ────────────────────────────────────────────────

interface Quiz {
  id: string | number;
  title: string;
  image: string;
  isFree: boolean;
  price?: number;
  displayIn: string;
  status: string;
  totalQuestions: number;
  timePerQuestion: number;
  durationMinutes?: number;
  totalMarks: number;
  negativeMarking: boolean;
  totalPurchases?: number;
}

interface Bundle {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  quizzes?: unknown[];
}

// ────────────────────────────────────────────────
//  CONSTANTS
// ────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const QUIZ_ENDPOINT = `${BASE_URL}/quiz/quizzes`;
const BUNDLE_ENDPOINT = `${BASE_URL}/quiz-bundles`;

// ────────────────────────────────────────────────
//  SKELETON
// ────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-4 animate-pulse">
    <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-5 bg-slate-200 rounded w-3/5" />
      <div className="h-4 bg-slate-200 rounded w-4/5" />
      <div className="h-4 bg-slate-200 rounded w-2/5" />
    </div>
  </div>
);

// ────────────────────────────────────────────────
//  COMPONENTS
// ────────────────────────────────────────────────

const BundleCard = ({ item, onPress }: { item: Bundle; onPress: (item: Bundle) => void }) => {
  const discount = item.discountPrice ? Math.round(((item.price - item.discountPrice) / item.price) * 100) : 0;
  const finalPrice = item.discountPrice ?? item.price;

  return (
    <button
      onClick={() => onPress(item)}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-red-200 hover:shadow-md transition-all duration-200 text-left w-full"
    >
      <div className="relative aspect-[4/3] bg-slate-900">
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="font-bold text-xl tracking-tight uppercase">
            {item.title.replace(/-/g, " ")}
          </h3>
          <p className="text-sm text-white/70 mt-1.5 line-clamp-2">{item.description}</p>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <span className="font-bold text-xl">₹{finalPrice}</span>
            {item.discountPrice && (
              <span className="text-white/60 line-through">₹{item.price}</span>
            )}
            <span className="ml-auto flex items-center gap-1.5 text-white/80">
              <span className="text-base">📚</span>
              {item.quizzes?.length ?? 0} Quizzes
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

const QuizCard = ({
  item,
  onPress,
  isPurchased,
  remainingAttempts,
  canAttempt,
}: {
  item: Quiz;
  onPress: (item: Quiz) => void;
  isPurchased: boolean;
  remainingAttempts: number | null;
  canAttempt: boolean;
}) => {
  const durationMin = item.durationMinutes ?? Math.round((item.totalQuestions * item.timePerQuestion) / 60);

  return (
    <button
      onClick={() => onPress(item)}
      disabled={!item.isFree && !canAttempt}
      className={`group flex bg-white rounded-xl border ${!item.isFree && !canAttempt ? "opacity-60 cursor-not-allowed" : "hover:border-red-200 hover:shadow-md"
        } transition-all duration-200 overflow-hidden text-left w-full`}
    >
      <div className="relative w-28 flex-shrink-0 bg-slate-100">
        {item.image && (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />

        <span
          className={`absolute bottom-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full ${item.isFree
              ? "bg-green-100 text-green-800"
              : isPurchased
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-600 text-white"
            }`}
        >
          {item.isFree ? "FREE" : isPurchased ? "PURCHASED" : `₹${item.price}`}
        </span>

        {!item.isFree && !isPurchased && (
          <div className="absolute top-2 right-2 bg-red-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Lock size={12} />
            Paid
          </div>
        )}
      </div>

      <div className="flex-1 p-4 flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-medium px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full">
            {item.displayIn}
          </span>
          {item.status === "published" && (
            <span className="text-xs font-medium px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Live
            </span>
          )}
        </div>

        <h3 className="font-semibold text-base line-clamp-2">{item.title}</h3>

        <div className="flex items-center gap-5 text-xs text-slate-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span>📝</span> <span>{item.totalQuestions} Q</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>⏱</span> <span>{durationMin} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🎯</span> <span>{item.totalMarks} pts</span>
          </div>
          {item.negativeMarking && (
            <div className="flex items-center gap-1.5 text-red-600">
              <span>⚠</span> <span>Negative</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>👥</span>
            <span>{item.totalPurchases ?? 0} attempts</span>
          </div>

          {!item.isFree && (
            <div className="flex items-center gap-2">
              {isPurchased ? (
                <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                  <CheckCircle size={14} /> {remainingAttempts !== null ? `${remainingAttempts} left` : "Unlimited"}
                </span>
              ) : (
                <span className="text-red-600 font-medium group-hover:underline">Buy Now →</span>
              )}
            </div>
          )}

          {item.isFree && <span className="text-green-600 font-medium">Start →</span>}
        </div>
      </div>
    </button>
  );
};

const FilterChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <button
    onClick={onPress}
    className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-colors ${active
        ? "bg-red-600 text-white border-red-600"
        : "bg-white text-slate-700 border-slate-300 hover:border-red-300 hover:text-red-700"
      }`}
  >
    {label}
  </button>
);

// ────────────────────────────────────────────────
//  MAIN COMPONENT
// ────────────────────────────────────────────────

export default function AllQuizzes() {
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState(false);
  const { user } = useAuthStore()
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [bundleLoading, setBundleLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
const [pendingQuiz, setPendingQuiz] = useState<Quiz | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeFilter, setActiveFilter] = useState<"all" | "free" | "paid">("all");
  const [activeSection, setActiveSection] = useState<"quizzes" | "bundles">("quizzes");

  const loaderRef = useRef<HTMLDivElement>(null);


  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [canAttempt, setCanAttempt] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | null>(null);

  // ─── Fetch Quizzes ────────────────────────────────────────
  const fetchQuizzes = useCallback(
    async (page = 1, search = "", append = false) => {
      try {
        if (!append) setLoading(true);
        else setLoadingMore(true);

        const params: any = { page, limit: 12 };
        if (search.trim()) params.search = search.trim();

        const res = await axiosInstance.get("/quiz/quizzes", { params });
        const newData = res.data.data || [];

        setTotalPages(res.data.pagination?.totalPages || 1);
        setCurrentPage(page);
        setQuizzes(append ? (prev) => [...prev, ...newData] : newData);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  // ─── Fetch Bundles ────────────────────────────────────────
  const fetchBundles = useCallback(async () => {
    setBundleLoading(true);
    try {
      const res = await axiosInstance.get("/quiz-bundles");
      setBundles(res.data.data || []);
    } catch (err) {
      console.error("Failed to load bundles:", err);
    } finally {
      setBundleLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes(1, "");
    fetchBundles();
  }, [fetchQuizzes, fetchBundles]);


  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchQuizzes(1, searchQuery);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchQuizzes]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loadingMore && currentPage < totalPages) {
          fetchQuizzes(currentPage + 1, searchQuery, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [currentPage, totalPages, loadingMore, searchQuery, fetchQuizzes]);


  // ─── Check purchase status when quiz is selected ──────────
const checkPurchaseStatus = useCallback(
  async (quiz: Quiz) => {
    if (quiz.isFree) {
      return { purchased: true, canAttempt: true };
    }

    try {
      const res = await axiosInstance.get("/orders/already-purchased", {
        params: { type: "quiz", itemId: quiz.id },
      });

      const { purchased = false, canAttempt = true } = res.data || {};

      setIsPurchased(purchased);
      setCanAttempt(canAttempt);

      return { purchased, canAttempt };
    } catch (err) {
      console.error("Purchase status check failed", err);
      return { purchased: false, canAttempt: false };
    }
  },
  []
);

  // ─── Handle quiz click ────────────────────────────────────
  const handleQuizPress = useCallback(
    (quiz: Quiz) => {
      setSelectedQuiz(quiz);
      checkPurchaseStatus(quiz);
      setShowConfirmModal(true);
    },
    [checkPurchaseStatus]
  );



  const handleBundlePress = (bundle: Bundle) => {
    router.push(`/quiz-bundles/${bundle.id}`);
  };

  // ─── Start quiz after confirmation ────────────────────────
const handleStartQuiz = async () => {
  if (!selectedQuiz) return;

  if (!user) {
    setPendingQuiz(selectedQuiz);
    setShowConfirmModal(false)
    setOpenLogin(true);
    return;
  }

  // ✅ Always re-check purchase before proceeding
const { purchased } = await checkPurchaseStatus(selectedQuiz);

if (selectedQuiz.isFree || purchased) {
  router.push(`/quiz/${selectedQuiz.id}`);
} else {
  initiateRazorpayPayment();
}
  
  setShowConfirmModal(false);
};
  // ─── Razorpay Payment Flow ────────────────────────────────
  const initiateRazorpayPayment = async () => {
    if (paying || !selectedQuiz?.price) return;

    try {
      setPaying(true);
      setPaymentStatus(null);

      const orderRes = await axiosInstance.post("/orders", {
        userId: user?.id,
        type: "quiz",
        itemId: selectedQuiz.id,
        amount: selectedQuiz.price,
      });

      const { razorOrder, key } = orderRes.data.data || orderRes.data;

      const options = {
        key,
        amount: razorOrder.amount,
        currency: "INR",
        name: "Dikshant IAS",
        description: selectedQuiz.title,
        image: "https://dikshantiasnew-web.s3.amazonaws.com/logo.png",
        order_id: razorOrder.id,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.mobile,
        },
        theme: { color: "#B11226" },
        handler: async function (response: any) {
          await verifyPayment(response);
        },
      };

      // @ts-ignore
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      setPaying(false);
      setPaymentStatus("failed");
      setTimeout(() => setPaymentStatus(null), 5000);
    }
  };

  const verifyPayment = async (response: any) => {
    try {
      const verifyRes = await axiosInstance.post("/orders/verify", {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        itemId: selectedQuiz?.id,
        type: "quiz",
      });

      if (verifyRes.data.success) {
        setPaymentStatus("success");
        setIsPurchased(true);
        setCanAttempt(true);
        setTimeout(() => {
          router.push(`/quiz/${selectedQuiz?.id}`);
        }, 1500);
      } else {
        setPaymentStatus("failed");
      }
    } catch (err) {
      console.error("Payment verification failed", err);
      setPaymentStatus("failed");
    } finally {
      setPaying(false);
      setTimeout(() => setPaymentStatus(null), 6000);
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    if (activeFilter === "free") return q.isFree;
    if (activeFilter === "paid") return !q.isFree;
    return true;
  });

  // ──────────────────────────────────────────────────────────
  //  RENDER
  // ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-red-600 to-rose-700 text-white py-5 mt-4 lg:py-8">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 flex flex-col lg:flex-row items-center gap-8">

          {/* Left Content */}
          <div className="lg:w-1/2">

            {/* Live Badge */}
            <div className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded mb-4">
              • LIVE
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold leading-snug mb-4">
              Evaluate Your Prep with All India Live Quiz & <br />
              Daily <span className="text-amber-400">FREE</span> Live Quizzes
            </h1>

            {/* Divider */}
            <div className="border-t border-dashed border-white/30 my-4"></div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-white/90 text-sm mb-6">
              <p>• All India ranking with live tests</p>
              <p>• Performance analysis</p>
              <p>• Daily free quizzes</p>
              <p>• Detailed solutions</p>
            </div>

            {/* CTA */}
            <button className="bg-white text-red-600 hover:bg-gray-100 text-sm font-medium px-5 py-2 rounded shadow-sm transition">
              Get Started
            </button>

          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 flex justify-center relative">

            {/* Soft Glow */}
            <div className="absolute w-52 h-52 bg-white/10 blur-2xl rounded-full"></div>

            <Image
              src={ilustartion}
              alt="student"
              className="w-56 lg:w-full h-full relative z-10"
            />
          </div>

        </div>
      </section>
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 mt-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar – Filters & Navigation */}
        <aside className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 sticky top-8">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center text-white font-bold text-xl">
                D
              </div>
              <div>
                <div className="font-bold text-lg tracking-tight">DIKSHANT</div>
                <div className="text-xs text-red-600 font-semibold">QUIZ of the DAY</div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search quiz..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Section Toggle */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setActiveSection("quizzes")}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeSection === "quizzes"
                    ? "bg-red-50 text-red-700"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <span>Quiz</span>
                <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full">
                  {quizzes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveSection("bundles")}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeSection === "bundles"
                    ? "bg-red-50 text-red-700"
                    : "text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <span>Bundles</span>
                {bundles.length > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2.5 py-0.5 rounded-full">
                    {bundles.length}
                  </span>
                )}
              </button>
            </div>

            {/* Filters – only for quizzes */}
            {activeSection === "quizzes" && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Filter
                </div>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    label="All"
                    active={activeFilter === "all"}
                    onPress={() => setActiveFilter("all")}
                  />
                  <FilterChip
                    label="Free"
                    active={activeFilter === "free"}
                    onPress={() => setActiveFilter("free")}
                  />
                  <FilterChip
                    label="Paid"
                    active={activeFilter === "paid"}
                    onPress={() => setActiveFilter("paid")}
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800">
              {activeSection === "quizzes" ? "QUIZ of the DAY" : "Bundle Packs"}
            </h1>
            <p className="text-slate-600 mt-1">
              {activeSection === "quizzes"
                ? `${filteredQuizzes.length} ${filteredQuizzes.length === 1 ? "quiz" : "quizzes"} available`
                : `${bundles.length} bundle${bundles.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {activeSection === "quizzes" ? (
            <>
              {loading ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                </div>
              ) : filteredQuizzes.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-xl font-medium text-slate-700">No quizzes found</p>
                  <p className="text-slate-500 mt-3">
                    {searchQuery ? "Try different keywords" : "Check back soon for new content"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                  {filteredQuizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      item={quiz}
                      onPress={handleQuizPress}
                      isPurchased={isPurchased && selectedQuiz?.id === quiz.id}
                      remainingAttempts={remainingAttempts}
                      canAttempt={canAttempt}
                    />
                  ))}
                </div>
              )}

              <div ref={loaderRef} className="py-12 flex justify-center text-slate-500 text-sm font-medium">
                {loadingMore && "Loading more quizzes..."}
                {!loadingMore && currentPage < totalPages && "Scroll for more"}
              </div>
            </>
          ) : (
            <>
              {bundleLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                </div>
              ) : bundles.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-xl font-medium text-slate-700">No bundles available yet</p>
                  <p className="text-slate-500 mt-3">Premium collections coming soon</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bundles.map((bundle) => (
                    <BundleCard key={bundle.id} item={bundle} onPress={handleBundlePress} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals / Toasts */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleStartQuiz}
        title={selectedQuiz?.title || ""}
        isFree={selectedQuiz?.isFree || false}
        price={selectedQuiz?.price}
        isPurchased={isPurchased}
        paying={paying}
        paymentStatus={paymentStatus}
      />

      {paymentStatus && (
        <PaymentStatus
          status={paymentStatus}
          message={
            paymentStatus === "success"
              ? "Payment successful! Redirecting to quiz..."
              : "Payment failed. Please try again."
          }
          onClose={() => setPaymentStatus(null)}
        />
      )}
            <DikshantAuthModal open={openLogin} onClose={() => setOpenLogin(false)} />
      
    </div>
  );
}