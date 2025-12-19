import { useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { Award, Map } from 'lucide-react'

export default function CartographieCompetences() {
  const { data: competences, isLoading } = useQuery({
    queryKey: ['cartographie-competences'],
    queryFn: async () => {
      const response = await (api as any).get('/api/evaluation/cartographie/1')
      return response.data
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-xl md:text-2xl font-bold flex items-center space-x-2"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          <Map size={22} style={{ color: '#2F5FD7' }} />
          <span>Cartographie des compétences</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">Visualisez les compétences de votre équipe</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {competences && competences.length > 0 ? (
              competences.map((comp: any) => (
                <div key={comp.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
                      <Award size={18} style={{ color: '#2F5FD7' }} />
                    </div>
                    <h3 className="font-semibold text-gray-800">{comp.nom}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Niveau:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(comp.niveau / 5) * 100}%`,
                          background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700">{comp.niveau}/5</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Award size={48} className="mx-auto mb-2 opacity-50" />
                <p>Aucune compétence disponible</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

