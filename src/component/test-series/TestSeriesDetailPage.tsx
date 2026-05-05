"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/lib/store/auth.store";
import {
  ArrowLeft,
  Clock,
  Download,
  FileText,
  Lock,
  Trophy,
  Upload,
  CheckCircle,
  X,
  ChevronRight,
  Timer,
  Award,
  BarChart,
  Shield,
  Users,
  Zap,
  Star,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";

export default function TestSeriesDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPurchased = searchParams.get("purchased") === "true";
  const { user } = useAuthStore();

  const [testSeries, setTestSeries] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | null>(null);
  const [downloadModal, setDownloadModal] = useState({ visible: false, title: "", progress: 0 });
  const [uploadModal, setUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);
  const [timeUntilEnd, setTimeUntilEnd] = useState<number | null>(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [alert, setAlert] = useState<{ visible: boolean; title: string; message: string }>({
    visible: false, title: "", message: "",
  });


  useEffect(() => {
    if (!id) { router.back(); return; }
    fetchTestSeries();
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (testSeries && initialPurchased) calculateSubmissionTimers();
  }, [currentTime, testSeries, initialPurchased]);


  //   const checkPurchases = useCallback(async (items: TestSeriesItem[]) => {
  //     if (!items.length) return;
  //     const map: Record<string | number, boolean> = {};
  //     await Promise.all(
  //         items.map(async (item) => {
  //             try {
  //                 const res = await axiosInstance.get("/orders/already-purchased", {
  //                     params: { itemId: item.id, type: "test" },
  //                 });
  //                 map[item.id] = !!res.data?.purchased;
  //             } catch {
  //                 map[item.id] = false;
  //             }
  //         })
  //     );
  //     setPurchasedMap((prev) => ({ ...prev, ...map }));
  // }, []);

  const calculateSubmissionTimers = () => {
    const now = currentTime.getTime();
    const start = new Date(testSeries?.AnswerSubmitDateAndTime || "").getTime();
    const end = new Date(testSeries?.AnswerLastSubmitDateAndTime || "").getTime();
    if (now < start) { setTimeUntilStart(start - now); setTimeUntilEnd(null); setCanSubmit(false); }
    else if (now >= start && now < end) { setTimeUntilStart(null); setTimeUntilEnd(end - now); setCanSubmit(true); }
    else { setTimeUntilStart(null); setTimeUntilEnd(null); setCanSubmit(false); }
  };

  const formatTime = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const fetchTestSeries = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/testseriess/user/${id}`);
      console.log(res.data)
      setTestSeries(res.data?.data);
    } catch {
      setAlert({ visible: true, title: "Error", message: "Failed to load test series details" });
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async () => {
    if (!testSeries || paying) return;
    setPaying(true);
    setPaymentStatus(null);
    try {
      const res = await axiosInstance.post("/orders", {
        userId: user?.id,
        type: "test",
        itemId: testSeries.id,
        amount: testSeries.discountPrice || testSeries.price,
      });
      const { razorOrder, key } = res.data?.data || res.data;
      const options = {
        key,
        amount: razorOrder.amount,
        currency: "INR",
        name: "Dikshant IAS",
        description: testSeries.title,
        image: "https://dikshantiasnew-web.s3.amazonaws.com/logo.png",
        order_id: razorOrder.id,
        prefill: { name: user?.name || "", email: user?.email || "", contact: user?.phone || "" },
        theme: { color: "#dc2626" },
        handler: async (response: any) => { await verifyPayment(response); },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
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

  const verifyPayment = async (response: any) => {
    try {
      await axiosInstance.post("/orders/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
      setPaymentStatus("success");
      setTimeout(() => { setPaymentStatus(null); router.replace("/testseries"); }, 3500);
    } catch {
      setPaymentStatus("failed");
      setTimeout(() => setPaymentStatus(null), 4000);
    } finally {
      setPaying(false);
    }
  };

  const downloadFile = async (url: string, title: string) => {
    try {
      setDownloadModal({ visible: true, title, progress: 0 });
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const total = parseInt(res.headers.get("content-length") || "0", 10);
      const reader = res.body?.getReader();
      if (!reader) throw new Error();
      let received = 0;
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          setDownloadModal((p) => ({ ...p, progress: total ? Math.round((received / total) * 100) : 50 }));
        }
      }
      const blob = new Blob(chunks);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      setDownloadModal({ visible: false, title: "", progress: 0 });
      setAlert({ visible: true, title: "Success", message: "File downloaded successfully!" });
    } catch {
      setDownloadModal({ visible: false, title: "", progress: 0 });
      setAlert({ visible: true, title: "Error", message: "Failed to download file" });
    }
  };

  const handleFileChange = (file: File | null | undefined) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setAlert({ visible: true, title: "Error", message: "Only PDF files are allowed" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setAlert({ visible: true, title: "Error", message: "File size must be less than 50MB" });
      return;
    }
    setSelectedFile(file);
  };

  const uploadAnswerSheet = async () => {
    if (!selectedFile || !testSeries) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("answerSheet", selectedFile);
      formData.append("testSeriesId", testSeries.id);
      formData.append("userId", user?.id || "");
      await axiosInstance.post(`/testseriess/${testSeries.id}/submit-answer`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => setUploadProgress(Math.round((p.loaded * 100) / (p.total || 1))),
      });
      setUploading(false);
      setUploadModal(false);
      setSelectedFile(null);
      setAlert({ visible: true, title: "Success", message: "Answer sheet uploaded successfully!" });
    } catch (err: any) {
      setUploading(false);
      setAlert({ visible: true, title: "Error", message: err.response?.data?.message || "Upload failed" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!testSeries) return null;

  const hasDiscount = testSeries.discountPrice < testSeries.price;
  const actualPrice = hasDiscount ? testSeries.discountPrice : testSeries.price;
  const originalPrice = hasDiscount ? testSeries.price : null;
  const savingsPercent = originalPrice ? Math.round(((originalPrice - actualPrice) / originalPrice) * 100) : 0;
  const hasSubmitted = testSeries.hasSubmitted || false;
  const hasResult = Boolean(testSeries.resultGenerated);
  const validTill = testSeries.expirSeries
    ? new Date(testSeries.expirSeries).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  const features = [
    { icon: FileText, label: "Full Length Mock Tests" },
    { icon: BarChart, label: "Performance Analytics" },
    { icon: BadgeCheck, label: "Expert Evaluated Answers" },
    { icon: CalendarDays, label: `Valid till ${validTill}` },
    { icon: Zap, label: "Instant Access After Purchase" },
    { icon: Shield, label: "Secure & Encrypted" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-7xl mx-auto">

      {/* Hero */}
      {/* Hero */}
      <div className="relative w-full mt-4 aspect-video max-h-[300px] overflow-hidden rounded-2xl">

        <Image
          src={testSeries.imageUrl}
          alt={testSeries.title}
          fill
          className="object-cover"
          priority
        />

        {/* Soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Top actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">

          <button
            onClick={() => router.back()}
            className="bg-white/90 p-2 rounded-lg shadow-sm"
          >
            <ArrowLeft size={16} className="text-gray-800" />
          </button>

          {!initialPurchased && (
            <button
              onClick={initiatePayment}
              disabled={paying}
              className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-sm disabled:opacity-70"
            >
              {paying ? "..." : "Buy"}
            </button>
          )}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">

          {/* Badges */}
          <div className="flex gap-2 mb-2">
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
              2026
            </span>
            <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full">
              {testSeries.status || "Premium"}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-white text-base md:text-lg font-semibold leading-snug line-clamp-2">
            {testSeries.title}
          </h1>

          {/* Info */}
          <div className="flex gap-3 mt-2 text-[11px] text-white/90">
            <span>{testSeries.timeDurationForTest || "?"} min</span>
            <span>•</span>
            <span>{testSeries.type || "Test"}</span>
            <span>•</span>
            <span>{validTill}</span>
          </div>

        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-red-50 border-b border-red-100 px-5 py-2.5 flex items-center gap-4 overflow-x-auto no-scrollbar">
        {[
          { icon: Users, text: "1000+ Students Enrolled" },
          { icon: Shield, text: "Secure Payment" },
          { icon: Zap, text: "Instant Access" },
          { icon: Star, text: "Expert Evaluated" },
        ].map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-red-700 text-[11px] font-medium whitespace-nowrap shrink-0">
            <Icon size={12} />{text}
          </span>
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Overview</h2>
          <p className="text-xs text-gray-600 leading-relaxed">{testSeries.description}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Clock, label: "Duration", value: `${testSeries.timeDurationForTest || "?"}m`, color: "text-blue-600", bg: "bg-blue-50" },
            { icon: FileText, label: "Type", value: testSeries.type || "Written", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Award, label: "Pass Marks", value: testSeries.passing_marks || "—", color: "text-green-600", bg: "bg-green-50" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-3.5 text-center">
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon size={15} className={color} />
              </div>
              <div className="text-[10px] text-gray-500">{label}</div>
              <div className={`text-sm font-bold mt-0.5 ${color} capitalize`}>{value}</div>
            </div>
          ))}
        </div>

        {/* What you'll get */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">What You'll Get</h2>
          <div className="grid grid-cols-2 gap-2">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2.5">
                <CheckCircle size={13} className="text-green-500 shrink-0" />
                <span className="text-xs text-gray-700 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Schedule</h2>
          <div className="space-y-3">
            {[
              {
                label: "Test Date",
                value: new Date(testSeries.testStartDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
                urgent: false,
              },
              {
                label: "Starts At",
                value: new Date(testSeries.testStartTime).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
                urgent: false,
              },
              {
                label: "Submission Opens",
                value: new Date(testSeries.AnswerSubmitDateAndTime).toLocaleString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
                urgent: false,
              },
              {
                label: "Last Submission",
                value: new Date(testSeries.AnswerLastSubmitDateAndTime).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
                urgent: true,
              },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg px-3 py-2.5 ${item.urgent ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.urgent ? "bg-red-500" : "bg-gray-400"}`} />
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-500">{item.label}</div>
                  <div className={`text-xs font-semibold leading-snug mt-0.5 ${item.urgent ? "text-red-700" : "text-gray-800"}`}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown timers (purchased only) */}
        {initialPurchased && !hasSubmitted && !hasResult && (
          <div className="grid grid-cols-1 gap-3">
            {timeUntilStart !== null && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock size={15} className="text-amber-600" />
                </div>
                <div>
                  <div className="text-[10px] text-amber-700 font-medium">Submission opens in</div>
                  <div className="text-sm font-bold text-amber-800">{formatTime(timeUntilStart)}</div>
                </div>
              </div>
            )}
            {timeUntilEnd !== null && canSubmit && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <Timer size={15} className="text-red-600" />
                </div>
                <div>
                  <div className="text-[10px] text-red-700 font-medium">Time left to submit</div>
                  <div className="text-sm font-bold text-red-800">{formatTime(timeUntilEnd)}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Result card */}
        {initialPurchased && hasResult && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Trophy size={18} className="text-green-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-green-800">Result Announced!</div>
                <div className="text-[11px] text-green-600 mt-0.5">Your performance is ready</div>
              </div>
            </div>
            <button
              onClick={() => router.push(`/result?submissionId=${testSeries?.submissionId || ""}`)}
              className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              View Score <BarChart size={13} />
            </button>
          </div>
        )}

        {/* Already submitted */}
        {initialPurchased && hasSubmitted && !hasResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <div className="text-xs font-semibold text-green-800">Answer sheet submitted. Result coming soon.</div>
          </div>
        )}

        {/* Materials */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Test Materials</h2>
          {initialPurchased ? (
            <div className="space-y-2">
              {testSeries.questionPdf && (
                <button
                  onClick={() => downloadFile(testSeries.questionPdf, "Question Paper")}
                  className="w-full flex items-center gap-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 p-3.5 rounded-xl transition-colors group"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-semibold text-gray-900">Question Paper</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Click to download PDF</div>
                  </div>
                  <Download size={15} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              )}
              {testSeries.answerkey && (
                <button
                  onClick={() => downloadFile(testSeries.answerkey, "Answer Key")}
                  className="w-full flex items-center gap-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 p-3.5 rounded-xl transition-colors group"
                >
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-semibold text-gray-900">Answer Key</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">Click to download PDF</div>
                  </div>
                  <Download size={15} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                </button>
              )}
              {!testSeries.questionPdf && !testSeries.answerkey && (
                <p className="text-xs text-gray-400 text-center py-4">Materials will be uploaded before the test.</p>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-4">
              <Lock size={16} className="text-red-500 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-red-800">Locked</div>
                <div className="text-[11px] text-red-600 mt-0.5">Purchase to access question papers & answer keys</div>
              </div>
            </div>
          )}
        </div>

        {/* Why choose */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-red-900 mb-3">Why Choose This Series?</h2>
          <div className="space-y-2">
            {[
              "Modelled after actual UPSC pattern",
              "Detailed evaluation by experienced faculty",
              "Track & compare with top scorers",
              "Access anytime, anywhere on all devices",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle size={10} className="text-red-600" />
                </div>
                <span className="text-xs text-red-800">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          {!initialPurchased ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-gray-900">₹{actualPrice}</span>
                  {originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
                  )}
                  {savingsPercent > 0 && (
                    <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">{savingsPercent}% OFF</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-gray-400">+18% GST</span>
                  <span className="text-[10px] text-gray-400">·</span>
                  <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                    <Users size={9} />1000+ enrolled
                  </span>
                </div>
              </div>
              <button
                onClick={initiatePayment}
                disabled={paying}
                className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shrink-0"
              >
                {paying ? "Processing..." : "Buy Now"}
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div>
              {hasResult ? (
                <button
                  onClick={() => router.push(`/result/${testSeries?.subsmissionId || ""}`)}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Trophy size={16} />View My Result
                </button>
              ) : hasSubmitted ? (
                <div className="h-11 bg-gray-100 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Answer Sheet Submitted</span>
                </div>
              ) : (
                <button
                  onClick={() => canSubmit && !hasSubmitted && setUploadModal(true)}
                  disabled={!canSubmit}
                  className={`w-full h-11 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors ${canSubmit ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                >
                  <Upload size={16} />
                  {!canSubmit
                    ? timeUntilStart !== null
                      ? `Submission opens in ${formatTime(timeUntilStart)}`
                      : "Submission Closed"
                    : "Submit Answer Sheet"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Download Modal */}
      {downloadModal.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download size={22} className="text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Downloading...</h3>
            <p className="text-xs text-gray-500 mb-4">{downloadModal.title}</p>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-600 transition-all duration-300 rounded-full" style={{ width: `${downloadModal.progress}%` }} />
            </div>
            <div className="text-xs font-semibold text-blue-600">{downloadModal.progress}%</div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Upload Answer Sheet</h3>
                <p className="text-[11px] text-gray-500 mt-0.5">PDF only · Max 50MB</p>
              </div>
              <button onClick={() => !uploading && setUploadModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {timeUntilEnd !== null && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
                  <Timer size={13} className="text-red-600 shrink-0" />
                  <span className="text-xs font-medium text-red-700">Time remaining: {formatTime(timeUntilEnd)}</span>
                </div>
              )}

              <label
                className={`block rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-red-400 bg-red-50" : selectedFile ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-red-300 hover:bg-red-50/30"}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileChange(e.dataTransfer.files?.[0]); }}
              >
                <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e.target.files?.[0])} className="hidden" disabled={uploading} />
                {selectedFile ? (
                  <>
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <FileText size={18} className="text-green-600" />
                    </div>
                    <div className="text-xs font-semibold text-gray-900 line-clamp-1">{selectedFile.name}</div>
                    <div className="text-[11px] text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                    <div className="text-[11px] text-blue-600 font-medium mt-2">Click to change</div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Upload size={18} className="text-gray-500" />
                    </div>
                    <div className="text-xs font-semibold text-gray-800">Drop PDF here or click to browse</div>
                    <div className="text-[11px] text-gray-400 mt-1">PDF only · Max 50MB</div>
                  </>
                )}
              </label>

              {uploading && (
                <div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <div className="text-center mt-2 text-xs font-semibold text-red-600">Uploading... {uploadProgress}%</div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => !uploading && setUploadModal(false)}
                  disabled={uploading}
                  className="flex-1 h-10 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={uploadAnswerSheet}
                  disabled={!selectedFile || uploading}
                  className={`flex-1 h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${selectedFile && !uploading ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  <Upload size={13} />
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment feedback */}
      {paymentStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-xl">
            <div className="text-5xl mb-4">{paymentStatus === "success" ? "🎉" : "❌"}</div>
            <h3 className="text-base font-bold text-gray-900 mb-2">
              {paymentStatus === "success" ? "Enrolled Successfully!" : "Payment Failed"}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              {paymentStatus === "success"
                ? "You now have full access to this test series."
                : "No money was deducted. Please try again."}
            </p>
            <button
              onClick={() => setPaymentStatus(null)}
              className="h-10 px-8 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Alert */}
      {alert.visible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full shadow-xl">
            <div className="text-4xl mb-3">{alert.title === "Success" ? "✅" : "⚠️"}</div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">{alert.title}</h3>
            <p className="text-xs text-gray-600 mb-5">{alert.message}</p>
            <button
              onClick={() => setAlert({ visible: false, title: "", message: "" })}
              className="h-10 px-8 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}