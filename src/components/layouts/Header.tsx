import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface HeaderProps {
  onMenuClick?: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0.75rem 1.5rem',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            style={{
              display: 'block',
              padding: '0.5rem',
              marginRight: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#374151',
              borderRadius: '0.375rem'
            }}
            className="md:hidden"
          >
            ☰
          </button>
        )}

        {/* Search */}
        <div style={{
          flex: 1,
          maxWidth: '28rem'
        }}>
          <input
            type="text"
            placeholder="フィードバックを検索..."
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none',
              transition: 'all 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6'
              e.target.style.backgroundColor = 'white'
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db'
              e.target.style.backgroundColor = '#f9fafb'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* User Info and Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingLeft: '1rem'
        }}>
          <span style={{
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: '500'
          }}>
            {user?.name || 'ユーザー'}
          </span>
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              color: '#374151',
              backgroundColor: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header