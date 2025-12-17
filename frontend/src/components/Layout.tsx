import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  Award, 
  Clock, 
  GraduationCap, 
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  ChevronDown
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const menuItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/recrutement', label: 'Recrutement', icon: Users, access: ['administrateur', 'compte_rh'] },
  { path: '/gestion-admin', label: 'Gestion Administratives', icon: FileText, access: ['administrateur', 'compte_rh'] },
  { path: '/demande-admin', label: 'Demande Administratives', icon: ClipboardList, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/evaluation', label: 'Évaluation & Compétences', icon: Award, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/gestion-temps', label: 'Gestion des Temps', icon: Clock, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/formation', label: 'Formation', icon: GraduationCap, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/parametrage', label: 'Paramétrage', icon: Settings, access: ['administrateur'] },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setAccountMenuOpen(false)
  }

  const filteredMenuItems = menuItems.filter(item => 
    item.access.includes(user?.profil || '')
  )

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
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 bg-gradient-primary text-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold">SaansRH</h1>
          </div>

          {/* Account Menu */}
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className="hidden md:block font-medium">
                  {user?.prenom} {user?.nom}
                </span>
                <ChevronDown size={16} className={`transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Dropdown Menu */}
            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                
                <Link
                  to="/profil"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <User size={18} />
                  <span>Mon profil</span>
                </Link>
                
                <Link
                  to="/notifications"
                  onClick={() => setAccountMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Bell size={18} />
                  <span>Mes notifications</span>
                </Link>
                
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
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

      {/* Sidebar - Fixed on desktop */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed left-0 top-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}
        style={{ 
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        <div className="h-full flex flex-col">
          <div className="bg-gradient-primary text-white p-6 hidden lg:block">
            <h1 className="text-2xl font-bold">SaansRH</h1>
            <p className="text-sm opacity-90 mt-1">Gestion RH</p>
          </div>
          
          <nav className="flex-1 p-4">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gradient-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content - Scrollable independently */}
      <main 
        className="fixed top-16 left-0 right-0 lg:left-64 overflow-y-auto overflow-x-hidden"
        style={{
          height: 'calc(100vh - 64px)'
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
