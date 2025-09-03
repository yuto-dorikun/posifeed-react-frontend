import React, { useState, useEffect } from 'react'
import { api } from "../lib/api-simple"

type FeedbackCategory = 'gratitude' | 'admiration' | 'appreciation' | 'respect'

interface StatisticsData {
  totalFeedbacks: number
  totalUsers: number
  feedbacksByCategory: Record<FeedbackCategory, number>
  feedbacksThisMonth: number
  feedbacksLastMonth: number
  topSenders: Array<{
    id: number
    name: string
    count: number
  }>
  topReceivers: Array<{
    id: number
    name: string
    count: number
  }>
  feedbackTrends: Array<{
    date: string
    count: number
  }>
  departmentStats: Array<{
    name: string
    count: number
    percentage: number
  }>
}

const categoryLabels: Record<FeedbackCategory, { label: string; icon: string; color: string }> = {
  gratitude: { label: 'ありがとう', icon: '🙏', color: '#10b981' },
  admiration: { label: 'すごい！', icon: '✨', color: '#f59e0b' },
  appreciation: { label: 'お疲れさま', icon: '💪', color: '#3b82f6' },
  respect: { label: 'さすが', icon: '👏', color: '#8b5cf6' }
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // 直接fetch呼び出しで統計APIにアクセス
        const response = await fetch(`http://localhost:3001/api/v1/statistics?period=${selectedPeriod}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Statistics API response:', data)
        
        // APIレスポンスをStatisticsData形式に変換
        const transformedStats: StatisticsData = {
          totalFeedbacks: data.totalFeedbacks || 0,
          totalUsers: data.totalUsers || 0,
          feedbacksByCategory: {
            gratitude: data.feedbacksByCategory?.gratitude || 0,
            admiration: data.feedbacksByCategory?.admiration || 0,
            appreciation: data.feedbacksByCategory?.appreciation || 0,
            respect: data.feedbacksByCategory?.respect || 0
          },
          feedbacksThisMonth: data.feedbacksThisMonth || 0,
          feedbacksLastMonth: data.feedbacksLastMonth || 0,
          topSenders: data.topSenders || [],
          topReceivers: data.topReceivers || [],
          feedbackTrends: data.feedbackTrends || [],
          departmentStats: data.departmentStats || []
        }
        
        setStats(transformedStats)
      } catch (err: any) {
        console.error('Statistics API error:', err)
        
        // 詳細なエラー情報を表示
        let errorMessage = '統計データの取得に失敗しました'
        if (err.message) {
          errorMessage += ': ' + err.message
        }
        
        setError(errorMessage)
        
        // エラー時にモックデータを使用
        const mockStats: StatisticsData = {
          totalFeedbacks: 0,
          totalUsers: 0,
          feedbacksByCategory: {
            gratitude: 0,
            admiration: 0,
            appreciation: 0,
            respect: 0
          },
          feedbacksThisMonth: 0,
          feedbacksLastMonth: 0,
          topSenders: [],
          topReceivers: [],
          feedbackTrends: [],
          departmentStats: []
        }
        setStats(mockStats)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatistics()
  }, [selectedPeriod])

  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ja-JP').format(num)
  }

  const getMaxValue = (data: Array<{ count: number }>) => {
    return Math.max(...data.map(d => d.count), 1)
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

  if (!stats) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div style={{ color: '#6b7280', fontSize: '1.125rem' }}>データがありません</div>
      </div>
    )
  }

  const growthRate = calculateGrowthRate(stats.feedbacksThisMonth, stats.feedbacksLastMonth)

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              統計
            </h1>
          </div>

          {/* 期間選択 */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { key: '7d', label: '過去7日' },
              { key: '30d', label: '過去30日' },
              { key: '90d', label: '過去90日' },
              { key: 'all', label: 'すべて' }
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

      {/* 主要指標カード */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: growthRate >= 0 ? '#10b981' : '#ef4444',
              fontWeight: '500'
            }}>
              {growthRate >= 0 ? '+' : ''}{growthRate}%
            </div>
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            {formatNumber(stats.totalFeedbacks)}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            総フィードバック数
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              アクティブ
            </div>
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            {formatNumber(stats.totalUsers)}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            参加ユーザー数
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              今月
            </div>
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            {formatNumber(stats.feedbacksThisMonth)}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            月間フィードバック数
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1rem'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              平均/日
            </div>
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            {formatNumber(Math.round(stats.feedbacksThisMonth / 30))}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            日平均フィードバック数
          </div>
        </div>
      </div>

      {/* チャートセクション */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* カテゴリ別分析 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
              カテゴリ別分布
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(categoryLabels).map(([category, info]) => {
              const count = stats.feedbacksByCategory[category as FeedbackCategory] || 0
              const percentage = stats.totalFeedbacks > 0 ? Math.round((count / stats.totalFeedbacks) * 100) : 0
              
              return (
                <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '1rem' }}>{info.icon}</span>
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>{info.label}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {formatNumber(count)}
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '500', color: info.color }}>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '0.5rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: info.color,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* トレンド分析 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
              フィードバック推移
            </h3>
          </div>

          <div style={{
            height: '200px',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: '0.25rem',
            padding: '1rem 0'
          }}>
            {stats.feedbackTrends.slice(-14).map((trend, index) => {
              const maxCount = getMaxValue(stats.feedbackTrends)
              const height = maxCount > 0 ? (trend.count / maxCount) * 160 : 0
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '20px',
                      height: `${height}px`,
                      backgroundColor: '#3b82f6',
                      borderRadius: '2px',
                      marginBottom: '0.5rem',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    title={`${new Date(trend.date).toLocaleDateString('ja-JP')}: ${trend.count}件`}
                  />
                  <span style={{
                    fontSize: '0.625rem',
                    color: '#6b7280',
                    transform: 'rotate(-45deg)',
                    transformOrigin: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    {new Date(trend.date).getDate()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ランキングセクション */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1.5rem'
      }}>
        {/* 送信者ランキング */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
              送信者ランキング
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.topSenders.slice(0, 5).map((sender, index) => (
              <div
                key={sender.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: index === 0 ? '#fef3c7' : '#f9fafb'
                }}
              >
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#f59e0b' : '#6b7280',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    {sender.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formatNumber(sender.count)}件送信
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 受信者ランキング */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
              受信者ランキング
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.topReceivers.slice(0, 5).map((receiver, index) => (
              <div
                key={receiver.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: index === 0 ? '#fef2f2' : '#f9fafb'
                }}
              >
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#ef4444' : '#6b7280',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    {receiver.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formatNumber(receiver.count)}件受信
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 部署別統計 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
              部署別活動
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.departmentStats.slice(0, 5).map((dept, index) => (
              <div key={dept.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>
                    {dept.name}
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {formatNumber(dept.count)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: '500' }}>
                      {dept.percentage}%
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '0.25rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.125rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${dept.percentage}%`,
                    height: '100%',
                    backgroundColor: '#8b5cf6',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics