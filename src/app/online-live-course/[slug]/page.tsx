"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock, Globe, Smartphone, Infinity, Book, PlayIcon,
  CheckCircle, XCircle, Loader2, ArrowRight, Tag,
  GraduationCap, ShieldCheck, Zap, Users, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import parse from "html-react-parser";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuthStore } from "@/lib/store/auth.store";
import DikshantAuthModal from "@/components/auth-model/DikshantAuthModal";
import axiosInstance from "@/lib/axios";

/* ─────────────────── Types ─────────────────── */
interface Subject { id: number; name: string; }
interface Course {
  id: number; name: string; slug: string; imageUrl?: string;
  startDate?: string; endDate?: string; shortDescription?: string;
  longDescription?: string; batchPrice?: number; batchDiscountPrice?: number;
  category?: string; subjects?: Subject[]; isFree?: boolean;
}

/* ─────────────────── PaymentStatus toast ─────────────────── */
const PaymentStatus: React.FC<{ status: "success" | "failed" | "processing" | null }> = ({ status }) => {
  if (!status) return null;
  const cfg = {
    success:    { icon: CheckCircle, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", msg: "Payment successful! Redirecting…" },
    failed:     { icon: XCircle,    color: "#dc2626", bg: "#fef2f2", border: "#fecaca", msg: "Payment failed. Please try again." },
    processing: { icon: Loader2,    color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", msg: "Processing payment…" },
  }[status];
  const Icon = cfg.icon;
  return (
    <div className="fixed top-5 right-5 z-[999] max-w-xs" style={{ animation: "slideIn .3s ease" }}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg" style={{ background: cfg.bg, borderColor: cfg.border }}>
        <Icon size={18} style={{ color: cfg.color }} className={status === "processing" ? "animate-spin" : ""} />
        <p className="text-[13px] font-medium" style={{ color: cfg.color }}>{cfg.msg}</p>
      </div>
    </div>
  );
};

/* ─────────────────── Main Page ─────────────────── */
const CoursePage = () => {
  const { loggedIn, user } = useAuthStore();
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failed" | "processing" | null>(null);
  const [coupons, setCoupons] = useState<any[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  /* fetch course */
  useEffect(() => {
    if (!slug) return;
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${apiUrl}/batchs/slug/${slug}`);
        const data = await res.json();
        setCourse(data);
        if (loggedIn) checkPurchaseStatus(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCourse();
  }, [slug, apiUrl, loggedIn]);

  /* fetch coupons */
  useEffect(() => {
    fetch(`${apiUrl}/coupons`)
      .then(r => r.json()).then(setCoupons).catch(console.error);
  }, [apiUrl]);

  /* purchase check */
  const checkPurchaseStatus = useCallback(async (batch: Course) => {
    if (batch.isFree) { setIsPurchased(true); return; }
    try {
      const res = await axiosInstance.get("/orders/already-purchased", {
        params: { type: "batch", itemId: batch.id },
      });
      const { purchased = false } = res.data || {};
      setIsPurchased(purchased);
    } catch { setIsPurchased(false); }
  }, []);

  const validCoupons = coupons.filter(c => c.isActive && new Date(c.validTill) > new Date());
  const originalPrice = course?.batchDiscountPrice || course?.batchPrice || 0;
  const discount = appliedCoupon
    ? appliedCoupon.discountType === "flat"
      ? appliedCoupon.discount
      : Math.min((originalPrice * appliedCoupon.discount) / 100, appliedCoupon.maxDiscount || Infinity)
    : 0;
  const totalAmount = Math.round(originalPrice - discount);

  const applyCoupon = () => {
    setCouponError("");
    const coupon = validCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
    if (!coupon) { setCouponError("Invalid coupon code"); return; }
    if (originalPrice < (coupon.minPurchase || 0)) { setCouponError(`Min purchase ₹${coupon.minPurchase}`); return; }
    setAppliedCoupon(coupon);
  };

  const initiatePayment = async () => {
    if (!user?.id) { setOpenLogin(true); return; }
    try {
      setPaymentLoading(true);
      setPaymentStatus("processing");
      const orderRes = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, type: "batch", itemId: course?.id,
          amount: originalPrice, gst: 0, couponCode: appliedCoupon?.code || null,
        }),
      });
      if (!orderRes.ok) throw new Error("Order failed");
      const { razorOrder, key } = await orderRes.json();

      const options = {
        key, amount: razorOrder.amount, currency: "INR",
        name: "Dikshant IAS", description: `Enrollment – ${course?.name}`,
        order_id: razorOrder.id,
        prefill: { name: user.name || "", email: user.email || "", contact: user.mobile || "" },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`${apiUrl}/orders/verify`, {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const { success } = await verifyRes.json();
            if (success) {
              setPaymentStatus("success");
              setIsPurchased(true);
              setTimeout(() => router.push("/success-payment"), 1500);
            } else {
              setPaymentStatus("failed");
            }
          } catch { setPaymentStatus("failed"); }
        },
        modal: { ondismiss: () => setPaymentStatus(null) },
      };
      new (window as any).Razorpay(options).open();
    } catch {
      setPaymentStatus("failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!loggedIn || !user) { setOpenLogin(true); return; }
    initiatePayment();
  };

  /* ─── Loading skeleton ─── */
  if (loading) return (
    <div className="course-root max-w-6xl mx-auto px-5 py-10">
      <style>{fonts}</style>
      <Skeleton height={320} borderRadius={16} className="mb-8" />
      <div className="flex gap-8">
        <div className="flex-1"><Skeleton count={6} height={18} className="mb-3" /></div>
        <div className="w-80"><Skeleton height={480} borderRadius={16} /></div>
      </div>
    </div>
  );

  if (!course) return (
    <div className="course-root min-h-screen flex items-center justify-center">
      <style>{fonts}</style>
      <div className="text-center">
        <p className="text-[28px] font-display text-[#0f172a]">Course not found</p>
        <p className="text-[13px] text-[#94a3b8] mt-2">This course may have been removed or moved.</p>
      </div>
    </div>
  );

  const discountPct = course.batchPrice && course.batchDiscountPrice
    ? Math.round(((course.batchPrice - course.batchDiscountPrice) / course.batchPrice) * 100)
    : 0;

  return (
    <>
      <style>{`${fonts}${styles}`}</style>
      <PaymentStatus status={paymentStatus} />

      <div className="course-root">
        {/* ─── HERO BANNER ─── */}
        <div className="hero-banner">
          <div className="hero-noise" />
          <div className="max-w-6xl mx-auto px-5 py-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-10 items-center">
              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge-category">{course.category}</span>
                  {course.isFree && <span className="badge-free">FREE</span>}
                </div>
                <h1 className="hero-title">{course.name}</h1>
                <p className="hero-sub">
                  {course.shortDescription || "A comprehensive preparation course by Dikshant IAS"}
                </p>

                <div className="flex flex-wrap gap-5 mt-6">
                  {[
                    { icon: Book,       text: `${course.subjects?.length || 0} Subjects`     },
                    { icon: Globe,      text: "Hindi Medium"                                  },
                    { icon: Users,      text: "1,200+ Enrolled"                               },
                    { icon: ShieldCheck,text: "Verified Course"                               },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="hero-pill">
                      <Icon size={13} />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {isPurchased && (
                  <button onClick={() => router.push(`/my-course?courseId=${course?.id}&unlocked=true`)} className="go-classroom-btn mt-8">
                    <GraduationCap size={18} />
                    Go to Classroom
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* Hero image */}
              <div className="hero-image-wrap">
                <div className="hero-image-glow" />
                <Image
                  src={course.imageUrl || "/img/Prelims-Foundation-Course.webp"}
                  alt={course.name} width={500} height={500}
                  className="hero-image"
                />
                {discountPct > 0 && !isPurchased && (
                  <div className="discount-badge">{discountPct}% OFF</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── BODY ─── */}
        <div className="max-w-6xl mx-auto px-5 py-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* ── LEFT: Description ── */}
            <div className="flex-1 min-w-0">
              <div className="section-card">
                <h2 className="section-title">Course Overview</h2>
                <div className="prose-content">
                  {parse(course.longDescription || "<p>Course details coming soon.</p>")}
                </div>
              </div>

              {course.subjects && course.subjects.length > 0 && (
                <div className="section-card mt-5">
                  <h2 className="section-title">Subjects Covered</h2>
                  <div className="subjects-grid">
                    {course.subjects.map((sub, i) => (
                      <div key={sub.id} className="subject-chip" style={{ animationDelay: `${i * 0.04}s` }}>
                        <ChevronRight size={11} />
                        {sub.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features row */}
              <div className="features-row mt-5">
                {[
                  { icon: Infinity,   label: "Lifetime Access",      desc: "Study at your own pace, forever"    },
                  { icon: Smartphone, label: "Mobile + Desktop",      desc: "Available on all devices"           },
                  { icon: Zap,        label: "Instant Enrollment",    desc: "Start learning right away"          },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="feature-card">
                    <div className="feature-icon"><Icon size={16} /></div>
                    <p className="feature-label">{label}</p>
                    <p className="feature-desc">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT: Sticky Sidebar ── */}
            <div className="sidebar-sticky">
              <div className="sidebar-card">

                {/* Video preview */}
                <button className="video-thumb" onClick={() => setIsVideoModalOpen(true)}>
                  <Image
                    src={course.imageUrl || "/img/Prelims-Foundation-Course.webp"}
                    alt={course.name} width={600} height={338}
                    className="video-thumb-img"
                  />
                  <div className="video-overlay">
                    <span className="ping-ring" />
                    <div className="play-btn"><PlayIcon size={22} className="text-white" fill="white" /></div>
                  </div>
                  <div className="video-label">Preview Course</div>
                </button>

                <div className="p-5">
                  {/* Price */}
                  {!isPurchased && (
                    <div className="price-row">
                      <span className="price-main">₹{appliedCoupon ? totalAmount : (course.batchDiscountPrice || course.batchPrice)}</span>
                      {course.batchPrice && course.batchDiscountPrice && (
                        <del className="price-original">₹{course.batchPrice}</del>
                      )}
                      {discountPct > 0 && (
                        <span className="price-save">{discountPct}% off</span>
                      )}
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="meta-list">
                    {[
                      { icon: Book,   text: `${course.subjects?.length || 0} Subjects included` },
                      { icon: Clock,  text: `${course.startDate ? new Date(course.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "TBD"} → ${course.endDate ? new Date(course.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Ongoing"}` },
                      { icon: Globe,  text: "Hindi Medium" },
        
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="meta-item">
                        <Icon size={13} className="meta-icon" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA — purchased or not */}
                  {isPurchased ? (
                    <button onClick={() => router.push(`/my-course?courseId=${course?.id}&unlocked=true`)} className="cta-classroom">
                      <GraduationCap size={17} />
                      Go to Classroom
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <>
                      {/* Coupon */}
                      <div className="coupon-wrap">
                        <div className="coupon-row">
                          <Tag size={13} className="text-[#64748b]" />
                          <input
                            type="text"
                            placeholder="Enter coupon code"
                            value={couponCode}
                            onChange={e => { setCouponCode(e.target.value); setCouponError(""); setAppliedCoupon(null); }}
                            className="coupon-input"
                          />
                          <button onClick={applyCoupon} className="coupon-apply-btn">Apply</button>
                        </div>
                        {couponError && <p className="text-[11px] text-red-500 mt-1.5 pl-1">{couponError}</p>}
                        {appliedCoupon && (
                          <p className="text-[11px] text-green-600 mt-1.5 pl-1 flex items-center gap-1">
                            <CheckCircle size={10} /> Coupon applied — saved ₹{Math.round(discount)}
                          </p>
                        )}
                      </div>

                      {/* Summary */}
                      {appliedCoupon && (
                        <div className="price-summary">
                          <div className="summary-row"><span>Subtotal</span><span>₹{originalPrice}</span></div>
                          <div className="summary-row text-green-600"><span>Discount</span><span>−₹{Math.round(discount)}</span></div>
                          <div className="summary-row font-semibold text-[#0f172a] border-t border-[#f1f5f9] pt-2 mt-1">
                            <span>Total</span><span>₹{totalAmount}</span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleBuyNow}
                        disabled={paymentLoading}
                        className={`cta-buy ${paymentLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        {paymentLoading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : <>Enroll Now — ₹{totalAmount} <ArrowRight size={15} /></>}
                      </button>

                      <p className="text-[10.5px] text-center text-[#94a3b8] mt-3">
                        Secure payment via Razorpay · 30-day money-back guarantee
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth modal */}
      <DikshantAuthModal open={openLogin} onClose={() => setOpenLogin(false)} />

      {/* Video modal */}
      {isVideoModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsVideoModalOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsVideoModalOpen(false)}>✕</button>
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
              <Image src={course.imageUrl || "/img/Prelims-Foundation-Course.webp"} alt="" width={800} height={450} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CoursePage;

/* ─────────────────── Fonts ─────────────────── */
const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,600;0,700;1,300&family=DM+Sans:wght@300;400;500;600&display=swap');
  .course-root { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
  .course-root h1, .hero-title { font-family: 'Fraunces', serif; }
`;

/* ─────────────────── Styles ─────────────────── */
const styles = `
  @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

  /* Hero */
  .hero-banner {
    background: linear-gradient(135deg, #0d1b3e 0%, #1a2f6b 50%, #0c1a3a 100%);
    position: relative; overflow: hidden;
  }
  .hero-noise {
    position: absolute; inset: 0; opacity: 0.04;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 150px;
  }
  .hero-title { font-size: clamp(22px, 4vw, 38px); color: #f8fafc; line-height: 1.2; font-weight: 600; margin-bottom: 12px; }
  .hero-sub   { font-size: 13.5px; color: #94a3b8; line-height: 1.7; max-width: 520px; }

  .badge-category {
    display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: .12em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 999px;
    background: rgba(255,255,255,.1); color: #93c5fd; border: 1px solid rgba(147,197,253,.2);
  }
  .badge-free {
    display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; padding: 3px 10px; border-radius: 999px;
    background: #dcfce7; color: #16a34a;
  }
  .hero-pill {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: #cbd5e1;
  }

  .hero-image-wrap { position: relative; flex-shrink: 0; width: 340px; }
  .hero-image-glow {
    position: absolute; inset: -20px; border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,.25) 0%, transparent 70%);
    filter: blur(20px);
  }
  .hero-image { border-radius: 16px; position: relative; z-index: 1; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
  .discount-badge {
    position: absolute; top: -12px; right: -12px; z-index: 2;
    background: #ef4444; color: white; font-size: 11px; font-weight: 700;
    padding: 6px 12px; border-radius: 999px; box-shadow: 0 4px 12px rgba(239,68,68,.4);
  }

  .go-classroom-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white; font-size: 14px; font-weight: 600;
    padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 8px 24px rgba(34,197,94,.35);
    transition: all .2s ease;
  }
  .go-classroom-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(34,197,94,.45); }

  /* Sections */
  .section-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; padding: 24px; }
  .section-title { font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #f8fafc; }

  .prose-content { font-size: 13.5px; color: #475569; line-height: 1.8; }
  .prose-content p { margin-bottom: 12px; }
  .prose-content h2, .prose-content h3 { font-family: 'Fraunces', serif; color: #0f172a; font-weight: 600; margin: 16px 0 8px; }
  .prose-content ul { padding-left: 20px; }
  .prose-content li { margin-bottom: 6px; }

  .subjects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
  .subject-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: #475569; background: #f8fafc;
    border: 1px solid #e9ecef; padding: 7px 12px; border-radius: 8px;
    animation: fadeUp .3s ease both;
  }

  .features-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .feature-card { background: white; border: 1px solid #f1f5f9; border-radius: 14px; padding: 16px; text-align: center; }
  .feature-icon { width: 36px; height: 36px; background: #eef2ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #4f46e5; margin: 0 auto 10px; }
  .feature-label { font-size: 12.5px; font-weight: 600; color: #0f172a; margin-bottom: 3px; }
  .feature-desc  { font-size: 11px; color: #94a3b8; line-height: 1.5; }

  /* Sidebar */
  .sidebar-sticky { width: 320px; flex-shrink: 0; position: sticky; top: 24px; }
  .sidebar-card { background: white; border-radius: 18px; border: 1px solid #e9ecef; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.06); }

  .video-thumb { position: relative; width: 100%; display: block; border: none; padding: 0; background: none; cursor: pointer; }
  .video-thumb-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; }
  .video-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; transition: background .2s; }
  .video-thumb:hover .video-overlay { background: rgba(0,0,0,.45); }
  .ping-ring { position: absolute; width: 64px; height: 64px; background: rgba(239,68,68,.35); border-radius: 50%; animation: ping 1.4s ease-in-out infinite; }
  .play-btn  { position: relative; width: 52px; height: 52px; background: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(239,68,68,.45); }
  .video-label { position: absolute; bottom: 0; left: 0; right: 0; text-align: center; padding: 8px; font-size: 11px; color: white; background: linear-gradient(transparent, rgba(0,0,0,.5)); font-weight: 500; letter-spacing: .05em; }

  @keyframes ping { 0%,100% { transform: scale(1); opacity:.7; } 50% { transform: scale(1.3); opacity:0; } }

  .price-row   { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
  .price-main  { font-size: 28px; font-weight: 700; color: #0f172a; font-family: 'Fraunces', serif; }
  .price-original { font-size: 15px; color: #94a3b8; }
  .price-save  { font-size: 11px; font-weight: 600; color: #16a34a; background: #dcfce7; padding: 2px 8px; border-radius: 999px; }

  .meta-list   { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
  .meta-item   { display: flex; align-items: center; gap: 9px; font-size: 12px; color: #475569; }
  .meta-icon   { color: #94a3b8; flex-shrink: 0; }

  /* Coupon */
  .coupon-wrap { margin-bottom: 14px; }
  .coupon-row  { display: flex; align-items: center; gap: 8px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 12px; background: #f8fafc; }
  .coupon-input { flex: 1; background: none; border: none; outline: none; font-size: 12.5px; color: #0f172a; font-family: 'DM Sans', sans-serif; }
  .coupon-input::placeholder { color: #cbd5e1; }
  .coupon-apply-btn { font-size: 11.5px; font-weight: 600; color: #4f46e5; background: none; border: none; cursor: pointer; white-space: nowrap; }
  .coupon-apply-btn:hover { text-decoration: underline; }

  .price-summary { background: #f8fafc; border-radius: 10px; padding: 12px 14px; margin-bottom: 14px; }
  .summary-row   { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px; }

  /* CTAs */
  .cta-buy {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white; font-size: 14px; font-weight: 600;
    padding: 14px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 6px 20px rgba(239,68,68,.35);
    transition: all .2s ease;
  }
  .cta-buy:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(239,68,68,.45); }

  .cta-classroom {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white; font-size: 14px; font-weight: 600;
    padding: 14px; border-radius: 12px; border: none; cursor: pointer;
    box-shadow: 0 6px 20px rgba(34,197,94,.3);
    transition: all .2s ease;
  }
  .cta-classroom:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(34,197,94,.4); }

  /* Modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-box      { background: #0f172a; border-radius: 20px; width: 100%; max-width: 720px; position: relative; overflow: hidden; }
  .modal-close    { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,.15); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; font-size: 14px; z-index: 2; }

  @media (max-width: 1024px) {
    .sidebar-sticky { width: 100%; position: static; }
    .hero-image-wrap { width: 100%; max-width: 400px; }
    .features-row { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 640px) {
    .features-row { grid-template-columns: 1fr; }
    .subjects-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;