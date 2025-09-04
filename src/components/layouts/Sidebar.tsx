import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const navigation = [
  { name: 'ダッシュボード', href: '/' },
  { name: '受信フィードバック', href: '/received' },
  { name: '送信履歴', href: '/sent' },
  { name: 'メンバー', href: '/users' },
  { name: '統計', href: '/stats' },
  { name: '設定', href: '/settings' },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '16rem',
      backgroundColor: 'white',
      borderRight: '1px solid #d1d5db',
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '4rem',
        padding: '0 1rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#111827'
        }}>
          Posifeed
        </span>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '1rem 0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
      }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              style={{
                display: 'block',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#1d4ed8' : '#374151',
                fontWeight: isActive ? '600' : '400',
                borderRight: isActive ? '3px solid #2563eb' : 'none'
              }}
            >
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '0.25rem'
          }}>
            {user?.name || 'ユーザー'}
          </p>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {user?.role === 'admin' ? '管理者' : '一般ユーザー'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar