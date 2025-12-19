import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { GraduationCap, History, TrendingUp, AlertCircle, Plus, X } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createPortal } from 'react-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MesFormations() {
  const navigate = useNavigate()
  const notification = useNotification()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [showDemandeModal, setShowDemandeModal] = useState(false)
  const form = useForm({
    defaultValues: {
      libelle: '',
      description: '',
      motif: '',
      dateDebut: '',
      dateFin: '',
    }
  })

  const { data: formations, isLoading } = useQuery({
    queryKey: ['mes-formations'],
    queryFn: async () => {
      const response = await (api as any).get('/api/formation')
      return response.data
    },
  })

  const demandeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await (api as any).post('/api/formation/demande', {
        ...data,
        salarieId: user?.id || '1',
        statut: 'en_attente_validation',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mes-formations'] })
      notification.success('Demande envoyée', 'Votre demande de formation a été envoyée avec succès')
      form.reset()
      setShowDemandeModal(false)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'envoi de la demande')
    },
  })

  const formationsEnCours = formations?.filter((f: any) => f.statut === 'en_cours') || []
  const formationsTerminees = formations?.filter((f: any) => f.statut === 'termine' || f.statut === 'valide') || []

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'valide':
      case 'termine':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'en_cours':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'rejete':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'en_attente_validation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      planifie: 'Planifiée',
      en_cours: 'En cours',
      termine: 'Terminée',
      valide: 'Validée',
      rejete: 'Rejetée',
      en_attente_validation: 'En attente de validation',
    }
    return labels[statut] || statut
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/formation')} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            style={{ color: '#2F5FD7' }}
          >
            <History size={20} />
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
              <GraduationCap size={22} style={{ color: '#2F5FD7' }} />
              <span>Mes formations</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">Consultez vos formations et suivez votre progression</p>
          </div>
        </div>
        <button
          onClick={() => setShowDemandeModal(true)}
          className="px-3 py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
          }}
        >
          <Plus size={16} />
          <span>Demande de formation</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
              <TrendingUp size={24} style={{ color: '#2F5FD7' }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{formationsEnCours.length}</p>
              <p className="text-xs text-gray-600">En cours</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-green-200 bg-green-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-100">
              <GraduationCap className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{formationsTerminees.length}</p>
              <p className="text-xs text-gray-600">Terminées</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-purple-200 bg-purple-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-purple-100">
              <History className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{formations?.length || 0}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formations en cours */}
      {formationsEnCours.length > 0 && (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <TrendingUp size={20} style={{ color: '#2F5FD7' }} />
            <span>Formations en cours</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formationsEnCours.map((formation: any) => (
              <div key={formation.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{formation.libelle}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatutColor(formation.statut)}`}>
                    {getStatutLabel(formation.statut)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{formation.description}</p>
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Progression</span>
                    <span className="text-xs font-medium text-gray-800">{formation.progression || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${formation.progression || 0}%`,
                        background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {format(new Date(formation.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(formation.dateFin), 'dd MMM yyyy', { locale: fr })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historique */}
      <div className="card border-2 border-blue-200 bg-blue-50/30">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
          <History size={20} style={{ color: '#2F5FD7' }} />
          <span>Historique des formations</span>
        </h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
          </div>
        ) : formations && formations.length > 0 ? (
          <div className="space-y-3">
            {formations.map((formation: any) => (
              <div key={formation.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <GraduationCap size={18} style={{ color: '#2F5FD7' }} />
                      <h3 className="font-semibold text-gray-800">{formation.libelle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatutColor(formation.statut)}`}>
                        {getStatutLabel(formation.statut)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{formation.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(formation.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(formation.dateFin), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    {formation.progression && formation.statut === 'en_cours' && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Progression</span>
                          <span className="text-xs font-medium">{formation.progression}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full"
                            style={{ 
                              width: `${formation.progression}%`,
                              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {formation.motifRejet && formation.statut === 'rejete' && (
                      <p className="text-xs text-red-600 mt-2">
                        <span className="font-medium">Motif de rejet :</span> {formation.motifRejet}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucune formation disponible</p>
          </div>
        )}
      </div>

      {/* Modal de demande de formation */}
      {showDemandeModal && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            style={{ 
              margin: 'auto',
              position: 'relative'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                <GraduationCap size={20} style={{ color: '#2F5FD7' }} />
                <span>Demande de formation</span>
              </h3>
              <button
                onClick={() => {
                  setShowDemandeModal(false)
                  form.reset()
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                style={{ color: '#2F5FD7' }}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={form.handleSubmit((data) => demandeMutation.mutate(data))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intitulé de la formation *
                </label>
                <input
                  {...form.register('libelle', { required: true })}
                  type="text"
                  className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ex: Formation React Avancé"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...form.register('description', { required: true })}
                  rows={3}
                  className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Décrivez la formation souhaitée..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motif de la demande *
                </label>
                <textarea
                  {...form.register('motif', { required: true })}
                  rows={3}
                  className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Expliquez pourquoi vous souhaitez suivre cette formation..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début souhaitée *
                  </label>
                  <input
                    {...form.register('dateDebut', { required: true })}
                    type="date"
                    className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin souhaitée *
                  </label>
                  <input
                    {...form.register('dateFin', { required: true })}
                    type="date"
                    className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDemandeModal(false)
                    form.reset()
                  }}
                  className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium"
                  style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
                  style={{
                    background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                  }}
                  disabled={demandeMutation.isPending}
                >
                  <Plus size={16} />
                  <span>{demandeMutation.isPending ? 'Envoi...' : 'Envoyer la demande'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

