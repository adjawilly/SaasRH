import { Outlet, Link, useLocation } from 'react-router-dom'
import { Award, Briefcase, GraduationCap, Users, Settings } from 'lucide-react'

const tabs = [
  { path: '/parametrage/competences', label: 'Compétences', icon: Award },
  { path: '/parametrage/domaines', label: 'Domaines', icon: Briefcase },
  { path: '/parametrage/fonctions', label: 'Fonctions', icon: Users },
  { path: '/parametrage/niveaux-etude', label: 'Niveaux Étude', icon: GraduationCap },
  { path: '/parametrage/profils', label: 'Profils Utilisateurs', icon: Settings },
]

export default function ParametrageLayout() {
  const location = useLocation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Paramétrage</h1>
        <p className="text-gray-600 mt-2">Configurez les paramètres de l'application</p>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-1" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = location.pathname === tab.path || 
                           (tab.path === '/parametrage/competences' && location.pathname === '/parametrage')
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`
                  flex items-center space-x-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors
                  ${
                    isActive
                      ? 'border-primary-500 text-primary-600 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon size={18} />
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

