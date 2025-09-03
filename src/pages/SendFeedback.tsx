import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from "../lib/api-simple"

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

type FeedbackCategory = 'gratitude' | 'admiration' | 'appreciation' | 'respect'

const feedbackSchema = z.object({
  recipientId: z.string().min(1, '送信先を選択してください'),
  category: z.enum(['gratitude', 'admiration', 'appreciation', 'respect'], {
    required_error: 'カテゴリを選択してください'
  }),
  content: z.string().min(10, 'メッセージは10文字以上で入力してください').max(500, 'メッセージは500文字以下で入力してください'),
  isAnonymous: z.boolean().default(false)
})

type FeedbackFormData = z.infer<typeof feedbackSchema>

const categoryLabels: Record<FeedbackCategory, { label: string; icon: string; description: string; color: string }> = {
  gratitude: {
    label: 'ありがとう',
    icon: '🙏',
    description: '感謝の気持ちを伝える',
    color: '#10b981'
  },
  admiration: {
    label: 'すごい！',
    icon: '✨',
    description: '成果や頑張りを称える',
    color: '#f59e0b'
  },
  appreciation: {
    label: 'お疲れさま',
    icon: '💪',
    description: '努力をねぎらう',
    color: '#3b82f6'
  },
  respect: {
    label: 'さすが',
    icon: '👏',
    description: '能力や判断力を評価する',
    color: '#8b5cf6'
  }
}

const SendFeedback: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  })

  const selectedCategory = watch('category')

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        // 一時的にモックユーザーを使用
        const mockUsers = [
          {
            id: 1,
            email: 'admin@tech.example.com',
            name: '管理者ユーザー',
            role: 'admin' as const,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            email: 'hanako@tech.example.com', 
            name: '佐藤 花子',
            role: 'user' as const,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 3,
            email: 'jiro@tech.example.com',
            name: '山田 次郎', 
            role: 'user' as const,
            active: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        setUsers(mockUsers)
      } catch (err) {
        setError('ユーザー一覧の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      // 一時的にモック送信処理を使用
      await new Promise(resolve => setTimeout(resolve, 1000)) // 送信中の状態を再現
      
      const recipient = users.find(u => u.id.toString() === data.recipientId)
      const categoryLabel = categoryLabels[data.category as FeedbackCategory]
      setSuccessMessage(`${recipient?.name}さんに「${categoryLabel.label}」フィードバックを送信しました！`)
      reset()
    } catch (err: any) {
      setError('フィードバックの送信に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          marginBottom: '0.5rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            フィードバック送信
          </h1>
        </div>
      </div>

      {successMessage && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '0.5rem',
          color: '#166534',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          color: '#dc2626',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 送信先選択 */}
          <div>
            <label htmlFor="recipientId" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              送信先
            </label>
            <select
              {...register('recipientId')}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.recipientId ? '1px solid #f87171' : '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                backgroundColor: isLoading ? '#f9fafb' : 'white',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="">選択してください</option>
              {users.map(user => (
                <option key={user.id} value={user.id.toString()}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.recipientId && (
              <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem' }}>
                {errors.recipientId.message}
              </p>
            )}
          </div>

          {/* カテゴリ選択 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '1rem'
            }}>
              フィードバックカテゴリ
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(categoryLabels).map(([category, info]) => (
                <label
                  key={category}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1rem',
                    border: selectedCategory === category 
                      ? `2px solid ${info.color}` 
                      : '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === category ? `${info.color}10` : 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="radio"
                    value={category}
                    {...register('category')}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                      {info.icon}
                    </span>
                    <span style={{
                      fontWeight: '600',
                      fontSize: '1rem',
                      color: selectedCategory === category ? info.color : '#374151'
                    }}>
                      {info.label}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0'
                  }}>
                    {info.description}
                  </p>
                </label>
              ))}
            </div>
            {errors.category && (
              <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.5rem' }}>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* メッセージ入力 */}
          <div>
            <label htmlFor="content" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              メッセージ
            </label>
            <textarea
              {...register('content')}
              placeholder="具体的で心のこもったメッセージを書いてください..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.content ? '1px solid #f87171' : '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
            {errors.content && (
              <p style={{ fontSize: '0.875rem', color: '#dc2626', marginTop: '0.25rem' }}>
                {errors.content.message}
              </p>
            )}
          </div>

          {/* 匿名オプション */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0'
          }}>
            <input
              type="checkbox"
              {...register('isAnonymous')}
              style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
            />
            <div>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                display: 'block',
                marginBottom: '0.25rem'
              }}>
                匿名で送信
              </label>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                チェックすると、送信者の名前は表示されません
              </p>
            </div>
          </div>

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.875rem 1.5rem',
              backgroundColor: isSubmitting ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isSubmitting ? '送信中...' : 'フィードバックを送信'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SendFeedback