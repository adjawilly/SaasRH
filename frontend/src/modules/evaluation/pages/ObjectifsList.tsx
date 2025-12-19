import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { Plus, Target, AlertCircle } from 'lucide-react'

export default function ObjectifsList() {
  const navigate = useNavigate()
  const { data: objectifs, isLoading } = useQuery({
    queryKey: ['objectifs'],
    queryFn: async () => {
      const response = await (api as any).get('/api/evaluation/objectifs')
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
            <Target size={22} style={{ color: '#2F5FD7' }} />
            <span>Objectifs</span>
          </h1>
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white flex items-center space-x-1">
            <AlertCircle size={12} />
            <span>En développement</span>
          </span>
        </div>
        <button 
          onClick={() => navigate('/evaluation/auto-evaluation')} 
          className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-1.5 text-xs md:text-sm"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
          }}
        >
          <Plus size={14} />
          <span>Nouvel objectif</span>
        </button>
      </div>
      <p className="text-xs md:text-sm text-gray-600">Fixation et suivi des objectifs</p>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {objectifs?.map((obj: any) => (
            <div key={obj.id} className="card border-2 border-blue-200 bg-blue-50/30 relative">
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white">
                  indisponible
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
                  <Target size={20} style={{ color: '#2F5FD7' }} />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800">{obj.libelle}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{obj.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-gray-500">Progression: {obj.progression}%</span>
                <div className="w-24 md:w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${obj.progression}%`,
                      background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

