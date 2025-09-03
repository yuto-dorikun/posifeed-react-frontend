import React, { useState, useEffect } from 'react'
import { api } from "../lib/api-simple"

interface Feedback {
  id: number
  message: string
  category: string
  isRead: boolean
  isAnonymous: boolean
  createdAt: string
  recipient: {
    name: string
  }
}

type FeedbackCategory = 'gratitude' | 'admiration' | 'appreciation' | 'respect'

const categoryLabels: Record<FeedbackCategory, { label: string; icon: string; color: string }> = {
  gratitude: { label: 'ありがとう', icon: '🙏', color: '#10b981' },
  admiration: { label: 'すごい！', icon: '✨', color: '#f59e0b' },
  appreciation: { label: 'お疲れさま', icon: '💪', color: '#3b82f6' },
  respect: { label: 'さすが', icon: '👏', color: '#8b5cf6' }
}

const SentFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | 'all'>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7d' | '30d' | '90d'>('all')

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true)
      try {
        // 一時的にモックデータを使用
        const mockFeedbacks = [
          {
            id: 1,
            message: "新機能の実装、本当にお疲れ様でした。バグも少なくて素晴らしいです！",
            category: "appreciation",
            isRead: true,
            isAnonymous: false,
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            recipient: { name: "田中 太郎" }
          },
          {
            id: 2,
            message: "プレゼンテーションの技術力とわかりやすさに感動しました。",
            category: "admiration",
            isRead: false,
            isAnonymous: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            recipient: { name: "佐藤 花子" }
          },
          {
            id: 3,
            message: "昨日は本当にありがとうございました。とても助かりました！",
            category: "gratitude",
            isRead: true,
            isAnonymous: false,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            recipient: { name: "山田 花子" }
          }
        ]
        setFeedbacks(mockFeedbacks)
        setFilteredFeedbacks(mockFeedbacks)
      } catch (err: any) {
        setError(err.response?.data?.error || '送信フィードバックの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  useEffect(() => {
    let filtered = feedbacks

    // カテゴリフィルター
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === selectedCategory)
    }

    // 期間フィルター
    if (selectedPeriod !== 'all') {
      const now = new Date()
      const daysAgo = {
        '7d': 7,
        '30d': 30,
        '90d': 90
      }[selectedPeriod]
      
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(f => new Date(f.createdAt) >= cutoffDate)
    }

    setFilteredFeedbacks(filtered)
  }, [selectedCategory, selectedPeriod, feedbacks])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeDate = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今日'
    if (diffDays === 1) return '昨日'
    if (diffDays < 7) return `${diffDays}日前`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}ヶ月前`
    return `${Math.floor(diffDays / 365)}年前`
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div style={{ color: '#6b7280', fontSize: '1.125rem' }}>読み込み中...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          marginBottom: '0.5rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            送信履歴
          </h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          あなたが送信したフィードバック一覧
        </p>
      </div>

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

      {/* 統計サマリー */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            marginBottom: '0.5rem'
          }}>
            {feedbacks.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            総送信数
          </div>
        </div>

        {Object.entries(categoryLabels).map(([category, info]) => {
          const count = feedbacks.filter(f => f.category === category).length
          return (
            <div
              key={category}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                border: `1px solid ${info.color}40`,
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
              }}
            >
              <div style={{
                fontSize: '1.5rem',
                marginBottom: '0.5rem'
              }}>
                {info.icon}
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: info.color,
                marginBottom: '0.25rem'
              }}>
                {count}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {info.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* フィルター */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ fontWeight: '600', color: '#374151' }}>フィルター</span>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            カテゴリ
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '0.5rem 1rem',
                border: selectedCategory === 'all' ? '2px solid #3b82f6' : '1px solid #d1d5db',
                borderRadius: '0.5rem',
                backgroundColor: selectedCategory === 'all' ? '#eff6ff' : 'white',
                color: selectedCategory === 'all' ? '#1d4ed8' : '#374151',
                fontWeight: selectedCategory === 'all' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem'
              }}
            >
              すべて
            </button>
            
            {Object.entries(categoryLabels).map(([category, info]) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as FeedbackCategory)}
                style={{
                  padding: '0.5rem 1rem',
                  border: selectedCategory === category ? `2px solid ${info.color}` : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: selectedCategory === category ? `${info.color}20` : 'white',
                  color: selectedCategory === category ? info.color : '#374151',
                  fontWeight: selectedCategory === category ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.875rem'
                }}
              >
                <span>{info.icon}</span>
                {info.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ 
            fontSize: '0.875rem',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            期間
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            {[
              { key: 'all', label: 'すべて' },
              { key: '7d', label: '過去7日' },
              { key: '30d', label: '過去30日' },
              { key: '90d', label: '過去90日' }
            ].map(period => (
              <button
                key={period.key}
                onClick={() => setSelectedPeriod(period.key as typeof selectedPeriod)}
                style={{
                  padding: '0.5rem 1rem',
                  border: selectedPeriod === period.key ? '2px solid #3b82f6' : '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  backgroundColor: selectedPeriod === period.key ? '#eff6ff' : 'white',
                  color: selectedPeriod === period.key ? '#1d4ed8' : '#374151',
                  fontWeight: selectedPeriod === period.key ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.875rem'
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* フィードバックリスト */}
      {filteredFeedbacks.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '3rem',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            フィードバックがありません
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            選択した条件に該当するフィードバックがありません
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          overflow: 'hidden'
        }}>
          {filteredFeedbacks.map((feedback, index) => {
            const categoryInfo = categoryLabels[feedback.category as FeedbackCategory] || { label: 'その他', icon: '📝', color: '#6b7280' }
            return (
              <div
                key={feedback.id}
                style={{
                  padding: '1.5rem',
                  borderBottom: index < filteredFeedbacks.length - 1 ? '1px solid #f3f4f6' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: `${categoryInfo.color}20`,
                      borderRadius: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1rem', marginRight: '0.5rem' }}>
                        {categoryInfo.icon}
                      </span>
                      <span style={{
                        color: categoryInfo.color,
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {categoryInfo.label}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                        {feedback.recipient?.name || '不明'}
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {getRelativeDate(feedback.createdAt)}
                        {feedback.isAnonymous && (
                          <span style={{
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem'
                          }}>
                            匿名
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {feedback.isRead ? '既読' : '未読'}
                  </div>
                </div>

                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.6',
                  fontSize: '0.95rem',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {feedback.message}
                </p>

                <div style={{
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>
                  送信日時: {formatDate(feedback.createdAt)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SentFeedback