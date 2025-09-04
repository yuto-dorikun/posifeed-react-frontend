import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import MobileSidebar from './MobileSidebar'
import Header from './Header'

interface MobileLayoutProps {
  children: React.ReactNode
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children }) => {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (!user) return null

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'white'
    }}>
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      <main style={{
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: '#f9fafb'
      }}>
        {children}
      </main>
      <MobileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  )
}

export default MobileLayout