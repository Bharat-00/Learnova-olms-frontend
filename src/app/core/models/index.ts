// ── Auth Models ──────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'STUDENT' | 'INSTRUCTOR';
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// ── User Models ──────────────────────────────────────────────
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  bio?: string;
  profilePicture?: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
}

// ── Course Models ─────────────────────────────────────────────
export interface Course {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  instructorId: number;
  instructorName?: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  language: string;
  price: number;
  isFree: boolean;
  published: boolean;
  duration?: number;
  totalLessons?: number;
  totalEnrollments?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  approved?: boolean;
  tags?: string[];
}

export interface CourseFilter {
  search?: string;
  category?: string;
  level?: string;
  language?: string;
  isFree?: boolean;
  page?: number;
  size?: number;
}

// ── Lesson Models ─────────────────────────────────────────────
export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description?: string;
  videoUrl?: string;
  duration?: number;
  orderIndex: number;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'RESOURCE';
  content?: string;
  isFree: boolean;
  createdAt?: string;
}

// ── Enrollment Models ─────────────────────────────────────────
export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  courseName?: string;
  courseThumb?: string;
  enrolledAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  expiresAt?: string;
  completionPercent?: number;
}

// ── Assesment Models (Note: intentional "assesment" spelling) ──
export interface Quiz {
  id: number;
  courseId: number;
  lessonId?: number;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore: number;
  totalQuestions?: number;
  shuffleQuestions?: boolean;
  allowMultipleAttempts?: boolean;
  createdAt?: string;
}

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: QuestionOption[];
  correctAnswer?: string;
  points: number;
  orderIndex: number;
}

export interface QuestionOption {
  id: number;
  optionText: string;
  isCorrect: boolean;
}

export interface Attempt {
  id: number;
  quizId: number;
  userId: number;
  quizTitle?: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt: string;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  points: number;
}

export interface AttemptRequest {
  quizId: number;
  answers: { questionId: number; selectedAnswer: string }[];
}

// ── Progress Models ───────────────────────────────────────────
export interface Progress {
  id: number;
  userId: number;
  courseId: number;
  lessonId: number;
  lessonTitle?: string;
  completed: boolean;
  completedAt?: string;
  watchedSeconds?: number;
}

export interface CourseProgress {
  courseId: number;
  courseTitle?: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  lastActivity?: string;
}

// ── Payment Models ────────────────────────────────────────────
export interface Payment {
  id: number;
  userId: number;
  courseId: number;
  courseName?: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  transactionId?: string;
  createdAt: string;
}

export interface Subscription {
  id: number;
  userId: number;
  plan: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  price: number;
  autoRenew: boolean;
}

// ── Discussion Models ─────────────────────────────────────────
export interface DiscussionThread {
  id: number;
  courseId: number;
  lessonId?: number;
  userId: number;
  authorName?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  replyCount?: number;
  isPinned?: boolean;
  isLocked?: boolean;
}

export interface Reply {
  id: number;
  threadId: number;
  userId: number;
  authorName?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isInstructor?: boolean;
}

// ── Notification Models ───────────────────────────────────────
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ANNOUNCEMENT';
  read: boolean;
  link?: string;
  createdAt: string;
}

// ── Certificate Models ────────────────────────────────────────
export interface Certificate {
  id: number;
  userId: number;
  courseId: number;
  courseTitle?: string;
  studentName?: string;
  instructorName?: string;
  issuedAt: string;
  certificateUrl?: string;
  verificationCode?: string;
}

// ── Pagination ────────────────────────────────────────────────
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

// ── API Response ──────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}
