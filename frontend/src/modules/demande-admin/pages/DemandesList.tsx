import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Calendar, FileText, CheckCircle, Clock } from 'lucide-react'

export default function DemandesList() {
  const navigate = useNavigate()
  const { data: demandes } = useQuery({
    queryKey: ['demandes'],
    queryFn: async () => {
      const response = await axios.get('/api/demande-admin/demandes')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Demandes administratives</h1>
          <p className="text-gray-600 mt-2">Gérez vos demandes</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => navigate('/demande-admin/absence')} className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Demande d'absence</span>
          </button>
          <button onClick={() => navigate('/demande-admin/conge')} className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>Demande de congé</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <Clock className="text-yellow-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{demandes?.enAttente || 0}</p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <CheckCircle className="text-green-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{demandes?.approuvees || 0}</p>
              <p className="text-sm text-gray-600">Approuvées</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <FileText className="text-blue-500" size={32} />
            <div>
              <p className="text-2xl font-bold">{demandes?.total || 0}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes demandes</h2>
        <div className="space-y-2">
          {demandes?.liste?.map((demande: any) => (
            <div key={demande.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{demande.type}</p>
                  <p className="text-sm text-gray-600">{demande.dateDebut} - {demande.dateFin}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  demande.statut === 'approuve' ? 'bg-green-100 text-green-800' :
                  demande.statut === 'rejete' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {demande.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

