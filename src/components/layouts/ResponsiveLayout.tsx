import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import MobileLayout from './MobileLayout'

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)

    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  if (isMobile) {
    return <MobileLayout>{children}</MobileLayout>
  }

  return <Layout>{children}</Layout>
}

export default ResponsiveLayout