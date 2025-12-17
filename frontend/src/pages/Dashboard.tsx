import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Users, FileText, Clock, GraduationCap, TrendingUp, UserCheck } from 'lucide-react'

interface DashboardStats {
  totalCandidatures: number
  candidaturesEnAttente: number
  totalSalaries: number
  demandesEnAttente: number
  formationsEnCours: number
  evaluationsEnCours: number
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/dashboard/stats')
      return response.data
    },
  })

  const statCards = [
    {
      title: 'Candidatures',
      value: stats?.totalCandidatures || 0,
      subtitle: `${stats?.candidaturesEnAttente || 0} en attente`,
      icon: Users,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Salariés',
      value: stats?.totalSalaries || 0,
      subtitle: 'Total actifs',
      icon: UserCheck,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Demandes',
      value: stats?.demandesEnAttente || 0,
      subtitle: 'En attente de traitement',
      icon: FileText,
      color: 'bg-yellow-500',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Formations',
      value: stats?.formationsEnCours || 0,
      subtitle: 'En cours',
      icon: GraduationCap,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Évaluations',
      value: stats?.evaluationsEnCours || 0,
      subtitle: 'En cours',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'Temps',
      value: '0h',
      subtitle: 'Heures supplémentaires',
      icon: Clock,
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre gestion RH</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-4 rounded-full bg-gradient-to-br ${stat.gradient} text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts section - to be implemented with recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Évolution des candidatures</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Graphique à implémenter
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Répartition par département</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Graphique à implémenter
          </div>
        </div>
      </div>
    </div>
  )
}

