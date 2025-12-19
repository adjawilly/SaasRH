import { useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { History } from 'lucide-react'

export default function HistoriqueFormation() {
  const { data: historique } = useQuery({
    queryKey: ['historique-formation'],
    queryFn: async () => {
      const response = await api.get('/api/formation/historique')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Historique des formations</h1>
        <p className="text-gray-600 mt-2">Consultez l'historique de vos formations</p>
      </div>
      <div className="card">
        <div className="space-y-4">
          {historique?.map((item: any) => (
            <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <History className="text-primary-600" size={20} />
                <h3 className="font-semibold">{item.libelle}</h3>
              </div>
              <p className="text-sm text-gray-600">{item.date}</p>
              <p className="text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

