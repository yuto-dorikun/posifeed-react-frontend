import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { apiClient } from "../lib/api-simple"
import FeedbackModal from '../components/FeedbackModal'

interface Feedback {
  id: number
  message: string
  category_name: string
  category_emoji: string
  created_at: string
  sender?: {
    display_name: string
  }
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [recentFeedbacks, setRecentFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // モックデータを使用してAPI呼び出しをスキップ
    const mockFeedbacks: Feedback[] = [
      {
        id: 1,
        message: "昨日のプレゼンテーション、とても分かりやすくて素晴らしかったです！お疲れ様でした。",
        category_name: "ありがとう",
        category_emoji: "🙏",
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        sender: { display_name: "佐藤 花子" }
      },
      {
        id: 2,
        message: "新機能の実装、バグもなくスムーズでした。技術力の高さに感服です。",
        category_name: "すごい！", 
        category_emoji: "✨",
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        sender: { display_name: "田中 太郎" }
      },
      {
        id: 3,
        message: "長時間の作業、本当にお疲れ様でした。体調に気をつけてくださいね。",
        category_name: "お疲れさま",
        category_emoji: "💪",
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sender: { display_name: "山田 次郎" }
      },
      {
        id: 4,
        message: "困難な状況でも的確な判断で問題を解決する能力、本当にさすがです。",
        category_name: "さすが",
        category_emoji: "👏",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        sender: { display_name: "鈴木 一郎" }
      }
    ]
    
    setRecentFeedbacks(mockFeedbacks)
    setLoading(false)
  }, [])

  const stats = [
    {
      title: '今週の受信フィードバック',
      value: '12',
      change: '+12%',
      changeColor: '#059669'
    },
    {
      title: '今週の送信フィードバック',
      value: '8',
      change: '+8%',
      changeColor: '#059669'
    },
    {
      title: 'ポジティビティスコア',
      value: '85',
      change: '+5pts',
      changeColor: '#059669'
    },
    {
      title: '組織メンバー',
      value: '24',
      change: '+2',
      changeColor: '#059669'
    }
  ]

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}時間前`
    }
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}日前`
  }

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header with Send Feedback Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold',
          color: '#111827'
        }}>
          ダッシュボード
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          フィードバックを送る
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280',
                marginBottom: '0.5rem'
              }}>
                {stat.title}
              </p>
              <p style={{
                fontSize: '2.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem'
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: stat.changeColor,
                fontWeight: '500'
              }}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Feedbacks and Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #d1d5db'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              最近のフィードバック
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.25rem'
            }}>
              あなたが最近受け取ったフィードバック
            </p>
          </div>
          <div style={{ padding: '1rem' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div style={{
                      height: '0.75rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '0.25rem',
                      width: '75%',
                      marginBottom: '0.5rem'
                    }}></div>
                    <div style={{
                      height: '0.5rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '0.25rem',
                      width: '50%'
                    }}></div>
                  </div>
                ))}
              </div>
            ) : recentFeedbacks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentFeedbacks.map((feedback) => (
                  <div key={feedback.id} style={{
                    borderLeft: '2px solid #3b82f6',
                    paddingLeft: '0.75rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '0.25rem'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        {feedback.category_emoji} {feedback.category_name}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6b7280'
                      }}>
                        {formatRelativeTime(feedback.created_at)}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      marginBottom: '0.25rem'
                    }}>
                      {feedback.message}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
                      {feedback.sender ? `from ${feedback.sender.display_name}` : '匿名'}
                    </p>
                  </div>
                ))}
                <Link to="/received">
                  <button style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    color: '#2563eb',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    すべて見る
                  </button>
                </Link>
              </div>
            ) : (
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                textAlign: 'center',
                padding: '2rem 0'
              }}>
                まだフィードバックがありません
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #d1d5db'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              クイックアクション
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              marginTop: '0.25rem'
            }}>
              よく使う機能に素早くアクセス
            </p>
          </div>
          <div style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                textAlign: 'left'
              }}>
                フィードバックを送信
            </button>
            <Link to="/users">
              <button style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                textAlign: 'left'
              }}>
                メンバー一覧を見る
              </button>
            </Link>
            <Link to="/stats">
              <button style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.875rem',
                color: '#374151',
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                textAlign: 'left'
              }}>
                統計を確認
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          // リフレッシュやトーストメッセージなど
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default Dashboard