import { Outlet, Link, useLocation } from 'react-router-dom'
import { Award, Briefcase, GraduationCap, Users, Settings, CalendarX } from 'lucide-react'

const tabs = [
  { path: '/parametrage/competences', label: 'Compétences', icon: Award },
  { path: '/parametrage/domaines', label: 'Domaines', icon: Briefcase },
  { path: '/parametrage/fonctions', label: 'Fonctions', icon: Users },
  { path: '/parametrage/niveaux-etude', label: 'Niveaux Étude', icon: GraduationCap },
  { path: '/parametrage/profils', label: 'Profils Utilisateurs', icon: Settings },
  { path: '/parametrage/motifs-absence', label: 'Motifs d\'absence', icon: CalendarX },
]

export default function ParametrageLayout() {
  const location = useLocation()

  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="text-xl md:text-2xl font-bold"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Paramétrage
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Configurez les paramètres de l'application</p>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-1 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = location.pathname === tab.path || 
                           (tab.path === '/parametrage/competences' && location.pathname === '/parametrage')
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  flex items-center space-x-1.5 px-2.5 py-1.5 border-b-2 font-medium text-xs transition-colors whitespace-nowrap
                  ${
                    isActive
                      ? 'border-transparent'
                      : 'border-transparent hover:border-gray-300'
                  }
                `}
                style={isActive ? {
                  color: '#2F5FD7'
                } : {
                  color: '#6B7280'
                }}
              >
                <Icon size={14} style={isActive ? { color: '#2F5FD7' } : { color: '#6B7280' }} />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <Outlet />
    </div>
  )
}

