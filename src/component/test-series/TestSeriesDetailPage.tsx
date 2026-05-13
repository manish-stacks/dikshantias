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

type PaymentState =
  | "idle"
  | "processing"
  | "confirmed"
  | "pending"
  | "cancelled"
  | "error";
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
    <div
      className={`border-l-4 rounded-xl p-5 ${c.bg} mb-8 flex gap-4 items-start`}
    >
      <div className="mt-0.5">{c.icon}</div>
      <div>
        <p className={`font-bold text-sm tracking-wide ${c.accent}`}>
          {c.title}
        </p>
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
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
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
      <ArrowRight
        size={16}
        className="relative z-10 transition-transform group-hover:translate-x-1"
      />
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
        if (currentSeries.payment_status === "confirmed")
          setPaymentState("confirmed");
        else if (currentSeries.payment_status === "pending")
          setPaymentState("pending");
        else if (currentSeries.payment_status === "cancelled")
          setPaymentState("cancelled");
      }

      const recRes = await axiosInstance.get(`/new/test-series?page=1&limit=8`);
      const allSeries = recRes.data?.data?.series || [];
      setRecommended(
        allSeries.filter((item: Series) => item.slug !== currentSeries.slug),
      );
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
          <p className="text-xs tracking-[0.3em] text-slate-400 uppercase">
            Loading Series
          </p>
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
    <div
      className="min-h-screen bg-[#FAFAF8] text-slate-800"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
        .serif { font-family: 'Playfair Display', serif; }
        .grid-bg { background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 40px 40px; }
        .red-glow { box-shadow: 0 0 60px rgba(245,158,11,0.2); }
        @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      {/* ───────────────── PREMIUM EDUCATIONAL HERO ───────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-red-50/30">
        {/* BACKGROUND EFFECTS */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 right-0 h-[550px] w-[550px] rounded-full bg-red-200/30 blur-3xl" />

          <div className="absolute bottom-0 left-0 h-[350px] w-[350px] rounded-full bg-orange-100/40 blur-3xl" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right,#000 1px,transparent 1px),linear-gradient(to bottom,#000 1px,transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_430px]">
            {/* ───────────────── LEFT CONTENT ───────────────── */}
            <div className="order-2 lg:order-1">
              {/* TOP BADGES */}
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <div
                  className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-red-100
                    bg-white/80
                    px-5
                    py-2.5
                    shadow-[0_8px_30px_rgba(0,0,0,0.04)]
                    backdrop-blur
                  "
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-red-500">
                    {series.type}
                  </span>
                </div>

                <div
                  className="
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      border-emerald-100
      bg-emerald-50/80
      px-5
      py-2.5
      shadow-[0_8px_30px_rgba(0,0,0,0.04)]
      backdrop-blur
    "
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700">
                    Live Mentorship Program
                  </span>
                </div>
              </div>

              {/* TITLE */}
              <div className="relative max-w-6xl">
                <h1
                  className="
                text-[24px] sm:text-[32px]
                  font-black
                  leading-[1.05]
                  tracking-[-0.03em]
                  text-slate-950
                  sm:text-[42px]
                  lg:text-[56px]
                "
                >
                  {series.title}
                </h1>

                {/* Premium Accent */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-[5px] w-24 rounded-full bg-red-500" />

                  <div className="h-[5px] w-10 rounded-full bg-red-300" />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-8 max-w-4xl">
                <p
                  className="
                 text-[15px]
                leading-8
                sm:text-[17px]
                sm:leading-[2]
              text-slate-600
              text-justify
            "
                >
                  {series.description}
                </p>
              </div>
              {/* STATS */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:gap-5">
                {[
                  {
                    icon: <FileText size={18} />,
                    value: series.total_tests,
                    label: "Tests",
                  },
                  {
                    icon: <Clock size={18} />,
                    value: "180",
                    label: "Minutes",
                  },
                  {
                    icon: <BookOpen size={18} />,
                    value: "UPSC",
                    label: "Mains",
                  },
                  {
                    icon: <Trophy size={18} />,
                    value: "AIR",
                    label: "Ranking",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-slate-200
                bg-white
                px-5
                py-4
                shadow-sm
              "
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-slate-900">
                        {item.value}
                      </h3>

                      <p className="text-xs uppercase tracking-widest text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ───────────────── RIGHT SIDEBAR ───────────────── */}
            <div className="relative order-1 lg:order-2">
              <div
                className="
            sticky
            top-24
            overflow-hidden
            rounded-[20px]
            border
            border-white/70
            bg-white/90
            shadow-[0_25px_80px_rgba(0,0,0,0.08)]
            backdrop-blur
          "
              >
                {/* COURSE IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={series.thumbnail_url}
                    alt={series.title}
                    className="
                      w-full
                      object-contain
                      transition-transform
                      duration-700
                      hover:scale-[1.03]
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* LIVE BADGE */}
                </div>

                {/* CONTENT */}
                <div className="p-5 sm:p-7">
                  {/* PRICE */}
                  <div className="py-2">
                    {/* PRICE ROW */}
                    <div className="mt-3 flex items-end gap-3">
                      <h2
                        className="
                          text-5xl
                          font-black
                          leading-none
                          tracking-[-0.05em]
                          text-slate-950
                        "
                      >
                        {price.label}
                      </h2>

                      {price.original && (
                        <span
                          className="
                            mb-1.5
                            text-xl
                            font-medium
                            text-slate-400
                            line-through
                          "
                        >
                          {price.original}
                        </span>
                      )}

                      {price.discount && (
                        <div
                          className="
                            mb-1.5
                            rounded-full
                            bg-red-50
                            px-3
                            py-1
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-red-500
                          "
                        >
                          {price.discount}% OFF
                        </div>
                      )}
                    </div>

                    {/* SUBTEXT */}
                    <p className="mt-3 text-sm font-medium text-emerald-600">
                      Limited time discounted pricing
                    </p>
                  </div>

                  {/* FEATURES */}
                  <div className="space-y-4 py-7">
                    {[
                      "Detailed Evaluation",
                      "Mentorship Support",
                      "Real Exam Interface",
                      "All India Ranking",
                      "Instant Access",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500" />

                        <span className="text-sm font-medium text-slate-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* PAYMENT BANNER */}
                  <div className="mb-5">
                    <PaymentBanner
                      state={paymentState}
                      onRetry={handleRetry}
                      onDismiss={handleDismiss}
                    />
                  </div>

                  {/* CTA */}
                  <CtaButton
                    series={series}
                    paymentState={paymentState}
                    price={price}
                    onBuy={handleBuy}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEST LIST ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* HEADER */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-500">
              Test Curriculum
            </p>

            <h2
              className="
          text-3xl
          font-black
          tracking-[-0.03em]
          text-slate-950
          lg:text-4xl
        "
            >
              Included Tests
            </h2>
          </div>

          <div
            className="
        rounded-2xl
        bg-slate-100
        px-4
        py-3
      "
          >
            <p className="text-2xl font-black text-slate-950">{tests.length}</p>

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Papers
            </p>
          </div>
        </div>

        {/* TEST LIST */}
        <div className="space-y-4">
          {tests.map((test) => {
            const accessible = test.accessible || unlocked;

            return (
              <div
                key={test.id}
                className="
            group
            rounded-[24px]
            bg-white
            p-5
            shadow-[0_10px_40px_rgba(15,23,42,0.05)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          "
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    {/* NUMBER */}
                    <div
                      className={`
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  text-lg
                  font-black
                  ${
                    accessible
                      ? "bg-red-50 text-red-500"
                      : "bg-slate-100 text-slate-400"
                  }
                `}
                    >
                      {String(test.test_number).padStart(2, "0")}
                    </div>

                    {/* CONTENT */}
                    <div>
                      {/* BADGES */}
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className={`
                      rounded-full
                      px-3
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      ${
                        test.status === "live"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-500"
                      }
                    `}
                        >
                          {test.status}
                        </span>

                        {test.is_free && (
                          <span
                            className="
                        rounded-full
                        bg-red-50
                        px-3
                        py-1
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-red-500
                      "
                          >
                            Free
                          </span>
                        )}
                      </div>

                      {/* TITLE */}
                      <h3
                        className={`
                    max-w-3xl
                    text-lg
                    font-bold
                    leading-7
                    tracking-[-0.02em]
                    ${accessible ? "text-slate-950" : "text-slate-400"}
                  `}
                      >
                        {test.title}
                      </h3>

                      {/* META */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <div
                          className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-slate-50
                      px-3
                      py-2
                    "
                        >
                          <Clock size={13} className="text-red-500" />

                          <span className="text-xs font-semibold text-slate-600">
                            {test.duration_minutes} Min
                          </span>
                        </div>

                        <div
                          className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-slate-50
                      px-3
                      py-2
                    "
                        >
                          <FileText size={13} className="text-red-500" />

                          <span className="text-xs font-semibold text-slate-600">
                            {test.total_marks} Marks
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="lg:shrink-0">
                    {accessible ? (
                      <button
                        className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-slate-950
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition-all
                    duration-300
                    hover:bg-red-500
                  "
                      >
                        <PlayCircle size={16} />
                        Start Test
                      </button>
                    ) : (
                      <button
                        onClick={handleBuy}
                        className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-red-50
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-red-500
                    transition-all
                    duration-300
                    hover:bg-red-500
                    hover:text-white
                  "
                      >
                        <Lock size={15} />
                        Unlock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RECOMMENDED SERIES ───────────────────────────── */}
      {recommended.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
          {/* BACKGROUND EFFECT */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-red-100/40 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-[280px] w-[280px] rounded-full bg-orange-100/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-20">
            {/* HEADER */}
            <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div
                  className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-white
              px-4
              py-2
              shadow-sm
            "
                >
                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                    Explore More
                  </span>
                </div>

                <h2
                  className="
              text-3xl
              font-black
              tracking-[-0.04em]
              text-slate-950
              lg:text-5xl
            "
                >
                  Recommended Series
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
                  Curated UPSC mentorship programs & premium mock test series
                  for serious aspirants.
                </p>
              </div>

              {/* SIDE INFO */}
              <div
                className="
            hidden
            items-center
            gap-4
            rounded-3xl
            bg-white
            px-6
            py-5
            shadow-[0_10px_40px_rgba(15,23,42,0.05)]
            lg:flex
          "
              >
                <div
                  className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-red-50
              text-red-500
            "
                >
                  <BookOpen size={22} />
                </div>

                <div>
                  <h3 className="text-3xl font-black text-slate-950">
                    {recommended.length}
                  </h3>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    Programs
                  </p>
                </div>
              </div>
            </div>

            {/* GRID */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {recommended.map((item) => {
                const itemPrice = formatPrice(item.price, item.discount_price);

                const discount =
                  item.discount_price && item.price
                    ? Math.round(
                        ((Number(item.price) - Number(item.discount_price)) /
                          Number(item.price)) *
                          100,
                      )
                    : 0;

                return (
                  <Link
                    href={`/test-series/${item.slug}`}
                    key={item.id}
                    className="
                group
                overflow-hidden
                rounded-[28px]
                border
                border-slate-200/80
                bg-white
                shadow-[0_10px_40px_rgba(15,23,42,0.04)]
                transition-all
                duration-500
                hover:-translate-y-1.5
                hover:border-red-200
                hover:shadow-[0_20px_70px_rgba(15,23,42,0.10)]
              "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        flex
                        h-52
                        items-center
                        justify-center
                        overflow-hidden
                        bg-white
                      "
                    >

                      {/* IMAGE */}
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="
                          max-h-full
                          w-full
                          object-contain
                          transition-transform
                          duration-700
                          group-hover:scale-[1.03]
                        "
                      />

                      {/* SOFT OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                      {/* TYPE BADGE */}
                      <div className="absolute left-4 top-4">

                        <div
                          className="
                            rounded-full
                            bg-white/90
                            px-3
                            py-1.5
                            shadow-md
                            backdrop-blur
                          "
                        >

                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700">
                            {item.type}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">
                      {/* TITLE */}
                      <h3
                        className="
                    line-clamp-2
                    text-lg
                    font-black
                    leading-7
                    tracking-[-0.02em]
                    text-slate-950
                    transition-colors
                    duration-300
                    group-hover:text-red-500
                  "
                      >
                        {item.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-500">
                        {item.description}
                      </p>

                      {/* META */}
                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <FileText size={14} className="text-red-500" />

                          <span>{item.total_tests} Tests</span>
                        </div>

                        <div
                          className="
                      rounded-full
                      bg-purple-50
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-purple-600
                    "
                        >
                          {item.type}
                        </div>

                        <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />

                          <span>{item.total_live} Live</span>
                        </div>
                      </div>

                      {/* FOOTER */}
                     <div
  className="
    mt-6
    flex
    items-center
    justify-between
    gap-3
    border-t
    border-slate-100
    pt-5
  "
>

  {/* PRICE */}
  <div className="min-w-0">

    <div className="flex items-end gap-2 whitespace-nowrap">

      <h4
        className="
          text-2xl
          font-black
          leading-none
          tracking-tight
          text-slate-950
        "
      >
        {itemPrice.label}
      </h4>

      {itemPrice.original && (
        <span
          className="
            mb-0.5
            text-sm
            font-medium
            text-slate-400
            line-through
          "
        >
          {itemPrice.original}
        </span>
      )}

    </div>

    {discount > 0 && (
      <div
        className="
          mt-2
          inline-flex
          whitespace-nowrap
          rounded-full
          bg-red-50
          px-2.5
          py-1
          text-[10px]
          font-bold
          uppercase
          tracking-[0.15em]
          text-red-500
        "
      >
        {discount}% OFF
      </div>
    )}

  </div>

  {/* BUTTON */}
  <button
    className="
      shrink-0
      flex
      items-center
      gap-2
      whitespace-nowrap
      rounded-2xl
      bg-red-500
      px-4
      py-3
      text-sm
      font-bold
      text-white
      transition-all
      duration-300
      group-hover:bg-slate-950
    "
  >

    Buy Now

    <ArrowRight
      size={14}
      className="
        transition-transform
        duration-300
        group-hover:translate-x-1
      "
    />

  </button>

</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
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
