"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import {
  BookOpen,
  Clock,
  FileText,
  PlayCircle,
  Lock,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  XCircle,
  ArrowRight,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import DikshantAuthModal from "@/components/auth-model/DikshantAuthModal";
import { useAuthStore } from "@/lib/store/auth.store";

interface TestItem {
  id: string;
  title: string;
  test_number: number;
  type: string;
  status: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
  accessible: boolean;
}

interface Series {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string;
  total_tests: number;
  price: string;
  discount_price: string;
  thumbnail_url: string;
  tests: TestItem[];
  is_purchased: boolean;
  payment_status?: "confirmed" | "pending" | "cancelled" | null;
}

type PaymentState = "idle" | "processing" | "confirmed" | "pending" | "cancelled" | "error";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN";
const formatPrice = (price: string, discountPrice?: string) => {
  const p = Number(price);
  const d = discountPrice ? Number(discountPrice) : null;
  if (p === 0) return { label: "FREE", original: null, discount: null };
  if (d && d < p) {
    return {
      label: `₹${d.toLocaleString()}`,
      original: `₹${p.toLocaleString()}`,
      discount: Math.round(((p - d) / p) * 100),
    };
  }
  return { label: `₹${p.toLocaleString()}`, original: null, discount: null };
};

// ─── Payment Status Banner ────────────────────────────────────────────────────
const PaymentBanner = ({
  state,
  onRetry,
  onDismiss,
}: {
  state: PaymentState;
  onRetry?: () => void;
  onDismiss?: () => void;
}) => {
  if (state === "idle" || state === "processing") return null;

  const config = {
    confirmed: {
      bg: "bg-emerald-50 border-emerald-500",
      icon: <CheckCircle2 size={20} className="text-emerald-600" />,
      title: "Payment Confirmed",
      msg: "Your purchase is complete. All tests are now unlocked.",
      accent: "text-emerald-700",
      action: null,
    },
    pending: {
      bg: "bg-red-50 border-red-400",
      icon: <Hourglass size={20} className="text-red-600" />,
      title: "Payment Pending",
      msg: "Your payment is being verified. This usually takes a few minutes. Refresh to check status.",
      accent: "text-red-700",
      action: (
        <button
          onClick={onDismiss}
          className="mt-3 rounded-lg border border-red-500 px-4 py-2 text-xs font-bold tracking-widest text-red-600 uppercase hover:bg-red-500 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      ),
    },
    cancelled: {
      bg: "bg-red-50 border-red-400",
      icon: <XCircle size={20} className="text-red-500" />,
      title: "Payment Cancelled",
      msg: "Your payment was not completed. No charges were made.",
      accent: "text-red-700",
      action: (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg border border-red-400 px-4 py-2 text-xs font-bold tracking-widest text-red-600 uppercase hover:bg-red-500 hover:text-white transition-colors"
        >
          Try Again
        </button>
      ),
    },
    error: {
      bg: "bg-red-50 border-red-400",
      icon: <AlertCircle size={20} className="text-red-500" />,
      title: "Something Went Wrong",
      msg: "An error occurred during payment. Please try again or contact support.",
      accent: "text-red-700",
      action: (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg border border-red-400 px-4 py-2 text-xs font-bold tracking-widest text-red-600 uppercase hover:bg-red-500 hover:text-white transition-colors"
        >
          Retry
        </button>
      ),
    },
  };

  const c = config[state as keyof typeof config];
  if (!c) return null;

  return (
    <div className={`border-l-4 rounded-xl p-5 ${c.bg} mb-8 flex gap-4 items-start`}>
      <div className="mt-0.5">{c.icon}</div>
      <div>
        <p className={`font-bold text-sm tracking-wide ${c.accent}`}>{c.title}</p>
        <p className="text-slate-600 text-sm mt-1">{c.msg}</p>
        {c.action}
      </div>
    </div>
  );
};

// ─── CTA Button ───────────────────────────────────────────────────────────────
const CtaButton = ({
  series,
  paymentState,
  price,
  onBuy,
}: {
  series: Series;
  paymentState: PaymentState;
  price: ReturnType<typeof formatPrice>;
  onBuy: () => void;
}) => {
  if (series.is_purchased || paymentState === "confirmed") {
    return (
      <button className="group flex items-center gap-3 rounded-2xl bg-emerald-500 px-8 py-4 font-bold text-black transition-all hover:bg-emerald-400">
        <CheckCircle2 size={20} />
        <span>Purchased — Start Now</span>
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </button>
    );
  }

  if (paymentState === "pending") {
    return (
      <button
        disabled
        className="flex items-center gap-3 rounded-2xl bg-red-100 border border-red-300 px-8 py-4 font-bold text-red-700 cursor-not-allowed"
      >
        <Hourglass size={20} className="animate-pulse" />
        Payment Pending…
      </button>
    );
  }

  if (paymentState === "processing") {
    return (
      <button
        disabled
        className="flex items-center gap-3 rounded-2xl bg-red-500 px-8 py-4 font-bold text-black opacity-80 cursor-not-allowed"
      >
        <div className="h-5 w-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
        Processing…
      </button>
    );
  }

  return (
    <button
      onClick={onBuy}
      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-red-400 px-8 py-4 font-bold text-white transition-all hover:bg-red-300 active:scale-95"
    >
      <span className="relative z-10">
        {price.label === "FREE" ? "Enroll Free" : `Buy Now · ${price.label}`}
      </span>
      <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" />
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TestSeriesDetailPage = ({ slug }: { slug: string }) => {
  const [series, setSeries] = useState<Series | null>(null);
  const [recommended, setRecommended] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [open, setOpen] = useState(false);
  const { loggedIn, user } = useAuthStore();
const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fetchSeries = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/new/test-series/${slug}`);
      const currentSeries = res.data.data.series;
      setSeries(currentSeries);

      // Sync payment_status from server if present
      if (currentSeries.payment_status) {
        if (currentSeries.payment_status === "confirmed") setPaymentState("confirmed");
        else if (currentSeries.payment_status === "pending") setPaymentState("pending");
        else if (currentSeries.payment_status === "cancelled") setPaymentState("cancelled");
      }

      const recRes = await axiosInstance.get(`/new/test-series?page=1&limit=8`);
      const allSeries = recRes.data?.data?.series || [];
      setRecommended(allSeries.filter((item: Series) => item.slug !== currentSeries.slug));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchSeries();
  }, [slug]);

  const handleBuy = async () => {
    if (!series) return;
    if (!loggedIn || !user) {
      setOpen(true);
      return;
    }

    try {
      setPaymentState("processing");

      const res = await axiosInstance.post("/new/purchases", {
        purchase_type: "series",
        series_id: series.id,
      });

      const data = res.data.data;

if (data.free) {
  setPaymentState("confirmed");
  setShowSuccessModal(true);

  fetchSeries();
  return;
}

      const options = {
        key: data.key_id,
        amount: data.amount * 100,
        currency: "INR",
        name: "Dikshant IAS",
        description: data.item_title,
        order_id: data.order_id,

  handler: async function (payment: any) {
  try {
    setPaymentState("pending");

    await axiosInstance.post("/new/purchases/verify", {
      razorpay_order_id: payment.razorpay_order_id,
      razorpay_payment_id: payment.razorpay_payment_id,
      razorpay_signature: payment.razorpay_signature,
      purchase_id: data.purchase_id,
    });

    setPaymentState("confirmed");
    setShowSuccessModal(true);

    fetchSeries();
  } catch {
    setPaymentState("error");
  }
},

        modal: {
          ondismiss: () => {
            setPaymentState("cancelled");
          },
        },

        theme: { color: "#F59E0B" },
      };

      const razor = new (window as any).Razorpay(options);

      razor.on("payment.failed", () => {
        setPaymentState("cancelled");
      });

      razor.open();
    } catch (err: any) {
      setPaymentState("error");
    }
  };

  const handleRetry = () => {
    setPaymentState("idle");
    handleBuy();
  };

  const handleDismiss = () => {
    setPaymentState("idle");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
          <p className="text-xs tracking-[0.3em] text-slate-400 uppercase">Loading Series</p>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#FAFAF8] text-slate-400">
        <AlertCircle size={40} className="mb-4 text-slate-600" />
        <p className="text-lg font-semibold text-slate-600">Series not found</p>
      </div>
    );
  }

  const price = formatPrice(series.price, series.discount_price);
  const tests = series.tests || [];
  const unlocked = series.is_purchased || paymentState === "confirmed";

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        .grid-bg { background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 40px 40px; }
        .red-glow { box-shadow: 0 0 60px rgba(245,158,11,0.2); }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <div className="relative grid-bg border-b border-black/5">
        {/* Accent blob */}
        <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-red-300/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-14 lg:grid-cols-[1fr_420px]">
            {/* LEFT */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full border border-red-400/60 bg-red-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                  {series.type}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-red-400/20 to-transparent" />
              </div>

              <h1 className="serif text-5xl font-black leading-[1.1] text-slate-900 lg:text-6xl">
                {series.title}
              </h1>

              <p className="mt-6 max-w-xl leading-relaxed text-slate-500">{series.description}</p>

              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { icon: <FileText size={15} />, label: `${series.total_tests} Tests` },
                  { icon: <Clock size={15} />, label: "180 Min / Test" },
                  { icon: <BookOpen size={15} />, label: "UPSC Mains" },
                  { icon: <Trophy size={15} />, label: "Ranked Leaderboard" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="text-red-400">{stat.icon}</span>
                    {stat.label}
                  </div>
                ))}
              </div>

              {/* PRICE */}
              <div className="mt-10">
                {price.label === "FREE" ? (
                  <div className="text-5xl font-black text-emerald-400">FREE</div>
                ) : (
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="text-5xl font-black text-slate-900">{price.label}</div>
                    {price.original && (
                      <div className="mb-1 text-2xl font-medium text-slate-600 line-through">
                        {price.original}
                      </div>
                    )}
                    {price.discount && (
                      <div className="mb-1 rounded-full bg-red-400 px-3 py-1 text-xs font-black text-black">
                        {price.discount}% OFF
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PAYMENT BANNER */}
              <div className="mt-6">
                <PaymentBanner state={paymentState} onRetry={handleRetry} onDismiss={handleDismiss} />
              </div>

              {/* CTA */}
              <div className="mt-4">
                <CtaButton series={series} paymentState={paymentState} price={price} onBuy={handleBuy} />
              </div>
            </div>

            {/* RIGHT — Thumbnail */}
            <div className="relative">
              <div className="red-glow overflow-hidden rounded-3xl border border-black/10">
                <img
                  src={series.thumbnail_url}
                  alt={series.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Floating stat pill */}
              <div className="absolute -bottom-4 -left-4 rounded-2xl border border-black/8 bg-white px-5 py-3 shadow-xl">
                <p className="text-xs text-slate-400 uppercase tracking-widest">Total Tests</p>
                <p className="text-2xl font-black text-red-500">{series.total_tests}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TEST LIST ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between border-b border-black/5 pb-6">
          <div>
            <p className="mb-1 text-xs uppercase tracking-[0.25em] text-red-600">Curriculum</p>
            <h2 className="serif text-4xl font-black text-slate-900">Included Tests</h2>
          </div>
          <p className="text-sm text-slate-400">{tests.length} papers total</p>
        </div>

        <div className="space-y-3">
          {tests.map((test, idx) => {
            const accessible = test.accessible || unlocked;
            return (
              <div
                key={test.id}
                className={`group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6 transition-all lg:flex-row lg:items-center lg:justify-between ${
                  accessible
                    ? "border-slate-200 bg-white hover:border-red-300 hover:shadow-md"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                {/* Left accent line */}
                {accessible && (
                  <div className="absolute left-0 top-0 h-full w-[3px] rounded-l-2xl bg-red-400 opacity-0 transition-opacity group-hover:opacity-100" />
                )}

                <div className="flex items-start gap-5">
                  {/* Number */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                      accessible ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {String(test.test_number).padStart(2, "0")}
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          test.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {test.status}
                      </span>
                      {test.is_free && (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                          Free
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-semibold ${accessible ? "text-slate-900" : "text-slate-400"}`}>
                      {test.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} /> {test.duration_minutes} min
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FileText size={11} /> {test.total_marks} marks
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lg:shrink-0">
                  {accessible ? (
                    <button className="flex items-center gap-2 rounded-xl bg-red-400 px-5 py-2.5 text-sm font-bold text-black transition-all hover:bg-red-300 active:scale-95">
                      <PlayCircle size={15} />
                      Start Test
                    </button>
                  ) : (
                    <button
                      onClick={handleBuy}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:border-red-300 hover:text-red-600"
                    >
                      <Lock size={14} />
                      Unlock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RECOMMENDED ───────────────────────────────────────────── */}
      {recommended.length > 0 && (
        <div className="border-t border-black/5 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="mb-10">
              <p className="mb-1 text-xs uppercase tracking-[0.25em] text-red-600">Explore More</p>
              <h2 className="serif text-4xl font-black text-slate-900">Recommended Series</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {recommended.map((item) => {
                const itemPrice = formatPrice(item.price, item.discount_price);
                return (
                  <Link
                    href={`/test-series/${item.slug}`}
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-red-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute left-3 top-3 rounded-full border border-white/40 bg-white/70 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-700 backdrop-blur">
                        {item.type}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-2 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">{item.total_tests} Tests</p>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <div className="text-lg font-black text-red-500">{itemPrice.label}</div>
                          {itemPrice.original && (
                            <div className="text-xs text-slate-400 line-through">{itemPrice.original}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition-colors group-hover:text-red-600">
                          View <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
{/* Payment Success Modal */}
{showSuccessModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
      
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={42} className="text-emerald-600" />
        </div>

        <h2 className="text-3xl font-black text-slate-900">
          Payment Successful 🎉
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Your test series has been unlocked successfully.
          <br />
          Download the Dikshant App for the best test experience.
        </p>

        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-red-500 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-red-600"
        >
          Download App from Play Store
        </a>

       
      </div>
    </div>
  </div>
)}
      <DikshantAuthModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default TestSeriesDetailPage;