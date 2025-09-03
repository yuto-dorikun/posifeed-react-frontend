import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layouts/Layout'
import Dashboard from './pages/Dashboard'
import SendFeedback from './pages/SendFeedback'
import ReceivedFeedback from './pages/ReceivedFeedback'
import SentFeedback from './pages/SentFeedback'
import Users from './pages/Users'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/send" element={<SendFeedback />} />
              <Route path="/received" element={<ReceivedFeedback />} />
              <Route path="/sent" element={<SentFeedback />} />
              <Route path="/users" element={<Users />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  )
}

export default App
