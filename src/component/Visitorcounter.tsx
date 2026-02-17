import { useState, useEffect } from "react";

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let startTime = null;
    const startVal = 0;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  return count;
}

const VISITOR_COUNT = 248917;

export default function VisitorCounter() {
  const animated = useCountUp(VISITOR_COUNT, 2200);
  const digits = animated.toLocaleString().split("");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Outfit:wght@400;500;600;700&display=swap');

        @keyframes outerRingPulse {
          0%   { transform: scale(1);   opacity: 0.5; }
          70%  { transform: scale(2.8); opacity: 0;   }
          100% { transform: scale(3);   opacity: 0;   }
        }
        @keyframes innerDotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(165,3,9,0.6); }
          50%       { box-shadow: 0 0 0 5px rgba(165,3,9,0);  }
        }
        @keyframes liveBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        @keyframes scanline {
          0%   { top: -6px; }
          100% { top: 100%; }
        }
        @keyframes digitFlip {
          0%   { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes floatUp1 {
          0%,100% { transform: translateY(0);   }
          50%      { transform: translateY(-6px); }
        }
        @keyframes floatUp2 {
          0%,100% { transform: translateY(0);   }
          50%      { transform: translateY(-4px); }
        }
        @keyframes borderGlow {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1;   }
        }

        .vc-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 16px;
          font-family: 'Outfit', sans-serif;
        }

        .vc-card {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 22px 36px 20px;
          border-radius: 20px;
          background: linear-gradient(145deg, #ffffff 0%, #f4f8fd 60%, #eef2fb 100%);
          border: 1.5px solid rgba(165, 3, 9, 0.12);
          box-shadow:
            0 4px 6px rgba(0,0,0,0.04),
            0 10px 32px rgba(165,3,9,0.07),
            0 24px 48px rgba(30,58,138,0.06),
            inset 0 1px 0 rgba(255,255,255,0.9);
          animation: cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) both;
          overflow: hidden;
        }

        /* Decorative corner accents */
        .vc-card::before,
        .vc-card::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: rgba(165,3,9,0.25);
          border-style: solid;
          animation: borderGlow 2.5s ease-in-out infinite;
        }
        .vc-card::before {
          top: 8px; left: 8px;
          border-width: 2px 0 0 2px;
          border-radius: 4px 0 0 0;
        }
        .vc-card::after {
          bottom: 8px; right: 8px;
          border-width: 0 2px 2px 0;
          border-radius: 0 0 4px 0;
        }

        /* Subtle scanline sweep */
        .vc-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 60px;
          background: linear-gradient(180deg, transparent 0%, rgba(165,3,9,0.025) 50%, transparent 100%);
          animation: scanline 3.5s linear infinite;
          pointer-events: none;
        }

        /* Top header row */
        .vc-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Pulse dot */
        .vc-dot-wrap {
          position: relative;
          display: inline-flex;
          width: 12px;
          height: 12px;
        }
        .vc-dot-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #a50309;
          animation: outerRingPulse 1.8s ease-out infinite;
        }
        .vc-dot-core {
          position: relative;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ff4d54, #a50309);
          box-shadow: 0 0 6px rgba(165,3,9,0.6);
          animation: innerDotPulse 1.8s ease-in-out infinite;
        }

        /* LIVE badge */
        .vc-live-badge {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #a50309;
          background: linear-gradient(135deg, rgba(165,3,9,0.09), rgba(165,3,9,0.06));
          border: 1px solid rgba(165,3,9,0.2);
          border-radius: 5px;
          padding: 2px 7px 2px 8px;
          animation: liveBlink 2.2s ease-in-out infinite;
        }

        .vc-divider-v {
          width: 1px;
          height: 14px;
          background: linear-gradient(180deg, transparent, rgba(30,58,138,0.2), transparent);
        }

        .vc-header-label {
          font-size: 11px;
          font-weight: 600;
          color: #1e3a8a;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          opacity: 0.75;
        }

        /* Icon circle */
        .vc-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a50309 0%, #c0392b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 14px rgba(165,3,9,0.35),
            0 1px 3px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.2);
          animation: floatUp1 4s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* Digits row */
        .vc-digits-row {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .vc-digit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 38px;
          background: linear-gradient(160deg, #fff 0%, #f1f5fd 100%);
          border: 1px solid rgba(165,3,9,0.1);
          border-radius: 7px;
          box-shadow:
            0 2px 6px rgba(0,0,0,0.06),
            inset 0 1px 0 rgba(255,255,255,0.8),
            inset 0 -1px 0 rgba(0,0,0,0.04);
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: #a50309;
          line-height: 1;
          animation: digitFlip 0.3s ease both;
          position: relative;
          overflow: hidden;
        }

        /* Shimmer on each digit tile */
        .vc-digit::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255,255,255,0.55) 50%,
            transparent 100%
          );
          background-size: 400px 100%;
          animation: shimmer 3s ease-in-out infinite;
        }

        .vc-comma {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: rgba(165,3,9,0.35);
          line-height: 1;
          margin-bottom: -6px;
          padding: 0 1px;
        }

        /* Bottom label */
        .vc-footer-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vc-divider-h {
          height: 1px;
          width: 40px;
          background: linear-gradient(90deg, transparent, rgba(165,3,9,0.2), transparent);
        }

        .vc-footer-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #1e3a8a;
          opacity: 0.55;
        }

        /* Decorative background shape */
        .vc-bg-circle {
          position: absolute;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(165,3,9,0.04) 0%, transparent 70%);
          top: -40px;
          right: -40px;
          pointer-events: none;
          animation: floatUp2 5s ease-in-out infinite;
        }
      `}</style>

      <div className="vc-wrapper">
        <div className="vc-card">
          {/* Decorative bg */}
          <div className="vc-bg-circle" />
          <div className="vc-scanline" />

          {/* Header: dot + LIVE + divider + label */}
          <div className="vc-header">
            <div className="vc-dot-wrap">
              <span className="vc-dot-ring" />
              <span className="vc-dot-core" />
            </div>
            <span className="vc-live-badge">LIVE</span>
            <div className="vc-divider-v" />
            {/* Eye icon inline */}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(30,58,138,0.55)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span className="vc-header-label">Website Visitors</span>
          </div>

          {/* Main count — individual digit tiles */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Icon */}
            <div className="vc-icon-wrap">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            {/* Digit flip tiles */}
            <div className="vc-digits-row">
              {digits.map((ch, i) =>
                ch === "," ? (
                  <span key={i} className="vc-comma">
                    ,
                  </span>
                ) : (
                  <span
                    key={i}
                    className="vc-digit"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {ch}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Footer label */}
          <div className="vc-footer-row">
            <div className="vc-divider-h" />
            <span className="vc-footer-label">Total Visits Recorded</span>
            <div className="vc-divider-h" />
          </div>
        </div>
      </div>
    </>
  );
}
