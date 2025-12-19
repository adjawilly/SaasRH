import { Link } from 'react-router-dom'
import { 
  LogOut,
  Menu,
  X,
  User,
  Bell,
  ChevronDown
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNotification } from '../contexts/NotificationContext'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  user?: {
    prenom?: string
    nom?: string
    email?: string
  } | null
  onLogout: () => void
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  user,
  onLogout
}: HeaderProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)
  const notification = useNotification()

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [accountMenuOpen])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 lg:right-0 z-50 bg-white shadow-lg transition-all duration-300 ${
        sidebarCollapsed ? 'lg:left-[64px]' : 'lg:left-[224px]'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: '#2F5FD7' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 
            className="text-lg font-bold"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            SaansRH
          </h1>
        </div>

        {/* Account Menu */}
        <div className="relative" ref={accountMenuRef}>
          <button
            onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                }}
              >
                <User size={16} className="text-white" />
              </div>
              <span 
                className="hidden md:block text-sm font-medium"
                style={{ color: '#2F5FD7' }}
              >
                {user?.prenom} {user?.nom}
              </span>
              <ChevronDown 
                size={14} 
                className={`transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}
                style={{ color: '#2F5FD7' }}
              />
            </div>
          </button>

          {/* Dropdown Menu */}
          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
              <div className="px-4 py-3 border-b border-gray-200">
                <p 
                  className="text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs" style={{ color: '#2F5FD7' }}>{user?.email}</p>
              </div>
              
              <Link
                to="/profil"
                onClick={() => setAccountMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                style={{ color: '#2F5FD7' }}
              >
                <User size={18} style={{ color: '#2F5FD7' }} />
                <span>Mon profil</span>
              </Link>
              
              <Link
                to="/notifications"
                onClick={() => setAccountMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 transition-colors"
                style={{ color: '#2F5FD7' }}
              >
                <Bell size={18} style={{ color: '#2F5FD7' }} />
                <span>Mes notifications</span>
              </Link>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <button
                  onClick={() => {
                    onLogout()
                    notification.info('Déconnexion réussie', 'Vous avez été déconnecté avec succès')
                    setAccountMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

