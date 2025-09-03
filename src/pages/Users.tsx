import React, { useState, useEffect } from 'react'
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

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'user'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        // 一時的にモックデータを使用
        const mockUsers = [
          {
            id: 1,
            email: 'admin@tech.example.com',
            name: '管理者ユーザー',
            role: 'admin' as const,
            active: true,
            department: { id: 1, name: '開発部' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            email: 'taro@tech.example.com',
            name: '田中太郎',
            role: 'user' as const,
            active: true,
            department: { id: 1, name: '開発部' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 3,
            email: 'hanako@tech.example.com',
            name: '佐藤花子',
            role: 'user' as const,
            active: true,
            department: { id: 2, name: 'デザイン部' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
      } catch (err: any) {
        setError(err.response?.data?.error || 'ユーザー一覧の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users

    // 検索フィルター
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 部署フィルター
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.department?.name === selectedDepartment)
    }

    // 役割フィルター
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // ステータスフィルター
    if (selectedStatus !== 'all') {
      const isActive = selectedStatus === 'active'
      filtered = filtered.filter(user => user.active === isActive)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, selectedDepartment, selectedRole, selectedStatus])

  const departments = Array.from(new Set(users.map(u => u.department?.name).filter(Boolean)))

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await api.patch(`/users/${userId}`, {
        user: { active: !currentStatus }
      })
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, active: !currentStatus } : user
      ))
    } catch (err: any) {
      setError(err.response?.data?.error || 'ユーザーステータスの更新に失敗しました')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '管理者'
      case 'user': return '一般ユーザー'
      default: return role
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#10b981' : '#ef4444'
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
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          marginBottom: '0.5rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            メンバー管理
          </h1>
        </div>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          組織のメンバー一覧と管理
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
            {users.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            総メンバー数
          </div>
        </div>

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
            color: '#10b981',
            marginBottom: '0.5rem'
          }}>
            {users.filter(u => u.active).length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            アクティブ
          </div>
        </div>

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
            color: '#f59e0b',
            marginBottom: '0.5rem'
          }}>
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            管理者
          </div>
        </div>

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
            color: '#8b5cf6',
            marginBottom: '0.5rem'
          }}>
            {departments.length}
          </div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            部署数
          </div>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        {/* 検索バー */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            position: 'relative',
            maxWidth: '24rem'
          }}>
            <input
              type="text"
              placeholder="名前またはメールアドレスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '0.75rem',
                paddingRight: '0.75rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        {/* フィルター */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <span style={{ fontWeight: '600', color: '#374151' }}>フィルター</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              部署
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">すべての部署</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              役割
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as typeof selectedRole)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">すべての役割</option>
              <option value="admin">管理者</option>
              <option value="user">一般ユーザー</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block',
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              ステータス
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">すべてのステータス</option>
              <option value="active">アクティブ</option>
              <option value="inactive">非アクティブ</option>
            </select>
          </div>
        </div>
      </div>

      {/* ユーザーリスト */}
      {filteredUsers.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid #e5e7eb',
          padding: '3rem',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>
            ユーザーが見つかりません
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            検索条件を変更してお試しください
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
          {/* テーブルヘッダー */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 200px 150px 120px 150px 80px',
            gap: '1rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e5e7eb',
            fontWeight: '600',
            fontSize: '0.875rem',
            color: '#374151'
          }}>
            <div>ユーザー</div>
            <div>部署</div>
            <div>役割</div>
            <div>ステータス</div>
            <div>登録日</div>
            <div>操作</div>
          </div>

          {/* ユーザー行 */}
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 200px 150px 120px 150px 80px',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: index < filteredUsers.length - 1 ? '1px solid #f3f4f6' : 'none',
                alignItems: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              <div>
                <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  {user.email}
                </div>
              </div>

              <div style={{
                fontSize: '0.875rem',
                color: '#374151'
              }}>
                {user.department?.name || '未所属'}
              </div>

              <div>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: user.role === 'admin' ? '#fef3c7' : '#e0e7ff',
                  color: user.role === 'admin' ? '#d97706' : '#3730a3',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {getRoleLabel(user.role)}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(user.active)
                }} />
                <span style={{
                  fontSize: '0.875rem',
                  color: getStatusColor(user.active),
                  fontWeight: '500'
                }}>
                  {user.active ? 'アクティブ' : '非アクティブ'}
                </span>
              </div>

              <div style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {formatDate(user.createdAt)}
              </div>

              <div style={{
                display: 'flex',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setSelectedUser(user)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: '#6b7280',
                    fontSize: '0.75rem'
                  }}
                  title="詳細を表示"
                >
                  詳細
                </button>
                
                <button
                  onClick={() => toggleUserStatus(user.id, user.active)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: user.active ? '#fee2e2' : '#dcfce7',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    color: user.active ? '#dc2626' : '#16a34a',
                    fontSize: '0.75rem'
                  }}
                  title={user.active ? '無効化' : '有効化'}
                >
                  {user.active ? '無効化' : '有効化'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ユーザー詳細モーダル */}
      {selectedUser && (
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
              onClick={() => setSelectedUser(null)}
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

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                ユーザー詳細
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>名前</label>
                <div style={{ fontSize: '1rem', fontWeight: '500', color: '#374151' }}>
                  {selectedUser.name}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>メールアドレス</label>
                <div style={{ fontSize: '1rem', color: '#374151' }}>
                  {selectedUser.email}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>部署</label>
                <div style={{ fontSize: '1rem', color: '#374151' }}>
                  {selectedUser.department?.name || '未所属'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>役割</label>
                <div style={{ fontSize: '1rem', color: '#374151' }}>
                  {getRoleLabel(selectedUser.role)}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>ステータス</label>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  backgroundColor: selectedUser.active ? '#dcfce7' : '#fee2e2',
                  color: selectedUser.active ? '#16a34a' : '#dc2626',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(selectedUser.active)
                  }} />
                  {selectedUser.active ? 'アクティブ' : '非アクティブ'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.875rem', color: '#6b7280', display: 'block' }}>登録日</label>
                <div style={{ fontSize: '1rem', color: '#374151' }}>
                  {formatDate(selectedUser.createdAt)}
                </div>
              </div>
            </div>

            <div style={{
              paddingTop: '1.5rem',
              borderTop: '1px solid #f3f4f6',
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={() => toggleUserStatus(selectedUser.id, selectedUser.active)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedUser.active ? '#fee2e2' : '#dcfce7',
                  color: selectedUser.active ? '#dc2626' : '#16a34a',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {selectedUser.active ? '無効化' : '有効化'}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
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

export default Users