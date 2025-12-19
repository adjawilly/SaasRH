import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  Award, 
  Clock, 
  GraduationCap, 
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  UserCog
} from 'lucide-react'

const menuItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/recrutement', label: 'Recrutement', icon: Users, access: ['compte_rh'] },
  { path: '/gestion-admin', label: 'Gestion Administratives', icon: FileText, access: ['compte_rh'] },
  { path: '/demande-admin', label: 'Demande Administratives', icon: ClipboardList, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/evaluation', label: 'Évaluation & Compétences', icon: Award, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/gestion-temps', label: 'Gestion des Temps', icon: Clock, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/formation', label: 'Formation', icon: GraduationCap, access: ['administrateur', 'compte_rh', 'compte_salarie'] },
  { path: '/gestion-utilisateurs', label: 'Gestion Utilisateurs', icon: UserCog, access: ['administrateur', 'compte_rh'] },
  { path: '/parametrage', label: 'Paramétrage', icon: Settings, access: ['administrateur'] },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  userProfil?: string
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  userProfil
}: SidebarProps) {
  const location = useLocation()

  const filteredMenuItems = menuItems.filter(item => 
    item.access.includes(userProfil || '')
  )

  return (
    <>
      {/* Sidebar - Fixed on desktop */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed left-0 top-0 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'z-50' : 'z-40'
        }`}
        style={{ 
          height: '100vh',
          overflowY: 'auto',
          width: sidebarCollapsed ? '64px' : '224px'
        }}
      >
        <div className="h-full flex flex-col">
          {/* Bouton de fermeture mobile */}
          <div className="lg:hidden flex justify-end p-4 border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              style={{ color: '#2F5FD7' }}
              aria-label="Fermer le menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <div 
            className={`bg-white hidden lg:block relative flex items-center justify-center ${
              sidebarCollapsed ? 'p-4' : 'p-4'
            }`}
            style={{
              minHeight: sidebarCollapsed ? '64px' : 'auto'
            }}
          >
            {!sidebarCollapsed && (
              <div className="flex-1 text-center">
                <div className="flex justify-center mb-3">
                  <img
                    src="/logo.png"
                    alt="SaansRH Logo"
                    className="h-20 w-auto object-contain rounded-xl"
                  />
                </div>
                <h1 
                  className="text-xl font-bold"
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
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 hover:bg-gray-100 rounded transition-colors ${
                sidebarCollapsed ? 'absolute inset-0 flex items-center justify-center' : 'absolute top-4 right-2'
              }`}
              style={{
                color: '#2F5FD7'
              }}
              title={sidebarCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
            >
              {sidebarCollapsed ? (
                <ChevronRight size={22} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>
          
          <nav className="flex-1 p-3">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 mb-1 rounded-lg transition-colors ${
                    sidebarCollapsed ? 'justify-center' : 'space-x-2'
                  } ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                  } : undefined}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={20} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}

