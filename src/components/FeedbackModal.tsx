import React, { useState, useEffect } from 'react'

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

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const CATEGORY_LABELS = {
  gratitude: { name: 'ありがとう', description: '感謝の気持ちを伝える' },
  admiration: { name: 'すごい！', description: '素晴らしい成果を称える' },
  appreciation: { name: 'お疲れさま', description: '努力や貢献を認める' },
  respect: { name: 'さすが', description: '相手への敬意を表す' }
}

// モックユーザーデータ
const mockUsers: User[] = [
  { id: 1, email: 'tanaka@example.com', name: '田中 太郎', role: 'user', active: true, department: { id: 1, name: '開発部' }, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 2, email: 'sato@example.com', name: '佐藤 花子', role: 'user', active: true, department: { id: 1, name: '開発部' }, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 3, email: 'yamada@example.com', name: '山田 健一', role: 'admin', active: true, department: { id: 2, name: '営業部' }, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 4, email: 'suzuki@example.com', name: '鈴木 美咲', role: 'user', active: true, department: { id: 2, name: '営業部' }, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: 5, email: 'takahashi@example.com', name: '高橋 修', role: 'user', active: true, department: { id: 3, name: '管理部' }, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | null>(null)
  const [selectedRecipient, setSelectedRecipient] = useState<string>('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [users] = useState<User[]>(mockUsers)

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setSelectedCategory(null)
      setSelectedRecipient('')
      setContent('')
      setIsAnonymous(false)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedRecipient || !content.trim()) {
      alert('必須項目を入力してください')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Sending feedback:', {
      category: selectedCategory,
      recipientId: selectedRecipient,
      content,
      isAnonymous
    })
    
    setIsSubmitting(false)
    alert('フィードバックを送信しました！')
    onSuccess?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            フィードバックを送る
          </h2>
          <p style={{ color: '#6b7280' }}>
            感謝や称賛の気持ちを伝えましょう
          </p>
        </div>

        {/* Category Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            カテゴリを選択
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {Object.entries(CATEGORY_LABELS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as FeedbackCategory)}
                style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: selectedCategory === key ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  backgroundColor: selectedCategory === key ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {value.name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {value.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            送信先を選択
          </label>
          <select
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '16px'
            }}
          >
            <option value="">選択してください</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.department?.name})
              </option>
            ))}
          </select>
        </div>

        {/* Message Input */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            メッセージ
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="感謝や称賛の気持ちを具体的に書いてみましょう"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
              minHeight: '120px',
              resize: 'vertical'
            }}
          />
          <div style={{ marginTop: '4px', textAlign: 'right', color: '#6b7280', fontSize: '14px' }}>
            {content.length} / 500
          </div>
        </div>

        {/* Anonymous Option */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              style={{
                marginRight: '8px',
                width: '16px',
                height: '16px'
              }}
            />
            <span>匿名で送信する</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedCategory || !selectedRecipient || !content.trim()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isSubmitting || !selectedCategory || !selectedRecipient || !content.trim() 
                ? '#9ca3af' 
                : '#3b82f6',
              color: 'white',
              cursor: isSubmitting || !selectedCategory || !selectedRecipient || !content.trim() 
                ? 'not-allowed' 
                : 'pointer',
              fontSize: '16px'
            }}
          >
            {isSubmitting ? '送信中...' : '送信'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedbackModal