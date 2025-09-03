import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  Feedback, 
  FeedbackFormData,
  PaginatedResponse,
  Organization,
  UserStats,
  FeedbackReaction,
  ReactionType
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('auth_token')
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP Error: ${response.status}`)
    }

    return response.json()
  }

  // 認証関連API
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    if (response.token) {
      this.setToken(response.token)
    }
    
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'DELETE' })
    } finally {
      this.clearToken()
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  // フィードバック関連API
  async getFeedbacks(params: {
    page?: number
    per_page?: number
    type?: 'sent' | 'received'
  } = {}): Promise<PaginatedResponse<Feedback>> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const endpoint = params.type ? `/feedbacks/${params.type}` : '/feedbacks'
    const query = searchParams.toString()
    
    return this.request<PaginatedResponse<Feedback>>(
      `${endpoint}${query ? `?${query}` : ''}`
    )
  }

  async createFeedback(data: FeedbackFormData): Promise<Feedback> {
    return this.request<Feedback>('/feedbacks', {
      method: 'POST',
      body: JSON.stringify({ feedback: data }),
    })
  }

  async updateFeedback(id: number, data: Partial<FeedbackFormData>): Promise<Feedback> {
    return this.request<Feedback>(`/feedbacks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ feedback: data }),
    })
  }

  async deleteFeedback(id: number): Promise<void> {
    await this.request(`/feedbacks/${id}`, { method: 'DELETE' })
  }

  async markFeedbackAsRead(id: number): Promise<Feedback> {
    return this.request<Feedback>(`/feedbacks/${id}/read`, {
      method: 'PATCH',
    })
  }

  // リアクション関連API
  async addReaction(feedbackId: number, reactionType: ReactionType): Promise<{
    message: string
    reaction: FeedbackReaction
  }> {
    return this.request(`/feedbacks/${feedbackId}/reaction`, {
      method: 'POST',
      body: JSON.stringify({ 
        reaction: { reaction_type: reactionType }
      }),
    })
  }

  async removeReaction(feedbackId: number): Promise<{ message: string }> {
    return this.request(`/feedbacks/${feedbackId}/reaction`, {
      method: 'DELETE',
    })
  }

  // ユーザー関連API
  async getUsers(): Promise<{ users: User[] }> {
    return this.request<{ users: User[] }>('/users')
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`)
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ user: data }),
    })
  }

  async getUserStats(id: number, period = '30'): Promise<UserStats> {
    return this.request<UserStats>(`/users/${id}/stats?period=${period}`)
  }

  // 組織関連API
  async getOrganization(): Promise<Organization> {
    return this.request<Organization>('/organization')
  }

  async getOrganizationUsers(): Promise<{
    organization: Organization
    users: User[]
  }> {
    return this.request('/organization/users')
  }

  // ヘルスチェック
  async healthCheck(): Promise<{
    status: string
    database: string
    redis: string
    timestamp: string
    environment: string
    version: string
  }> {
    return this.request('/health')
  }
}

export const apiClient = new ApiClient()
export const api = apiClient
export default apiClient