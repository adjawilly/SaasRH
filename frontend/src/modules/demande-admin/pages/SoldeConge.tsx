import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Calendar } from 'lucide-react'

export default function SoldeConge() {
  const { data: solde } = useQuery({
    queryKey: ['solde-conge'],
    queryFn: async () => {
      const response = await axios.get('/api/demande-admin/solde-conge')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Solde de congé</h1>
        <p className="text-gray-600 mt-2">Consultez votre solde en temps réel</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{solde?.acquis || 0}</p>
              <p className="text-sm text-gray-600">Jours acquis</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Calendar className="text-green-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{solde?.pris || 0}</p>
              <p className="text-sm text-gray-600">Jours pris</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <Calendar className="text-primary-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{solde?.restant || 0}</p>
              <p className="text-sm text-gray-600">Jours restants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

