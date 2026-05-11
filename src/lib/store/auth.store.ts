import { create } from "zustand";
import Cookies from "js-cookie";
import axiosInstance from "@/lib/axios";

const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
} as const;

interface User {
  id: string | number;
  name?: string;
  email?: string;
  mobile: string;
  [key: string]: unknown;
}

interface AuthState {
  phone: string;
  token: string | null;
  refreshToken: string | null;
  loggedIn: boolean;
  otpSent: boolean;
  user: User | null;
  userId: string | number | null;
  isInitializing: boolean;

  setPhone: (phone: string) => void;
  setUser: (user: User | null) => void;

  signup: (data: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    device_id?: string;
    fcm_token?: string;
    platform?: string;
    appVersion?: string;
  }) => Promise<void>;

  // Step 1 of OTP login: request OTP for existing user
  requestLoginOtp: (mobile: string) => Promise<{
    success: boolean;
    userId?: string | number;
    message: string;
  }>;

  // Step 2 of OTP login OR signup OTP verify
  loginWithOtp: (userId: string | number, otp: string) => Promise<void>;

  // Generic OTP request (signup flow resend)
  requestOtp: (phone: string) => Promise<{
    success: boolean;
    message: string;
    userId?: string | number;
  }>;

  // Kept for signup OTP verify via modal (calls loginWithOtp internally)
  verifyOtp: (otp: string) => Promise<void>;

  login: (
    phone: string,
    password: string,
    device_id?: string,
    fcm_token?: string,
    platform?: string,
    appVersion?: string
  ) => Promise<{
    otpSent?: boolean;
    userId?: string | number;
  }>;

  getProfile: () => Promise<User | null>;
  checkLogin: () => Promise<boolean>;
  logout: () => Promise<{ success: boolean; message: string }>;
  getCurrentUser: () => User | null;

  resendOtp: () => Promise<void>;
  clearOtpState: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  phone: "",
  token: null,
  refreshToken: null,
  loggedIn: false,
  otpSent: false,
  user: null,
  userId: null,
  isInitializing: true,

  setPhone: (phone) => set({ phone }),
  setUser: (user) => set({ user, userId: user?.id ?? null }),

  // ── Signup ────────────────────────────────────────────────────────
  signup: async (formData) => {
    const { name, email, mobile, password, ...optional } = formData;

    if (!name || !email || !mobile || !password) {
      throw new Error("All fields are required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!/^\d{10}$/.test(mobile)) {
      throw new Error("Phone number must be 10 digits");
    }

    try {
      const res = await axiosInstance.post<{ user: { id: string | number } }>("/auth/signup", {
        name,
        email,
        mobile,
        password,
        ...optional,
      });

      const { id } = res.data.user;
      Cookies.set("userId", String(id), COOKIE_OPTIONS);
      set({ otpSent: true, phone: mobile, userId: id });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Signup failed";
      throw new Error(msg);
    }
  },

  // ── Request OTP for login (existing user) ─────────────────────────
  requestLoginOtp: async (mobile) => {
    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return { success: false, message: "Invalid mobile number" };
    }

    try {
      const res = await axiosInstance.post<{ user_id: string | number }>("/auth/request-otp", {
        mobile,
      });

      const { user_id } = res.data;
      Cookies.set("userId", String(user_id), COOKIE_OPTIONS);
      set({ phone: mobile, userId: user_id, otpSent: true });

      return { success: true, userId: user_id, message: "OTP sent successfully" };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Failed to send OTP";
      return { success: false, message: msg };
    }
  },

  // ── Verify OTP + complete login/signup ────────────────────────────
  loginWithOtp: async (userId, otp) => {
    if (!userId) throw new Error("User ID missing");
    if (!/^\d{6}$/.test(otp)) throw new Error("Invalid OTP");

    try {
      const res = await axiosInstance.post<{
        token: string;
        refresh_token?: string;
        user: User;
      }>("/auth/verify-otp", {
        user_id: userId,
        otp,
      });

      const { token, refresh_token, user } = res.data;

      Cookies.set("authToken", token, COOKIE_OPTIONS);
      if (refresh_token) Cookies.set("refreshToken", refresh_token, COOKIE_OPTIONS);

      set({
        loggedIn: true,
        token,
        refreshToken: refresh_token ?? null,
        user,
        userId: user.id,
        phone: user.mobile,
        otpSent: false,
        isInitializing: false,
      });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "OTP verification failed";
      throw new Error(msg);
    }
  },

  // ── Generic OTP request (signup resend) ───────────────────────────
  requestOtp: async (phone) => {
    if (!phone || !/^\d{10}$/.test(phone)) {
      return { success: false, message: "Invalid phone number" };
    }

    try {
      const res = await axiosInstance.post<{ user_id: string | number }>("/auth/request-otp", {
        mobile: phone,
      });

      const { user_id } = res.data;
      Cookies.set("userId", String(user_id), COOKIE_OPTIONS);
      set({ otpSent: true, phone, userId: user_id });

      return { success: true, message: `OTP sent to ${phone}`, userId: user_id };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to send OTP";
      return { success: false, message: msg };
    }
  },

  // ── verifyOtp: modal calls this (wraps loginWithOtp) ──────────────
  verifyOtp: async (otp) => {
    const { userId } = get();
    if (!userId) throw new Error("No OTP request found. Please request OTP first.");
    await get().loginWithOtp(userId, otp);
  },

  // ── Password Login ────────────────────────────────────────────────
  login: async (phone, password, device_id?, fcm_token?, platform?, appVersion?) => {
    try {
      const res = await axiosInstance.post("/auth/login", {
        mobile: phone,
        password: password || "",
        device_id,
        fcm_token,
        login_from: "Web",
        platform,
        appVersion,
      });

      // OTP flow — API sends OTP instead of token
      if (
        res.data.isLoginOtpSent ||
        res.data.message === "OTP sent successfully! Please check your messages."
      ) {
        const user_id = res.data.user_id;
        Cookies.set("userId", String(user_id), COOKIE_OPTIONS);
        set({ otpSent: true, phone, userId: user_id });
        return { otpSent: true, userId: user_id };
      }

      // Direct password login
      const { token, user, refresh_token } = res.data;
      if (!token) throw new Error("No token received from server");

      Cookies.set("authToken", token, COOKIE_OPTIONS);
      if (refresh_token) Cookies.set("refreshToken", refresh_token, COOKIE_OPTIONS);

      set({
        loggedIn: true,
        token,
        refreshToken: refresh_token ?? null,
        user,
        phone,
        userId: user.id,
        otpSent: false,
        isInitializing: false,
      });

      return { otpSent: false };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Login failed";
      throw new Error(msg);
    }
  },

  // ── Profile ───────────────────────────────────────────────────────
  getProfile: async () => {
    try {
      const res = await axiosInstance.get<{ data: User }>("/auth/profile-details");
      const user = res.data.data;
      set({ user, userId: user.id, phone: user.mobile, loggedIn: true });
      return user;
    } catch {
      return null;
    }
  },

  checkLogin: async () => {
    const token = Cookies.get("authToken");
    if (!token) return false;
    const user = await get().getProfile();
    return !!user;
  },

  logout: async () => {
    try {
      axiosInstance.get("/auth/logout").catch(() => {});
      Cookies.remove("authToken", COOKIE_OPTIONS);
      Cookies.remove("refreshToken", COOKIE_OPTIONS);
      Cookies.remove("userId", COOKIE_OPTIONS);
      set({
        loggedIn: false,
        token: null,
        refreshToken: null,
        user: null,
        phone: "",
        otpSent: false,
        userId: null,
        isInitializing: false,
      });
      return { success: true, message: "Logged out successfully" };
    } catch {
      return { success: false, message: "Logout failed" };
    }
  },

  getCurrentUser: () => {
    const { user, phone, userId } = get();
    if (!user) return null;
    return { ...user, phone, userId };
  },

  // resendOtp: used in signup OTP step
  resendOtp: async () => {
    const { phone } = get();
    if (!phone) throw new Error("No phone number found");
    const res = await get().requestOtp(phone);
    if (!res.success) throw new Error(res.message);
  },

  clearOtpState: () => set({ otpSent: false, userId: null }),

  initializeAuth: async () => {
    set({ isInitializing: true });
    try {
      const token = Cookies.get("authToken");
      if (!token) { set({ isInitializing: false }); return; }

      const user = await get().getProfile();
      if (user) {
        set({ loggedIn: true, user, userId: user.id, isInitializing: false });
      } else {
        await get().logout();
      }
    } catch {
      await get().logout();
    } finally {
      set({ isInitializing: false });
    }
  },
}));