import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../contexts/AuthContext'

const loginSchema = z.object({
  email: z.string().min(1, 'メールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await login(data.email, data.password)
    } catch (err) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.25rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            Posifeed
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#6b7280'
          }}>
            ポジティブなフィードバックでチームのモチベーション向上
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
          padding: '2rem'
        }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit(onSubmit)}>
            {/* テストログイン情報 */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0.375rem',
              padding: '1rem'
            }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem' }}>
                テストログイン
              </h3>
              <div style={{ fontSize: '0.75rem', color: '#1e40af', lineHeight: '1.4' }}>
                <p><strong>一般ユーザー:</strong> user@example.com / password123</p>
                <p><strong>管理者:</strong> admin@example.com / password123</p>
                <p><em>※ どちらも任意のメールアドレス・パスワードでログイン可能です</em></p>
              </div>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                padding: '1rem'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                メールアドレス
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="your@email.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
              {errors.email && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                パスワード
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                placeholder="パスワードを入力"
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6'
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db'
                  e.target.style.boxShadow = 'none'
                }}
              />
              {errors.password && (
                <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#dc2626' }}>
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white',
                fontWeight: '600',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                }
              }}
            >
              {isLoading ? (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '1rem',
                    height: '1rem',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  ログイン中...
                </span>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ width: '100%', borderTop: '1px solid #d1d5db' }} />
              </div>
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '0.875rem'
              }}>
                <span style={{
                  padding: '0 0.5rem',
                  backgroundColor: 'white',
                  color: '#6b7280'
                }}>
                  テストアカウント
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '0.375rem',
                padding: '1rem',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  fontWeight: '500',
                  color: '#1e40af',
                  marginBottom: '0.5rem'
                }}>
                  利用可能なアカウント
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  color: '#1e40af'
                }}>
                  <div>
                    <span style={{ fontWeight: '500' }}>管理者:</span> admin@tech.example.com
                  </div>
                  <div>
                    <span style={{ fontWeight: '500' }}>一般ユーザー:</span> taro@tech.example.com
                  </div>
                  <div>
                    <span style={{ fontWeight: '500' }}>パスワード:</span> password123
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          © 2024 Posifeed. チームのモチベーション向上を支援します。
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  )
}

export default LoginForm