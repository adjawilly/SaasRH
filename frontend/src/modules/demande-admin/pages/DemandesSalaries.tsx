import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { ArrowLeft, Users, CheckCircle, XCircle, MessageSquare, Clock, FileText } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'
import { useState } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function DemandesSalaries() {
  const navigate = useNavigate()
  const notification = useNotification()
  const queryClient = useQueryClient()
  const [selectedDemande, setSelectedDemande] = useState<string | null>(null)
  const [motifRejet, setMotifRejet] = useState('')
  const [showRejetModal, setShowRejetModal] = useState(false)

  const { data: demandes, isLoading } = useQuery({
    queryKey: ['demandes-salaries'],
    queryFn: async () => {
      const response = await (api as any).get('/api/demande-admin/demandes')
      return response.data
    },
  })

  const validationMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'approuve' | 'rejete'; motif?: string }) => {
      const response = await (api as any).put(`/api/demande-admin/demandes/${id}`, {
        statut: action,
        motifRejet: motif,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['demandes-salaries'] })
      queryClient.invalidateQueries({ queryKey: ['demandes'] })
      notification.success(
        variables.action === 'approuve' ? 'Demande approuvée' : 'Demande rejetée',
        variables.action === 'approuve' 
          ? 'La demande a été approuvée avec succès'
          : 'La demande a été rejetée avec succès'
      )
      setShowRejetModal(false)
      setMotifRejet('')
      setSelectedDemande(null)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour de la demande')
    },
  })

  const handleApprouver = (id: string) => {
    validationMutation.mutate({ id, action: 'approuve' })
  }

  const handleRejeter = (id: string) => {
    setSelectedDemande(id)
    setShowRejetModal(true)
  }

  const confirmRejet = () => {
    if (selectedDemande && motifRejet.trim()) {
      validationMutation.mutate({ id: selectedDemande, action: 'rejete', motif: motifRejet })
    } else {
      notification.warning('Motif requis', 'Veuillez indiquer un motif de rejet')
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      absence: 'Absence',
      conge: 'Congé',
      attestation: 'Attestation',
    }
    return labels[type] || type
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'approuve':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejete':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
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
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/demande-admin')} 
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
            <Users size={22} style={{ color: '#2F5FD7' }} />
            <span>Demandes salariés</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Gérez les demandes de tous les salariés</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card border-2 border-yellow-200 bg-yellow-50/30">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    {demandes?.liste?.filter((d: any) => d.statut === 'en_attente').length || 0}
                  </p>
                  <p className="text-xs text-gray-600">En attente</p>
                </div>
              </div>
            </div>
            <div className="card border-2 border-green-200 bg-green-50/30">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    {demandes?.liste?.filter((d: any) => d.statut === 'approuve').length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Approuvées</p>
                </div>
              </div>
            </div>
            <div className="card border-2 border-red-200 bg-red-50/30">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-red-100">
                  <XCircle className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    {demandes?.liste?.filter((d: any) => d.statut === 'rejete').length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Rejetées</p>
                </div>
              </div>
            </div>
            <div className="card border-2 border-blue-200 bg-blue-50/30">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
                  <FileText size={24} style={{ color: '#2F5FD7' }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">
                    {demandes?.liste?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-2 border-blue-200 bg-blue-50/30">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <MessageSquare size={20} style={{ color: '#2F5FD7' }} />
            <span>Liste des demandes</span>
          </h2>
          
          {demandes?.liste && demandes.liste.length > 0 ? (
            <div className="space-y-3">
              {demandes.liste.map((demande: any) => (
                <div key={demande.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-800">{getTypeLabel(demande.type)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatutColor(demande.statut)}`}>
                          {getStatutLabel(demande.statut)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Période :</span>{' '}
                        {format(new Date(demande.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(demande.dateFin), 'dd MMM yyyy', { locale: fr })}
                      </p>
                      {demande.motif && (
                        <p className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Motif :</span> {demande.motif}
                        </p>
                      )}
                      {demande.motifRejet && demande.statut === 'rejete' && (
                        <p className="text-xs text-red-600 mt-1">
                          <span className="font-medium">Motif de rejet :</span> {demande.motifRejet}
                        </p>
                      )}
                    </div>
                    
                    {demande.statut === 'en_attente' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprouver(demande.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                          disabled={validationMutation.isPending}
                        >
                          <CheckCircle size={16} />
                          <span>Approuver</span>
                        </button>
                        <button
                          onClick={() => handleRejeter(demande.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                          disabled={validationMutation.isPending}
                        >
                          <XCircle size={16} />
                          <span>Rejeter</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-2 opacity-50" />
              <p>Aucune demande à traiter</p>
            </div>
          )}
          </div>
        </>
      )}

      {/* Modal de rejet */}
      {showRejetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rejeter la demande</h3>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez indiquer le motif du rejet de cette demande.
            </p>
            <textarea
              value={motifRejet}
              onChange={(e) => setMotifRejet(e.target.value)}
              rows={4}
              className="w-full input-field bg-white border-gray-200 focus:border-red-500 focus:ring-red-500 mb-4"
              placeholder="Motif du rejet..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejetModal(false)
                  setMotifRejet('')
                  setSelectedDemande(null)
                }}
                className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium"
                style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
              >
                Annuler
              </button>
              <button
                onClick={confirmRejet}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={validationMutation.isPending || !motifRejet.trim()}
              >
                {validationMutation.isPending ? 'Traitement...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

