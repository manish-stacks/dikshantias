"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle, Smartphone, Monitor, KeyRound, ArrowRight, Star } from "lucide-react";
import imageApp from "./image.png"
const APP_IMAGE = "https://play-lh.googleusercontent.com/8t9ubLdrdFMr8DH8a8SX3wgDtlbwBH3QZppcKonz0zcupwNDy3C4jgkuU_rIfBl1NMLN6BfVZxyG_VUNV9OcxQ=w2560-h1440-rw";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=in.kaksya.dikshant&hl=en_IN";
const WEB_COURSES_URL = "/profile/courses";

const Page = () => {
  const router = useRouter();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .sp-root { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
        .sp-root h1, .sp-root h2 { font-family: 'Fraunces', serif; }

        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.6); }
          70%  { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes ringPulse {
          0%   { transform: scale(1); opacity: .6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes confetti {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
        }

        .success-icon-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; }
        .ring1 { position: absolute; width: 80px; height: 80px; border-radius: 50%; border: 2px solid #22c55e; animation: ringPulse 1.8s ease-out infinite; }
        .ring2 { position: absolute; width: 80px; height: 80px; border-radius: 50%; border: 2px solid #22c55e; animation: ringPulse 1.8s ease-out .5s infinite; }
        .icon-circle {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 12px 32px rgba(34,197,94,.4);
          animation: popIn .6s cubic-bezier(.34,1.56,.64,1) both;
        }

        .card-in { animation: fadeUp .5s ease both; }
        .card-in:nth-child(1) { animation-delay: .1s; }
        .card-in:nth-child(2) { animation-delay: .2s; }
        .card-in:nth-child(3) { animation-delay: .3s; }
        .card-in:nth-child(4) { animation-delay: .4s; }

        .choice-card {
          position: relative; border-radius: 20px; overflow: hidden;
          border: 1.5px solid transparent;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          cursor: pointer;
        }
        .choice-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,.12);
        }
        .choice-card.app-card  { background: #0d1b3e; border-color: rgba(99,102,241,.3); }
        .choice-card.app-card:hover  { border-color: rgba(99,102,241,.7); box-shadow: 0 16px 48px rgba(99,102,241,.2); }
        .choice-card.web-card  { background: white; border-color: #e2e8f0; }
        .choice-card.web-card:hover  { border-color: #4f46e5; }

        .app-screenshot {
          width: 100%;  
          height:150px;
          display: block;
        
        }
        .screenshot-wrap {
          overflow: hidden; border-radius: 12px; border: 1px solid rgba(255,255,255,.08);
          margin-bottom: 16px;
        }

        .play-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: #0d1b3e;
          font-size: 12px; font-weight: 600;
          padding: 8px 16px; border-radius: 10px;
          transition: all .15s ease;
          text-decoration: none;
        }
        .play-badge:hover { background: #f1f5f9; transform: scale(1.02); }
        .play-badge-icon { width: 20px; height: 20px; }

        .web-cta {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white; font-size: 14px; font-weight: 600;
          padding: 13px; border-radius: 12px; border: none; cursor: pointer;
          box-shadow: 0 6px 20px rgba(79,70,229,.3);
          transition: all .2s ease;
        }
        .web-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(79,70,229,.4); }

        .shimmer-bar {
          height: 2px; width: 100%;
          background: linear-gradient(90deg, transparent, #22c55e, transparent);
          background-size: 400px 100%;
          animation: shimmer 2s linear infinite;
        }

        .info-strip {
          display: flex; align-items: flex-start; gap: 12px;
          background: #fffbeb; border: 1px solid #fde68a;
          border-radius: 14px; padding: 14px 16px;
        }
        .info-icon-wrap {
          width: 34px; height: 34px; flex-shrink: 0;
          background: #fef3c7; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }

        .stars { display: flex; gap: 2px; }
        .star-filled { color: #f59e0b; }
      `}</style>

      <div className="sp-root min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(160deg, #f0fdf4 0%, #f8faff 50%, #fdf4ff 100%)" }}>

        <div className="w-full max-w-2xl">



          {/* ── Success badge ── */}
          <div className="text-center mb-8 card-in">
            <div className="success-icon-wrap mb-5">
              <span className="ring1" />
              <span className="ring2" />
              <div className="icon-circle">
                <CheckCircle size={34} color="white" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-[32px] font-bold text-[#0f172a] leading-tight mb-2">
              You're enrolled! 🎉
            </h1>
            <p className="text-[13.5px] text-[#64748b] max-w-md mx-auto leading-relaxed">
              Your course has been unlocked. Choose how you'd like to start learning — on mobile for the best experience, or jump straight to the web.
            </p>

            {/* Stars */}
            <div className="flex justify-center mt-3 gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="star-filled" fill="#f59e0b" />
              ))}
              <span className="text-[11px] text-[#94a3b8] ml-1.5 self-center">Trusted by 50,000+ students</span>
            </div>
          </div>

          {/* ── TWO CHOICE CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

            {/* App card */}
            <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer"
              className="choice-card app-card card-in block no-underline">
              <div className="p-5">
                <div className="screenshot-wrap">
                  <Image
                    src={imageApp}
                    alt="Dikshant IAS App"
                    className="app-screenshot"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone size={14} color="white" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-white">Download the App</span>
                </div>

                <p className="text-[11.5px] text-[#94a3b8] leading-relaxed mb-4">
                  Best experience. Offline downloads, live classes & more.
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="stars">{[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#f59e0b" color="#f59e0b" />)}</div>
                  <span className="text-[10.5px] text-[#64748b]">4.8 · 10K+ reviews</span>
                </div>

                <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer" className="play-badge">
                  <svg className="play-badge-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M3 20.5v-17c0-.83 1-.83 1.5-.5l15 8.5-15 8.5C3.5 21.33 3 21.33 3 20.5z" fill="#34a853" />
                    <path d="M3 3.5L13.5 12 3 20.5V3.5z" fill="#4285f4" />
                    <path d="M3 3.5l10.5 8.5L18 7.5 5 2c-.5-.2-.8-.1-1 .2-.2.2-.2.5 0 1.3z" fill="#fbbc05" />
                    <path d="M3 20.5l10.5-8.5L18 16.5 5 22c-.5.2-.8.1-1-.2-.2-.2-.2-.5 0-1.3z" fill="#ea4335" />
                  </svg>
                  Get it on Play Store
                  <ArrowRight size={13} />
                </a>
              </div>
            </a>

            {/* Web card */}
            <div className="choice-card web-card card-in flex flex-col">
              <div className="p-5 flex flex-col flex-1">

                {/* Web preview mockup */}
                <div className="rounded-xl overflow-hidden border border-[#f1f5f9] bg-[#f8fafc] mb-4 p-4">
                  <div className="flex gap-1.5 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-300" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 bg-[#e2e8f0] rounded-full w-3/4" />
                    <div className="h-2.5 bg-[#e2e8f0] rounded-full w-1/2" />
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="h-14 bg-[#eef2ff] rounded-lg" />
                      <div className="h-14 bg-[#f0fdf4] rounded-lg" />
                    </div>
                    <div className="h-2.5 bg-[#e2e8f0] rounded-full w-2/3" />
                    <div className="h-2.5 bg-[#e2e8f0] rounded-full w-1/2" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Monitor size={14} color="#4f46e5" />
                  </div>
                  <span className="text-[13.5px] font-semibold text-[#0f172a]">Continue on Web</span>
                </div>

                <p className="text-[11.5px] text-[#64748b] leading-relaxed mb-5 flex-1">
                  Access your course library from any browser, right now.
                </p>

                <button onClick={() => window.location.href = WEB_COURSES_URL} className="web-cta">
                  <Monitor size={15} />
                  Go to My Courses
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Password info strip ── */}
          {/* <div className="info-strip card-in mb-4">
            <div className="info-icon-wrap">
              <KeyRound size={15} color="#b45309" />
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-[#92400e] mb-0.5">Login to the app</p>
              <p className="text-[12px] text-[#78350f] leading-relaxed">
                Your default password is your <span className="font-semibold">registered mobile number</span>. We recommend changing it after your first login.
              </p>
            </div>
          </div> */}

          {/* ── Support ── */}
          <p className="text-center text-[11px] text-[#94a3b8] card-in">
            Need help? Contact us at{" "}
            <a href="mailto:support@dikshantias.com" className="text-[#4f46e5] underline">
              support@dikshantias.com
            </a>
          </p>

          {/* ── Bottom shimmer ── */}
          <div className="shimmer-bar rounded-full mt-8" />
        </div>
      </div>
    </>
  );
};

export default Page;