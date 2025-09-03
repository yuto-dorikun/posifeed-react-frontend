import React, { useState, useEffect } from 'react'
import { api } from "../lib/api-simple"
import { Feedback, FeedbackCategory } from "../types/simple"

const categoryLabels: Record<FeedbackCategory, { label: string; icon: string; color: string }> = {
  gratitude: { label: 'ありがとう', icon: '🙏', color: '#10b981' },
  admiration: { label: 'すごい！', icon: '✨', color: '#f59e0b' },
  appreciation: { label: 'お疲れさま', icon: '💪', color: '#3b82f6' },
  respect: { label: 'さすが', icon: '👏', color: '#8b5cf6' }
}

const ReceivedFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | 'all'>('all')
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setIsLoading(true)
      try {
        // 一時的にモックデータを使用
        const mockFeedbacks = [
          {
            id: 1,
            message: "昨日のプレゼンテーション、とても分かりやすくて素晴らしかったです！お疲れ様でした。",
            category: "gratitude" as const,
            isRead: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            sender: { name: "佐藤 花子" },
            reactionsCount: 3
          },
          {
            id: 2,
            message: "新機能の実装、バグもなくスムーズでした。技術力の高さに感服です。",
            category: "admiration" as const,
            isRead: true,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            sender: { name: "田中 太郎" },
            reactionsCount: 5
          }
        ]
        setFeedbacks(mockFeedbacks)
        setFilteredFeedbacks(mockFeedbacks)
      } catch (err: any) {
        setError(err.response?.data?.error || '受信フィードバックの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredFeedbacks(feedbacks)
    } else {
      setFilteredFeedbacks(feedbacks.filter(f => f.category === selectedCategory))
    }
  }, [selectedCategory, feedbacks])

  const markAsRead = async (feedbackId: number) => {
    try {
      await api.patch(`/feedbacks/${feedbackId}/mark_read`)
      setFeedbacks(prev => prev.map(f => 
        f.id === feedbackId ? { ...f, isRead: true } : f
      ))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const openFeedbackDetail = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
    if (!feedback.isRead) {
      markAsRead(feedback.id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            受信フィードバック
          </h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          あなたに送られたフィードバック一覧
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
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem'
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
              transition: 'all 0.2s'
            }}
          >
            すべて ({feedbacks.length})
          </button>
          
          {Object.entries(categoryLabels).map(([category, info]) => {
            const count = feedbacks.filter(f => f.category === category).length
            return (
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
                  gap: '0.5rem'
                }}
              >
                <span>{info.icon}</span>
                {info.label} ({count})
              </button>
            )
          })}
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
            {selectedCategory === 'all' 
              ? 'まだフィードバックを受信していません' 
              : `${categoryLabels[selectedCategory as FeedbackCategory]?.label}カテゴリのフィードバックはありません`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFeedbacks.map(feedback => {
            const categoryInfo = categoryLabels[feedback.category]
            return (
              <div
                key={feedback.id}
                onClick={() => openFeedbackDetail(feedback)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.75rem',
                  border: feedback.isRead ? '1px solid #e5e7eb' : '2px solid #3b82f6',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {!feedback.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#3b82f6',
                    borderRadius: '50%'
                  }} />
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: `${categoryInfo.color}20`,
                    borderRadius: '0.5rem',
                    marginRight: '1rem'
                  }}>
                    <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>
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
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        {feedback.isAnonymous ? '匿名' : feedback.sender?.name || '不明'}
                      </span>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}>
                        {formatDate(feedback.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <p style={{
                  color: '#4b5563',
                  lineHeight: '1.6',
                  fontSize: '0.95rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {feedback.content}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f3f4f6'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {feedback.isRead ? '既読' : '未読'}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {feedback.reactionsCount || 0}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* フィードバック詳細モーダル */}
      {selectedFeedback && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            maxWidth: '32rem',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedFeedback(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280',
                width: '2rem',
                height: '2rem',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: `${categoryLabels[selectedFeedback.category].color}20`,
                borderRadius: '0.5rem'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.75rem' }}>
                  {categoryLabels[selectedFeedback.category].icon}
                </span>
                <span style={{
                  color: categoryLabels[selectedFeedback.category].color,
                  fontWeight: '700',
                  fontSize: '1.125rem'
                }}>
                  {categoryLabels[selectedFeedback.category].label}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '1.125rem'
                }}>
                  {selectedFeedback.isAnonymous ? '匿名' : selectedFeedback.sender?.name || '不明'}
                </span>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {formatDate(selectedFeedback.createdAt)}
                </span>
              </div>
              
              <p style={{
                color: '#4b5563',
                lineHeight: '1.7',
                fontSize: '1rem',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedFeedback.content}
              </p>
            </div>

            <div style={{
              paddingTop: '1rem',
              borderTop: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setSelectedFeedback(null)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceivedFeedback