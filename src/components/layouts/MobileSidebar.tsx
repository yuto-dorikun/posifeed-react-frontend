import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'ダッシュボード', href: '/' },
  { name: '受信フィードバック', href: '/received' },
  { name: '送信履歴', href: '/sent' },
  { name: 'メンバー', href: '/users' },
  { name: '統計', href: '/stats' },
  { name: '設定', href: '/settings' },
]

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user } = useAuth()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40
        }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '16rem',
        backgroundColor: 'white',
        borderRight: '1px solid #d1d5db',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header with close button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0.25rem',
              borderRadius: '0.375rem'
            }}
          >
            ×
          </button>
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
                onClick={onClose}
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
    </>
  )
}

export default MobileSidebar