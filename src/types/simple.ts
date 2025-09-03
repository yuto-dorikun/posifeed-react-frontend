// 基本的な型定義
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

export interface FeedbackFormData {
  recipientId: string
  category: FeedbackCategory
  content: string
  isAnonymous: boolean
}