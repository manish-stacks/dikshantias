"use client"

import React, { useState, useEffect, useRef } from "react"
import { useAuthStore } from "@/lib/store/auth.store"
import {
  Phone,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Props {
  open: boolean
  onClose: () => void
}

type AuthMode = "login" | "register" | "otp"

/* ─────────────────────────────────────────────
   Password strength helper (UI only)
───────────────────────────────────────────── */
function passwordStrength(v: string): { score: number; label: string; color: string } {
  let score = 0
  if (v.length >= 8) score++
  if (/[A-Z]/.test(v)) score++
  if (/[0-9]/.test(v)) score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  const map = [
    { label: "", color: "#e2e8f0" },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f97316" },
    { label: "Good", color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
  ]
  return { score, ...map[score] }
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function DikshantAuthModal({ open, onClose }: Props) {

  /* ══════════════════════════════════════════
     YOUR ORIGINAL STORE HOOKS — unchanged
  ══════════════════════════════════════════ */
  const { login, signup, verifyOtp, resendOtp } = useAuthStore()

  /* ══════════════════════════════════════════
     YOUR ORIGINAL STATE — unchanged
  ══════════════════════════════════════════ */
  const [mode, setMode] = useState<AuthMode>("login")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form fields
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""))

  // Resend OTP timer
  const [countdown, setCountdown] = useState(0)

  /* ══════════════════════════════════════════
     UI-ONLY STATE (new, does not touch logic)
  ══════════════════════════════════════════ */
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const strength = passwordStrength(password)

  /* ══════════════════════════════════════════
     YOUR ORIGINAL useEffect — reset on close
     (only added activeTab + UI resets)
  ══════════════════════════════════════════ */
  useEffect(() => {
    if (!open) {
      setMode("login")
      setActiveTab("login")
      setError("")
      setSuccessMsg("")
      setLoading(false)
      setName("")
      setEmail("")
      setPhone("")
      setPassword("")
      setOtpDigits(Array(6).fill(""))
      setCountdown(0)
      setShowPassword(false)
    }
  }, [open])

  /* ══════════════════════════════════════════
     YOUR ORIGINAL startOtpTimer — unchanged
  ══════════════════════════════════════════ */
  const startOtpTimer = () => {
    setCountdown(30)
  }

  /* ══════════════════════════════════════════
     YOUR ORIGINAL timer useEffect — unchanged
  ══════════════════════════════════════════ */
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  /* Auto-clear success toast (UI only) */
  useEffect(() => {
    if (!successMsg) return
    const t = setTimeout(() => setSuccessMsg(""), 3000)
    return () => clearTimeout(t)
  }, [successMsg])

  /* ══════════════════════════════════════════
     YOUR ORIGINAL handleLogin — unchanged
  ══════════════════════════════════════════ */
  const handleLogin = async () => {
    if (!phone || !password) {
      setError("Phone and password are required")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await login(phone.trim(), password)
      // LOGIN OTP FLOW
      if (res?.otpSent) {
        startOtpTimer()
        setMode("otp")
        return
      }
      // DIRECT LOGIN
      onClose()
    } catch (err: any) {
      setError(err?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  /* ══════════════════════════════════════════
     YOUR ORIGINAL handleRegister — unchanged
  ══════════════════════════════════════════ */
  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setError("All fields are required")
      return
    }
    setLoading(true)
    setError("")
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        mobile: phone.trim(),
        password,
      })
      startOtpTimer()
      setMode("otp")
    } catch (err: any) {
      setError(err?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  /* ══════════════════════════════════════════
     YOUR ORIGINAL handleVerifyOtp — unchanged
  ══════════════════════════════════════════ */
  const handleVerifyOtp = async () => {
    const otpValue = otpDigits.join("")
    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP")
      return
    }
    setLoading(true)
    setError("")
    try {
      await verifyOtp(otpValue)
      onClose()
    } catch (err: any) {
      setError(err?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  /* ══════════════════════════════════════════
     YOUR ORIGINAL handleResendOtp — unchanged
     (only moved success text to successMsg)
  ══════════════════════════════════════════ */
  const handleResendOtp = async () => {
    setLoading(true)
    setError("")
    try {
      await resendOtp()
      startOtpTimer()
      setOtpDigits(Array(6).fill(""))
      setSuccessMsg("New OTP sent successfully!")
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }

  /* ══════════════════════════════════════════
     YOUR ORIGINAL handleOtpChange — unchanged
  ══════════════════════════════════════════ */
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...otpDigits]
    newDigits[index] = value.slice(-1)
    setOtpDigits(newDigits)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  /* ══════════════════════════════════════════
     YOUR ORIGINAL handleOtpKeyDown — unchanged
  ══════════════════════════════════════════ */
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  /* Tab switcher (UI helper only) */
  const switchTab = (tab: "login" | "register") => {
    setActiveTab(tab)
    setMode(tab)
    setError("")
    setSuccessMsg("")
  }

  if (!open) return null

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .dik-tab {
          flex: 1; padding: 13px 0; border: none; background: transparent;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          color: #94a3b8; cursor: pointer; position: relative; transition: color 0.2s;
        }
        .dik-tab.active { color: #dc2626; }
        .dik-tab.active::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: #dc2626; border-radius: 2px 2px 0 0;
        }

        .dik-btn {
          width: 100%; padding: 14px; border: none; border-radius: 12px; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 9px; transition: opacity 0.2s, transform 0.15s;
          background: linear-gradient(135deg, #b91c1c, #dc2626); margin-top: 6px;
        }
        .dik-btn:hover:not(:disabled) { opacity: 0.91; }
        .dik-btn:active:not(:disabled) { transform: scale(0.99); }
        .dik-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .dik-input {
          width: 100%; padding: 13px 44px 13px 42px;
          border: 1.5px solid #e2e8f0; border-radius: 11px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: #1e293b; background: #fff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
        }
        .dik-input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
        }
        .dik-input.no-suffix { padding-right: 14px; }

        .dik-otp {
          width: 48px; height: 54px; text-align: center; font-size: 22px; font-weight: 700;
          border: 2px solid #e2e8f0; border-radius: 12px; outline: none;
          font-family: 'DM Sans', sans-serif; color: #1e293b;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; background: #fff;
        }
        .dik-otp:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.12); }
        .dik-otp.filled { border-color: #dc2626; background: #fff5f5; }

        .dik-social {
          flex: 1; padding: 10px 8px; border: 1.5px solid #e2e8f0; border-radius: 10px;
          background: #fff; cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 7px; font-size: 13px; font-weight: 500;
          color: #475569; font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, border-color 0.2s;
        }
        .dik-social:hover { background: #f8fafc; border-color: #cbd5e1; }

        .dik-link {
          background: none; border: none; color: #dc2626; font-weight: 600;
          font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif;
        }
        .dik-link:hover { text-decoration: underline; }
        .dik-link:disabled { opacity: 0.5; cursor: not-allowed; }

        .dik-slide { animation: dikslide 0.28s cubic-bezier(.4,0,.2,1); }
        @keyframes dikslide {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 0.7s linear infinite; }

        @media (max-width: 480px) {
          .dik-otp { width: 40px; height: 46px; font-size: 18px; }
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", padding: 16,
        }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* ── Modal Card ── */}
        <div style={{
          width: "100%", maxWidth: 440, background: "#fff", borderRadius: 20,
          overflow: "hidden", fontFamily: "'DM Sans', sans-serif",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        }}>

          {/* ══════════ HEADER ══════════ */}
          <div style={{
            background: "linear-gradient(135deg, #991b1b 0%, #b91c1c 45%, #dc2626 100%)",
            padding: "28px 28px 22px", position: "relative", overflow: "hidden",
          }}>
            {/* Decorative circles */}
            <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.05)", top:-90, right:-70, pointerEvents:"none" }} />
            <div style={{ position:"absolute", width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.05)", bottom:-50, left:10, pointerEvents:"none" }} />

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position:"absolute", top:14, right:14, width:32, height:32, borderRadius:"50%",
                background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", zIndex:2,
              }}
            >
              <X size={14} />
            </button>

            {/* Logo row */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, position:"relative", zIndex:1 }}>
              <div style={{
                width:42, height:42, background:"#fff", borderRadius:11,
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, boxShadow:"0 2px 8px rgba(0,0,0,0.15)",
              }}>
                <Shield size={22} color="#dc2626" fill="#fecaca" />
              </div>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", color:"#fff", fontSize:18, fontWeight:700, lineHeight:1.15 }}>
                  Dikshant IAS
                </div>
                <div style={{ color:"rgba(255,255,255,0.7)", fontSize:10, letterSpacing:"2px", textTransform:"uppercase" }}>
                  Excellence in Civil Services
                </div>
              </div>
            </div>

            {/* Dynamic heading */}
            <div style={{ position:"relative", zIndex:1 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", color:"#fff", fontSize:22, fontWeight:700, margin:"0 0 4px" }}>
                {mode === "login"    && "Welcome Back"}
                {mode === "register" && "Join Dikshant IAS"}
                {mode === "otp"      && "Verify Your Number"}
              </h2>
              <p style={{ color:"rgba(255,255,255,0.72)", fontSize:13, fontWeight:300, margin:0 }}>
                {mode === "login"    && "Sign in to continue your UPSC preparation"}
                {mode === "register" && "Create your account & begin your IAS journey"}
                {mode === "otp"      && "Enter the 6-digit OTP sent to your registered mobile"}
              </p>
            </div>
          </div>

          {/* ══════════ TABS (hidden in OTP) ══════════ */}
          {mode !== "otp" && (
            <div style={{ display:"flex", background:"#fafafa", borderBottom:"1px solid #f1f5f9" }}>
              <button className={`dik-tab${activeTab === "login" ? " active" : ""}`} onClick={() => switchTab("login")}>
                Sign In
              </button>
              <button className={`dik-tab${activeTab === "register" ? " active" : ""}`} onClick={() => switchTab("register")}>
                Register
              </button>
            </div>
          )}

          {/* ══════════ BODY ══════════ */}
          <div style={{ padding:"24px 28px 28px" }}>

            {/* Error banner */}
            {error && (
              <div style={{
                display:"flex", alignItems:"center", gap:9, padding:"10px 14px",
                borderRadius:10, marginBottom:16, fontSize:13,
                background:"#fef2f2", color:"#b91c1c", border:"1px solid #fecaca",
              }}>
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            {/* Success banner */}
            {successMsg && (
              <div style={{
                display:"flex", alignItems:"center", gap:9, padding:"10px 14px",
                borderRadius:10, marginBottom:16, fontSize:13,
                background:"#f0fdf4", color:"#166534", border:"1px solid #bbf7d0",
              }}>
                <CheckCircle size={14} />
                {successMsg}
              </div>
            )}

            {/* ════════ LOGIN ════════ */}
            {mode === "login" && (
              <div className="dik-slide">

                {/* Phone — your original value/onChange */}
                <div style={{ marginBottom:16, position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", display:"flex", pointerEvents:"none" }}>
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="dik-input no-suffix"
                  />
                </div>

                {/* Password — your original value/onChange */}
                <div style={{ marginBottom:6, position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", display:"flex", pointerEvents:"none" }}>
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dik-input"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div style={{ textAlign:"right", marginBottom:14 }}>
                  <button className="dik-link" style={{ fontSize:12 }}>Forgot password?</button>
                </div>

                {/* Submit — your original handleLogin */}
                <button className="dik-btn" onClick={handleLogin} disabled={loading}>
                  {loading
                    ? <><Loader2 size={17} className="spin" /> Please wait...</>
                    : <><ArrowRight size={17} /> Sign In to Dashboard</>
                  }
                </button>


                <p style={{ textAlign:"center", fontSize:13, color:"#64748b", marginTop:20 }}>
                  New to Dikshant IAS?{" "}
                  <button className="dik-link" onClick={() => switchTab("register")}>
                    Create Account <ChevronRight size={12} style={{ verticalAlign:"middle" }} />
                  </button>
                </p>
              </div>
            )}

            {/* ════════ REGISTER ════════ */}
            {mode === "register" && (
              <div className="dik-slide">

                {/* Name — your original */}
                <div style={{ marginBottom:16, position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", display:"flex", pointerEvents:"none" }}>
                    <User size={16} />
                  </span>
                  <input
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="dik-input no-suffix"
                  />
                </div>

                {/* Email — your original */}
                <div style={{ marginBottom:16, position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", display:"flex", pointerEvents:"none" }}>
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="dik-input no-suffix"
                  />
                </div>

                {/* Phone — your original */}
                <div style={{ marginBottom:16, position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", display:"flex", pointerEvents:"none" }}>
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    placeholder="Mobile Number (10 digits)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="dik-input no-suffix"
                  />
                </div>

                {/* Password — your original */}
                <div style={{ marginBottom: password ? 8 : 16, position:"relative" }}>
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", display:"flex", pointerEvents:"none" }}>
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="dik-input"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", padding:0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength (UI only, doesn't affect your logic) */}
                {password && (
                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                      {[1,2,3,4].map((i) => (
                        <div key={i} style={{
                          flex:1, height:3, borderRadius:2,
                          background: i <= strength.score ? strength.color : "#e2e8f0",
                          transition:"background 0.3s",
                        }} />
                      ))}
                    </div>
                    {strength.label && (
                      <span style={{ fontSize:11, color:strength.color, fontWeight:500 }}>
                        {strength.label} password
                      </span>
                    )}
                  </div>
                )}

                {/* Submit — your original handleRegister */}
                <button className="dik-btn" onClick={handleRegister} disabled={loading}>
                  {loading
                    ? <><Loader2 size={17} className="spin" /> Creating account...</>
                    : <><User size={17} /> Register</>
                  }
                </button>

                <p style={{ fontSize:11, color:"#94a3b8", textAlign:"center", marginTop:12 }}>
                  By registering you agree to our{" "}
                  <Link href={"/terms-conditions"}>
                                    <button className="dik-link" style={{ fontSize:11 }}>Terms &amp; Privacy Policy</button>

                  </Link>
                </p>

                <p style={{ textAlign:"center", fontSize:13, color:"#64748b", marginTop:14 }}>
                  Already registered?{" "}
                  <button className="dik-link" onClick={() => switchTab("login")}>
                    Sign In <ChevronRight size={12} style={{ verticalAlign:"middle" }} />
                  </button>
                </p>
              </div>
            )}

            {/* ════════ OTP ════════ */}
            {mode === "otp" && (
              <div className="dik-slide">

                <div style={{
                  background:"#fef2f2", border:"1px solid #fecaca", borderRadius:10,
                  padding:"10px 14px", fontSize:12, color:"#b91c1c",
                  display:"flex", alignItems:"center", gap:8, marginBottom:22,
                }}>
                  <AlertCircle size={14} />
                  Enter OTP sent to your registered email
                </div>

                {/* 6 OTP inputs — your original logic */}
                <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:24 }}>
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el }}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      className={`dik-otp${digit ? " filled" : ""}`}
                    />
                  ))}
                </div>

                {/* Verify — your original handleVerifyOtp */}
                <button className="dik-btn" onClick={handleVerifyOtp} disabled={loading}>
                  {loading
                    ? <><Loader2 size={17} className="spin" /> Verifying...</>
                    : <><CheckCircle size={17} /> Verify &amp; Continue</>
                  }
                </button>

                {/* Resend — your original countdown + handleResendOtp */}
                <div style={{ textAlign:"center", marginTop:18, fontSize:13 }}>
                  {countdown > 0 ? (
                    <p style={{ color:"#64748b" }}>
                      Resend OTP in{" "}
                      <span style={{ color:"#dc2626", fontWeight:600 }}>{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      className="dik-link"
                      onClick={handleResendOtp}
                      disabled={loading}
                      style={{ display:"inline-flex", alignItems:"center", gap:5 }}
                    >
                      <RefreshCw size={13} />
                      Resend OTP
                    </button>
                  )}
                </div>

                <p style={{ textAlign:"center", fontSize:12, color:"#94a3b8", marginTop:14 }}>
                  Wrong number?{" "}
                  <button className="dik-link" style={{ fontSize:12 }} onClick={() => setMode(activeTab)}>
                    Go back
                  </button>
                </p>
              </div>
            )}

          </div>

          {/* ══════════ FOOTER ══════════ */}
          <div style={{
            padding:"12px 28px", background:"#f8fafc",
            borderTop:"1px solid #f1f5f9", textAlign:"center",
            fontSize:11, color:"#94a3b8", letterSpacing:"0.3px",
          }}>
            Preparing future civil servants &nbsp;•&nbsp; Dikshant IAS © {new Date().getFullYear()}
          </div>

        </div>
      </div>
    </>
  )
}