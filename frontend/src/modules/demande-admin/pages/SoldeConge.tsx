import { useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { Calendar, CalendarDays } from 'lucide-react'

export default function SoldeConge() {
  const { data: solde, isLoading } = useQuery({
    queryKey: ['solde-conge'],
    queryFn: async () => {
      const response = await (api as any).get('/api/demande-admin/solde-conge/1')
      return response.data
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-2xl md:text-3xl font-bold flex items-center space-x-2"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          <CalendarDays size={28} style={{ color: '#2F5FD7' }} />
          <span>Solde de congé</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Consultez votre solde en temps réel</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
                <Calendar size={28} style={{ color: '#2F5FD7' }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{solde?.acquis || 0}</p>
                <p className="text-sm text-gray-600">Jours acquis</p>
              </div>
            </div>
          </div>
          <div className="card border-2 border-green-200 bg-green-50/30">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-green-100">
                <Calendar className="text-green-600" size={28} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{solde?.pris || 0}</p>
                <p className="text-sm text-gray-600">Jours pris</p>
              </div>
            </div>
          </div>
          <div className="card border-2 border-purple-200 bg-purple-50/30">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-purple-100">
                <Calendar className="text-purple-600" size={28} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{solde?.restant || 0}</p>
                <p className="text-sm text-gray-600">Jours restants</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

