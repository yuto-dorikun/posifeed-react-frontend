// ユーザー関連の型定義
export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
  active: boolean
  department?: {
    id: number
    name: string
  }
  organization?: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
}

// 組織関連の型定義
export interface Organization {
  id: number
  name: string
  description?: string
  domain?: string
  active: boolean
  stats: {
    total_users: number
    total_feedbacks: number
    departments_count: number
  }
  created_at: string
  updated_at: string
}

// フィードバック関連の型定義
export type FeedbackCategory = 'gratitude' | 'admiration' | 'appreciation' | 'respect'

export interface Feedback {
  id: number
  content: string
  category: FeedbackCategory
  isAnonymous: boolean
  isRead: boolean
  reactionsCount: number
  createdAt: string
  updatedAt: string
  sender?: {
    id: number
    name: string
  }
  recipient?: {
    id: number
    name: string
  }
}

// リアクション関連の型定義
export type ReactionType = 'thanks' | 'like' | 'celebrate'

export interface FeedbackReaction {
  id: number
  reaction_type: ReactionType
  reaction_name: string
  reaction_emoji: string
  user: {
    id: number
    display_name: string
  }
  created_at: string
}

// API レスポンス関連の型定義
export interface ApiResponse<T> {
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    total_pages: number
    total_count: number
    per_page: number
  }
}

// 認証関連の型定義
export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

// フォーム関連の型定義
export interface FeedbackFormData {
  recipientId: string
  category: FeedbackCategory
  content: string
  isAnonymous: boolean
}

export interface ProfileFormData {
  first_name: string
  last_name: string
  display_name: string
  job_title: string
}

// 統計関連の型定義
export interface UserStats {
  user: {
    id: number
    display_name: string
    job_title?: string
    department?: string
    stats: {
      sent_feedbacks_count: number
      received_feedbacks_count: number
      positivity_score: number
    }
  }
  period_stats: {
    period: string
    sent_total: number
    received_total: number
    sent_by_category: Record<FeedbackCategory, {
      count: number
      name: string
      emoji: string
    }>
    received_by_category: Record<FeedbackCategory, {
      count: number
      name: string
      emoji: string
    }>
  }
  weekly_trends: Array<{
    week: string
    sent: number
    received: number
    positivity_score: number
  }>
  overall_stats: {
    total_sent: number
    total_received: number
    positivity_score: number
  }
}