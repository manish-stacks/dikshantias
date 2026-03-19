import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import type {
  QuizAttempt,
  QuizOrder,
  CourseOrder,
  Settings,
  Batch,
  Video,
} from "@/types";

function addDays(dateStr: string, days: number): Date | null {
  if (!days || days <= 0) return null;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

function isExpired(d: Date | null): boolean {
  return !!d && new Date() > d;
}

interface AttemptsState {
  quizTitle: string;
  allAttempts: QuizAttempt[];
  totalAllowed: number;
  loading: boolean;
  error: string | null;
  fetchAttempts: (quizId: string) => Promise<void>;
}

export const useAttemptsStore = create<AttemptsState>((set) => ({
  quizTitle: "",
  allAttempts: [],
  totalAllowed: 0,
  loading: false,
  error: null,

  fetchAttempts: async (quizId) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/quiz/my-attempts/quiz/${quizId}`);
      if (res.data.success) {
        set({
          quizTitle: res.data.quizTitle || "Quiz",
          allAttempts: res.data.attempts || [],
          totalAllowed: res.data.totalAttemptsAllowed || 0,
        });
      } else {
        set({ error: "Failed to load attempts" });
      }
    } catch {
      set({ error: "Network error. Please try again." });
    } finally {
      set({ loading: false });
    }
  },
}));

// ─── My Quizzes Store ────────────────────────────────────
interface QuizState {
  quizzes: QuizOrder[];
  loading: boolean;
  fetchQuizzes: (userId: string | number) => Promise<void>;
}

export const useQuizStore = create<QuizState>((set) => ({
  quizzes: [],
  loading: false,

  fetchQuizzes: async (userId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/orders/quiz-orders/${userId}`);
      if (res.data.success) {
        set({ quizzes: res.data.quizzes || [] });
      }
    } catch {
      console.error("Error fetching quizzes");
    } finally {
      set({ loading: false });
    }
  },
}));

// ─── My Courses Store ────────────────────────────────────
interface ProcessedCourse extends CourseOrder {
  expiryDate: Date | null;
  expired: boolean;
  isBatchIncluded: boolean;
}

interface CourseState {
  courses: ProcessedCourse[];
  loading: boolean;
  fetchCourses: (userId: string | number) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  loading: false,

  fetchCourses: async (userId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/Orders/user/${userId}`);
      if (res.data) {
        const batchOrders: CourseOrder[] = res.data.filter(
          (i: CourseOrder) => i.type === "batch"
        );

        const processed: ProcessedCourse[] = batchOrders.map((order) => {
          const isBatchIncluded = order.reason === "BATCH_INCLUDED";
          let expiryDate: Date | null = null;
          if (
            !isBatchIncluded &&
            typeof order.accessValidityDays === "number" &&
            order.accessValidityDays > 0
          ) {
            expiryDate = addDays(order.createdAt, order.accessValidityDays);
          }
          return {
            ...order,
            batch: order.batch || ({} as Batch),
            expiryDate,
            expired: isExpired(expiryDate),
            isBatchIncluded,
          };
        });

        // Sort: active first, expired last
        processed.sort((a, b) => {
          if (a.expired && !b.expired) return 1;
          if (!a.expired && b.expired) return -1;
          return 0;
        });

        set({ courses: processed });
      }
    } catch {
      console.error("Error fetching courses");
    } finally {
      set({ loading: false });
    }
  },
}));

// ─── Settings Store ──────────────────────────────────────
interface SettingsState {
  settings: Settings;
  loading: boolean;
  fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {},
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/settings");
      set({ settings: res.data || {} });
    } catch {
      console.error("Error fetching settings");
    } finally {
      set({ loading: false });
    }
  },
}));

// ─── Course Subjects Store ───────────────────────────────
interface SubjectState {
  batch: Batch | null;
  videos: Video[];
  loading: boolean;
  fetchBatchAndVideos: (courseId: string, unlocked: boolean) => Promise<void>;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  batch: null,
  videos: [],
  loading: false,

  fetchBatchAndVideos: async (courseId, unlocked) => {
    set({ loading: true });
    try {
      const [batchRes, videosRes] = await Promise.all([
        axiosInstance.get(`/batchs/${courseId}`),
        unlocked ? axiosInstance.get(`/videocourses/batch/${courseId}`) : Promise.resolve(null),
      ]);
      set({
        batch: batchRes.data || null,
        videos: videosRes?.data?.data || [],
      });
    } catch {
      console.error("Error fetching batch/videos");
    } finally {
      set({ loading: false });
    }
  },
}));