import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { History, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function HistoriqueFormation() {
  const navigate = useNavigate()
  const { data: historique, isLoading } = useQuery({
    queryKey: ['historique-formation'],
    queryFn: async () => {
      const response = await (api as any).get('/api/formation')
      return response.data?.filter((f: any) => f.statut === 'termine' || f.statut === 'valide') || []
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/formation')} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          style={{ color: '#2F5FD7' }}
        >
          <ArrowLeft size={20} />
        </button>
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
            <History size={22} style={{ color: '#2F5FD7' }} />
            <span>Historique des formations</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Consultez l'historique de vos formations</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          {historique && historique.length > 0 ? (
            <div className="space-y-3">
              {historique.map((item: any) => (
                <div key={item.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
                      <History size={18} style={{ color: '#2F5FD7' }} />
                    </div>
                    <h3 className="font-semibold text-gray-800">{item.libelle}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {format(new Date(item.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(item.dateFin), 'dd MMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune formation dans l'historique</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

