import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { Clock, AlertCircle, Plus } from 'lucide-react'

export default function SuiviTemps() {
  const navigate = useNavigate()
  const { data: temps, isLoading } = useQuery({
    queryKey: ['temps-travail'],
    queryFn: async () => {
      const response = await (api as any).get('/api/gestion-temps/temps-travail')
      return response.data
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center space-x-3">
          <h1 
            className="text-xl md:text-2xl font-bold flex items-center space-x-2"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <Clock size={22} style={{ color: '#2F5FD7' }} />
            <span>Suivi du temps</span>
          </h1>
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white flex items-center space-x-1">
            <AlertCircle size={12} />
            <span>En développement</span>
          </span>
        </div>
        <button 
          onClick={() => navigate('/gestion-temps/heures-supplementaires')} 
          className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-1.5 text-xs md:text-sm"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
          }}
        >
          <Plus size={14} />
          <span>Heures supplémentaires</span>
        </button>
      </div>
      <p className="text-xs md:text-sm text-gray-600">Suivez votre temps de travail</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="card border-2 border-blue-200 bg-blue-50/30 relative">
            <span className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white">
              indisponible
            </span>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
                <Clock size={24} style={{ color: '#2F5FD7' }} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{temps?.heuresSemaine || 0}h</p>
                <p className="text-xs md:text-sm text-gray-600">Cette semaine</p>
              </div>
            </div>
          </div>
          <div className="card border-2 border-green-200 bg-green-50/30 relative">
            <span className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white">
              indisponible
            </span>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-green-100">
                <Clock className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{temps?.heuresMois || 0}h</p>
                <p className="text-xs md:text-sm text-gray-600">Ce mois</p>
              </div>
            </div>
          </div>
          <div className="card border-2 border-purple-200 bg-purple-50/30 relative">
            <span className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white">
              indisponible
            </span>
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Clock className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{temps?.moyenne || 0}h</p>
                <p className="text-xs md:text-sm text-gray-600">Moyenne/jour</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

