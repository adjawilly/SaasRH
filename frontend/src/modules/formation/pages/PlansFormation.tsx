import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { Plus, GraduationCap } from 'lucide-react'

export default function PlansFormation() {
  const navigate = useNavigate()
  const { data: plans } = useQuery({
    queryKey: ['plans-formation'],
    queryFn: async () => {
      const response = await api.get('/api/formation/plans')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Plans de formation</h1>
          <p className="text-gray-600 mt-2">Élaborez et suivez vos plans de formation</p>
        </div>
        <button onClick={() => navigate('/formation/historique')} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Nouveau plan</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan: any) => (
          <div key={plan.id} className="card">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="text-primary-600" size={24} />
              <h3 className="text-lg font-semibold">{plan.libelle}</h3>
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{plan.dateDebut} - {plan.dateFin}</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                plan.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                plan.statut === 'termine' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {plan.statut}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

