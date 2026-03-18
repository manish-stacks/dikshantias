// ─── User ───────────────────────────────────────────────
export interface User {
  id: string | number;
  name: string;
  email: string;
  mobile: string;
  createdAt: string;
}

// ─── Quiz Attempts ───────────────────────────────────────
export interface QuizAttempt {
  attemptId: string;
  attemptNumber: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  score: number;
  percentage?: number;
}

export interface AttemptsResponse {
  success: boolean;
  quizTitle: string;
  attempts: QuizAttempt[];
  totalAttemptsAllowed: number;
}

// ─── Quiz ────────────────────────────────────────────────
export interface Quiz {
  id: string;
  title: string;
  image: string;
  totalQuestions: number;
  attemptLimit: number;
  attemptsUsed: number;
  canAttempt: boolean;
}

export interface QuizOrder {
  quiz: Quiz;
  amountPaid: number;
}

export interface QuizOrdersResponse {
  success: boolean;
  quizzes: QuizOrder[];
}

// ─── Course / Batch ──────────────────────────────────────
export interface Subject {
  id: string | number;
  name: string;
  videoCount?: number;
}

export interface Program {
  name: string;
}

export interface Batch {
  id: string | number;
  name: string;
  imageUrl?: string;
  c_status?: string;
  category?: "online" | "offline";
  endDate?: string;
  startDate?: string;
  subjects?: Subject[];
  program?: Program;
}

export interface CourseOrder {
  id: string;
  type: string;
  totalAmount: number;
  createdAt: string;
  reason?: string;
  accessValidityDays?: number;
  batch: Batch;
  // computed
  expiryDate?: Date | null;
  expired?: boolean;
  isBatchIncluded?: boolean;
}

// ─── Video ───────────────────────────────────────────────
export interface Video {
  id: string;
  title: string;
  subjectId?: string;
  isLiveEnded?: boolean;
}

// ─── Settings / Assets ──────────────────────────────────
export interface Settings {
  playStoreUrl?: string;
  termsUrl?: string;
  privacyPolicyUrl?: string;
  instagramLink?: string;
  youtubeLink?: string;
  facebookLink?: string;
  telegramLink?: string;
  twitterLink?: string;
  linkedinLink?: string;
  appLogo?: string;
}

// ─── Filter ─────────────────────────────────────────────
export type AttemptFilter = "all" | "passed" | "failed";
export type CourseTab = "all" | "in-progress" | "completed";