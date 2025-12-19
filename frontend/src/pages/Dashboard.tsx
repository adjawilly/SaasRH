import { useQuery } from '@tanstack/react-query'
import api from '../api'
import { 
  Clock, 
  GraduationCap, 
  UserCheck,
  Briefcase,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'

interface DashboardStats {
  totalCandidatures: number
  candidaturesEnAttente: number
  totalSalaries: number
  demandesEnAttente: number
  formationsEnCours: number
  evaluationsEnCours: number
  heuresSupplementaires?: number
  tauxPresence?: number
  candidaturesAcceptees?: number
  formationsTerminees?: number
}

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await (api as any).get('/api/dashboard/stats')
      return response.data
    },
  })

  const mainStats = [
    {
      title: 'Candidatures',
      value: stats?.totalCandidatures || 0,
      subtitle: `${stats?.candidaturesEnAttente || 0} en attente`,
      icon: Briefcase,
      change: '+12%',
      changeType: 'increase' as const,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      bgColor: 'rgba(102, 126, 234, 0.1)',
      borderColor: '#667eea',
    },
    {
      title: 'Salariés actifs',
      value: stats?.totalSalaries || 0,
      subtitle: 'Total dans l\'entreprise',
      icon: UserCheck,
      change: '+5%',
      changeType: 'increase' as const,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bgColor: 'rgba(245, 87, 108, 0.1)',
      borderColor: '#f5576c',
    },
    {
      title: 'Demandes en attente',
      value: stats?.demandesEnAttente || 0,
      subtitle: 'Nécessitent une action',
      icon: AlertCircle,
      change: '-8%',
      changeType: 'decrease' as const,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      bgColor: 'rgba(79, 172, 254, 0.1)',
      borderColor: '#4facfe',
    },
    {
      title: 'Formations en cours',
      value: stats?.formationsEnCours || 0,
      subtitle: `${stats?.formationsTerminees || 0} terminées ce mois`,
      icon: GraduationCap,
      change: '+23%',
      changeType: 'increase' as const,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      bgColor: 'rgba(67, 233, 123, 0.1)',
      borderColor: '#43e97b',
    },
  ]

  const secondaryStats = [
    {
      title: 'Évaluations',
      value: stats?.evaluationsEnCours || 0,
      subtitle: 'En cours',
      icon: Award,
      color: '#2F5FD7',
    },
    {
      title: 'Heures supplémentaires',
      value: `${stats?.heuresSupplementaires || 0}h`,
      subtitle: 'Ce mois',
      icon: Clock,
      color: '#2F5FD7',
    },
    {
      title: 'Taux de présence',
      value: `${stats?.tauxPresence || 95}%`,
      subtitle: 'Moyenne mensuelle',
      icon: Activity,
      color: '#2F5FD7',
    },
    {
      title: 'Candidatures acceptées',
      value: stats?.candidaturesAcceptees || 0,
      subtitle: 'Ce mois',
      icon: CheckCircle2,
      color: '#2F5FD7',
    },
  ]

  const recentActivities = [
    { type: 'candidature', text: 'Nouvelle candidature reçue', time: 'Il y a 2h', icon: Briefcase },
    { type: 'formation', text: 'Formation "Gestion du temps" terminée', time: 'Il y a 5h', icon: GraduationCap },
    { type: 'demande', text: 'Nouvelle demande de congé', time: 'Il y a 1 jour', icon: Calendar },
    { type: 'evaluation', text: 'Évaluation trimestrielle programmée', time: 'Il y a 2 jours', icon: Award },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
          <h1 className="text-3xl font-bold" style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Tableau de bord
          </h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble de votre gestion RH</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="px-6 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200" style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
          }}>
            Générer un rapport
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden"
              style={{ border: `2px solid ${stat.borderColor}` }}
            >
              <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-red-600/50 text-white">
                indisponible
              </span>
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon size={24} style={{ background: stat.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
                </div>
                <div className={`flex items-center space-x-1 text-xs font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            </div>
          )
        })}
      </div>

      {/* Secondary Stats and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secondary Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative">
            <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-red-600/50 text-white">
              indisponible
            </span>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Indicateurs clés</h2>
            <div className="space-y-4">
              {secondaryStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(47, 95, 215, 0.1)' }}>
                        <Icon size={18} style={{ color: stat.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{stat.title}</p>
                        <p className="text-xs text-gray-500">{stat.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Évolution des candidatures</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option>3 derniers mois</option>
              </select>
            </div>
            <div className="h-64 relative px-4 pb-8">
              {/* Grille de fond */}
              <div className="absolute inset-0 flex flex-col justify-between pt-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-gray-100" />
                ))}
              </div>
              
              {/* Données pour le graphique */}
              {(() => {
                const data = [
                  { day: 'Lun', value: 12 },
                  { day: 'Mar', value: 19 },
                  { day: 'Mer', value: 15 },
                  { day: 'Jeu', value: 25 },
                  { day: 'Ven', value: 22 },
                  { day: 'Sam', value: 8 },
                  { day: 'Dim', value: 5 },
                ]
                const maxValue = Math.max(...data.map(d => d.value))
                const minValue = Math.min(...data.map(d => d.value))
                const range = maxValue - minValue || 1
                const chartHeight = 200
                const chartWidth = 640
                const padding = 32
                const stepX = (chartWidth - padding * 2) / (data.length - 1)
                
                // Calcul des points
                type Point = { x: number; y: number; day: string; value: number }
                const points: Point[] = data.map((item, index) => {
                  const x = padding + index * stepX
                  const normalizedValue = (item.value - minValue) / range
                  const y = chartHeight - (normalizedValue * (chartHeight - 40)) - 20
                  return { x, y, ...item }
                })
                
                // Création du path pour la courbe lisse
                const createSmoothPath = (points: Point[]) => {
                  if (points.length < 2) return ''
                  
                  let path = `M ${points[0].x} ${points[0].y}`
                  
                  for (let i = 1; i < points.length; i++) {
                    const prev = points[i - 1]
                    const curr = points[i]
                    const next = points[i + 1]
                    
                    if (i === points.length - 1) {
                      // Dernier point
                      path += ` L ${curr.x} ${curr.y}`
                    } else {
                      // Point intermédiaire avec courbe de Bézier
                      const cp1x = prev.x + (curr.x - prev.x) / 2
                      const cp1y = prev.y
                      const cp2x = curr.x - (next.x - curr.x) / 2
                      const cp2y = curr.y
                      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
                    }
                  }
                  
                  return path
                }
                
                const linePath = createSmoothPath(points)
                const areaPath = linePath + ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
                
                return (
                  <>
                    {/* SVG pour la courbe */}
                    <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2B3FAE" />
                          <stop offset="50%" stopColor="#2F5FD7" />
                          <stop offset="100%" stopColor="#3FA9F5" />
                        </linearGradient>
                      </defs>
                      
                      {/* Zone remplie sous la courbe */}
                      <path
                        d={areaPath}
                        fill="url(#lineGradient)"
                        fillOpacity="0.1"
                      />
                      
                      {/* Ligne de la courbe */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    
                    {/* Points et valeurs */}
                    <div className="relative h-full flex items-end justify-between">
                      {points.map((point, index) => {
                        const percentageY = ((chartHeight - point.y) / chartHeight) * 100
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center relative">
                            <div
                              className="absolute flex flex-col items-center transition-all hover:scale-110 cursor-pointer z-10"
                              style={{ bottom: `${percentageY}%` }}
                            >
                              <span className="text-xs font-semibold mb-1 px-2 py-0.5 rounded bg-white shadow-sm border border-gray-200 text-gray-700 whitespace-nowrap">
                                {point.value}
                              </span>
                              <div
                                className="w-3 h-3 rounded-full border-2 border-white shadow-md"
                                style={{
                                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 mt-auto pt-1">{point.day}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Répartition par département</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Ce mois</option>
                <option>Ce trimestre</option>
                <option>Cette année</option>
              </select>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Ressources Humaines', value: 35, color: '#2B3FAE' },
                { name: 'Informatique', value: 28, color: '#2F5FD7' },
                { name: 'Commercial', value: 22, color: '#3FA9F5' },
                { name: 'Marketing', value: 10, color: '#667eea' },
                { name: 'Finance', value: 5, color: '#764ba2' },
              ].map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <span className="text-sm font-semibold text-gray-800">{dept.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dept.value}%`,
                        background: dept.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div 
        className="bg-white rounded-xl shadow-md p-6 relative"
        style={{ border: '2px solid #2F5FD7' }}
      >
        <span className="absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-red-600/50 text-white">
          indisponible
        </span>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Activités récentes</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(47, 95, 215, 0.1)' }}>
                  <Icon size={18} style={{ color: '#2F5FD7' }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.text}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
