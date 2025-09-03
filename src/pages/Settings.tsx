import React, { useState, useEffect } from 'react'
import { Settings as SettingsIcon, User, Bell, Shield, Save, Eye, EyeOff, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { api } from "../lib/api-simple"

const Settings: React.FC = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // プロフィール設定
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  
  // パスワード変更
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // 通知設定
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    feedbackReceived: true,
    feedbackRead: false,
    weeklyReport: true,
    monthlyReport: true
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await api.patch('/auth/me', {
        user: profileData
      })
      setSuccess('プロフィールを更新しました')
    } catch (err: any) {
      setError(err.response?.data?.error || 'プロフィールの更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('新しいパスワードが一致しません')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('パスワードは8文字以上で設定してください')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await api.patch('/auth/password', {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      })
      setSuccess('パスワードを変更しました')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err: any) {
      setError(err.response?.data?.error || 'パスワードの変更に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await api.patch('/settings/notifications', {
        notifications: notificationSettings
      })
      setSuccess('通知設定を更新しました')
    } catch (err: any) {
      setError(err.response?.data?.error || '通知設定の更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem'
          }}>
            <SettingsIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            設定
          </h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          アカウントとアプリケーションの設定
        </p>
      </div>

      {success && (
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
          <Save style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
          {success}
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

      {/* プロフィール設定 */}
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
          marginBottom: '1.5rem'
        }}>
          <User style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#374151' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>
            プロフィール設定
          </h2>
        </div>

        <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              名前
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: 'fit-content',
              padding: '0.75rem 1.5rem',
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Save style={{ width: '1rem', height: '1rem' }} />
            {isLoading ? '更新中...' : 'プロフィールを更新'}
          </button>
        </form>
      </div>

      {/* パスワード変更 */}
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
          marginBottom: '1.5rem'
        }}>
          <Shield style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#374151' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>
            パスワード変更
          </h2>
        </div>

        <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              現在のパスワード
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPasswords.current ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              新しいパスワード
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPasswords.new ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              新しいパスワード（確認）
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingRight: '2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                {showPasswords.confirm ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: 'fit-content',
              padding: '0.75rem 1.5rem',
              backgroundColor: isLoading ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Shield style={{ width: '1rem', height: '1rem' }} />
            {isLoading ? '変更中...' : 'パスワードを変更'}
          </button>
        </form>
      </div>

      {/* 通知設定 */}
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
          marginBottom: '1.5rem'
        }}>
          <Bell style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', color: '#374151' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#374151' }}>
            通知設定
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                メール通知
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                重要な通知をメールで受信する
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                フィードバック受信通知
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                新しいフィードバックを受信したとき
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.feedbackReceived}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, feedbackReceived: e.target.checked })}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                既読通知
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                送信したフィードバックが読まれたとき
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.feedbackRead}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, feedbackRead: e.target.checked })}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                週間レポート
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                毎週月曜日にアクティビティレポートを受信
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.weeklyReport}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReport: e.target.checked })}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.5rem'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                月間レポート
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                毎月1日に詳細なアクティビティレポートを受信
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.monthlyReport}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, monthlyReport: e.target.checked })}
              style={{ transform: 'scale(1.2)' }}
            />
          </div>

          <button
            onClick={handleNotificationUpdate}
            disabled={isLoading}
            style={{
              width: 'fit-content',
              padding: '0.75rem 1.5rem',
              backgroundColor: isLoading ? '#9ca3af' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Bell style={{ width: '1rem', height: '1rem' }} />
            {isLoading ? '更新中...' : '通知設定を更新'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings