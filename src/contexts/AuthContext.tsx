import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from "../lib/api-simple"

interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
  active: boolean
  department?: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        // 一時的にモックユーザーを設定
        setUser({
          id: 1,
          email: 'taro@tech.example.com',
          name: '田中太郎',
          role: 'user',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // モックログインシステム - 実際のAPIを使わずにログイン成功をシミュレート
      if (email && password) {
        // モックトークンを設定
        const mockToken = 'mock-jwt-token-' + Date.now()
        localStorage.setItem('auth_token', mockToken)
        
        // ユーザータイプに基づいてモックユーザーを設定
        const mockUser: User = {
          id: email.includes('admin') ? 1 : 2,
          email: email,
          name: email.includes('admin') ? '管理者' : 'ユーザー',
          role: email.includes('admin') ? 'admin' : 'user',
          active: true,
          department: {
            id: 1,
            name: email.includes('admin') ? '管理部' : '開発部'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        setUser(mockUser)
      } else {
        throw new Error('メールアドレスとパスワードを入力してください')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    // モックログアウトシステム
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}