import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { Plus, Calendar, FileText, CheckCircle, Clock, ClipboardList } from 'lucide-react'

export default function DemandesList() {
  const navigate = useNavigate()
  const { data: demandes, isLoading } = useQuery({
    queryKey: ['demandes'],
    queryFn: async () => {
      const response = await (api as any).get('/api/demande-admin/demandes')
      return response.data
    },
  })

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      absence: 'Absence',
      conge: 'Congé',
      attestation: 'Attestation',
    }
    return labels[type] || type
  }

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      en_attente: 'En attente',
      approuve: 'Approuvé',
      rejete: 'Rejeté',
    }
    return labels[statut] || statut
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
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
            <ClipboardList size={22} style={{ color: '#2F5FD7' }} />
            <span>Demandes administratives</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Gérez vos demandes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => navigate('/demande-admin/absence')} 
            className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-1.5 text-xs md:text-sm"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
            }}
          >
            <Plus size={14} />
            <span>Demande d'absence</span>
          </button>
          <button 
            onClick={() => navigate('/demande-admin/conge')} 
            className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-1.5 text-xs md:text-sm"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
            }}
          >
            <Plus size={14} />
            <span>Demande de congé</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-2 border-yellow-200 bg-yellow-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="text-yellow-600" size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{demandes?.enAttente || 0}</p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-green-200 bg-green-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="text-green-600" size={28} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{demandes?.approuvees || 0}</p>
              <p className="text-sm text-gray-600">Approuvées</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
              <FileText size={28} style={{ color: '#2F5FD7' }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{demandes?.total || 0}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demandes List */}
      <div className="card border-2 border-blue-200 bg-blue-50/30">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <Calendar size={20} style={{ color: '#2F5FD7' }} />
          <span>Mes demandes</span>
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
          </div>
        ) : demandes?.liste?.length > 0 ? (
          <div className="space-y-2">
            {demandes.liste.map((demande: any) => (
              <div key={demande.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{getTypeLabel(demande.type)}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(demande.dateDebut).toLocaleDateString('fr-FR')} - {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
                    </p>
                    {demande.motif && (
                      <p className="text-xs text-gray-500 mt-1">{demande.motif}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    demande.statut === 'approuve' ? 'bg-green-100 text-green-800 border-2 border-green-200' :
                    demande.statut === 'rejete' ? 'bg-red-100 text-red-800 border-2 border-red-200' :
                    'bg-yellow-100 text-yellow-800 border-2 border-yellow-200'
                  }`}>
                    {getStatutLabel(demande.statut)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ClipboardList size={48} className="mx-auto mb-2 opacity-50" />
            <p>Aucune demande pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}

