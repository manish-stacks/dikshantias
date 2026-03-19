import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // optional but recommended
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
  // ── State ───────────────────────────────────────
  phone: string;
  token: string | null;
  refreshToken: string | null;
  loggedIn: boolean;
  otpSent: boolean;
  user: User | null;
  userId: string | number | null;
  isInitializing: boolean;

  // ── Actions ─────────────────────────────────────
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
  }) => Promise<{ success: boolean; message: string }>;

  requestOtp: (phone: string) => Promise<{
    success: boolean;
    message: string;
    userId?: string | number;
  }>;

  verifyOtp: (otp: string) => Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: User;
  }>;

  login: (
    phone: string,
    password: string,
    device_id?: string,
    fcm_token?: string,
    platform?: string,
    appVersion?: string
  ) => Promise<{
    success: boolean;
    message: string;
    otpSent?: boolean;
    userId?: string | number;
    token?: string;
    user?: User;
  }>;

  getProfile: () => Promise<User | null>;
  checkLogin: () => Promise<boolean>;
  logout: () => Promise<{ success: boolean; message: string }>;
  getCurrentUser: () => User | null;

  resendOtp: () => Promise<any>;
  clearOtpState: () => void;

  // Call this once on app mount (usually in root layout / _app / main.tsx)
  initializeAuth: () => Promise<void>;
}

// Helper to safely get current state in async actions
const getState = () => useAuthStore.getState();

export const useAuthStore = create<AuthState>()((set, get) => ({
  // ── Initial State ───────────────────────────────────────
  phone: "",
  token: null,
  refreshToken: null,
  loggedIn: false,
  otpSent: false,
  user: null,
  userId: null,
  isInitializing: true,

  // ── Simple setters ──────────────────────────────────────
  setPhone: (phone) => set({ phone }),
  setUser: (user) => set({ user, userId: user?.id ?? null }),

  // ── Core Auth Flows ─────────────────────────────────────

  signup: async (formData) => {
    const { name, email, mobile, password, ...optional } = formData;

    if (!name || !email || !mobile || !password) {
      return { success: false, message: "Name, email, mobile and password are required" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: "Invalid email format" };
    }

    if (!/^\d{10}$/.test(mobile)) {
      return { success: false, message: "Phone number must be 10 digits" };
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

      return { success: true, message: "OTP sent to your phone" };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Signup failed";
      console.error("Signup error:", msg);
      return { success: false, message: msg };
    }
  },

  requestOtp: async (phone) => {
    if (!/^\d{10}$/.test(phone)) {
      return { success: false, message: "Phone number must be 10 digits" };
    }

    try {
      const res = await axiosInstance.post<{ user_id: string | number }>("/auth/request-otp", {
        mobile: phone,
      });

      const { user_id } = res.data;

      Cookies.set("userId", String(user_id), COOKIE_OPTIONS);
      set({ otpSent: true, phone, userId: user_id });

      return {
        success: true,
        message: `OTP sent successfully to ${phone}`,
        userId: user_id,
      };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to send OTP";
      return { success: false, message: msg };
    }
  },

  verifyOtp: async (otp) => {
    const { userId, phone } = get();

    if (!userId) return { success: false, message: "No OTP request found. Please request OTP first." };
    if (!otp || otp.length !== 6) return { success: false, message: "OTP must be 6 digits" };

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
        phone,
        userId: user.id,
        otpSent: false,
        isInitializing: false,
      });

      return { success: true, message: "Login successful!", token, user };
    } catch (err: any) {
      const msg = err.response?.data?.message || "OTP verification failed";
      return { success: false, message: msg };
    }
  },

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

      // ── OTP-based login flow ──
      if (res.data.isLoginOtpSent) {
        const user_id = res.data.user_id;

        Cookies.set("userId", String(user_id), COOKIE_OPTIONS);

        set({
          otpSent: true,
          phone,
          userId: user_id,
        });

        return {
          success: true,
          otpSent: true,
          userId: user_id,
          message: res.data.message || "OTP sent to registered email/phone",
        };
      }

      // ── Direct login (password correct) ──
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

      return {
        success: true,
        otpSent: false,
        message: "Login successful!",
        token,
        user,
      };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || "Login failed";
      return { success: false, message: msg };
    }
  },

  getProfile: async () => {
    try {
      const res = await axiosInstance.get<{ data: User }>("/auth/profile-details");
      const user = res.data.data;

      set({
        user,
        userId: user.id,
        phone: user.mobile,
        loggedIn: true,
      });

      return user;
    } catch (err) {
      console.warn("Failed to fetch profile:", err);
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
      // Fire-and-forget logout request (don't block UI)
      axiosInstance.get("/auth/logout").catch(() => { });

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
    } catch (err: any) {
      return { success: false, message: "Logout failed" };
    }
  },

  getCurrentUser: () => {
    const { user, phone, userId } = get();
    if (!user) return null;
    return { ...user, phone, userId };
  },

  resendOtp: async () => {
    const { phone } = get();
    if (!phone) return { success: false, message: "No phone number available" };
    return get().requestOtp(phone);
  },

  clearOtpState: () => set({ otpSent: false, userId: null }),

initializeAuth: async () => {
  set({ isInitializing: true });

  try {
    const token = Cookies.get("authToken");
    const refreshToken = Cookies.get("refreshToken");
    const userIdCookie = Cookies.get("userId");

    const user = await get().getProfile();

    if (!token || !userIdCookie) {
      set({ isInitializing: false });
      return;
    }

    if (user) {
      set({
        loggedIn: true,
        user,
        userId: user.id,
        isInitializing: false,
      });
      return;
    }

    set({
      token,
      refreshToken: refreshToken ?? null,
    });

    if (!user) {
      await get().logout();
      return;
    }

    set({
      loggedIn: true,
      user,
      userId: user.id,
      phone: user.mobile,
      isInitializing: false,
    });
  } catch (err) {
    await get().logout();
  } finally {
    set({ isInitializing: false });
  }
},
}));