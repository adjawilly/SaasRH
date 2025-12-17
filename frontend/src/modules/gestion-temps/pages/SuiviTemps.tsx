import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Clock } from 'lucide-react'

export default function SuiviTemps() {
  const { data: temps } = useQuery({
    queryKey: ['suivi-temps'],
    queryFn: async () => {
      const response = await axios.get('/api/gestion-temps/suivi')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Suivi du temps</h1>
        <p className="text-gray-600 mt-2">Suivez votre temps de travail</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <Clock className="text-blue-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{temps?.heuresSemaine || 0}h</p>
              <p className="text-sm text-gray-600">Cette semaine</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Clock className="text-green-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{temps?.heuresMois || 0}h</p>
              <p className="text-sm text-gray-600">Ce mois</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Clock className="text-primary-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{temps?.moyenne || 0}h</p>
              <p className="text-sm text-gray-600">Moyenne/jour</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

