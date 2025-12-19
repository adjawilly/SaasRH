import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        user={user || undefined}
        onLogout={handleLogout}
      />

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        userProfil={user?.profil}
      />

      {/* Main content - Scrollable independently */}
      <main 
        className={`fixed top-16 left-0 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'lg:left-[64px]' : 'lg:left-[224px]'
        }`}
        style={{
          height: 'calc(100vh - 64px)',
          right: '0'
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
