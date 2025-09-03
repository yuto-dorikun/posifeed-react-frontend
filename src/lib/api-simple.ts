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
  async login(credentials: { email: string; password: string }): Promise<{ user: any; token: string }> {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
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

  async getCurrentUser(): Promise<any> {
    return this.request<any>('/auth/me')
  }

  // 基本的なGET/POST/PATCH/DELETE メソッド
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint)
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    })
  }

  // フィードバック関連API
  async getFeedbacks(params: { type?: string; per_page?: number } = {}): Promise<{ data: any[] }> {
    const query = new URLSearchParams()
    if (params.type) query.append('type', params.type)
    if (params.per_page) query.append('per_page', params.per_page.toString())
    
    const endpoint = `/feedbacks${query.toString() ? `?${query.toString()}` : ''}`
    return this.request<{ data: any[] }>(endpoint)
  }
}

export const apiClient = new ApiClient()
export const api = apiClient
export default apiClient