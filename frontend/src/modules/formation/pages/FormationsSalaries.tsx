import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { ArrowLeft, Users, GraduationCap, CheckCircle, XCircle, Building2, TrendingUp, AlertCircle, UserPlus, Search } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'
import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Liste des directions disponibles
const DIRECTIONS = [
  'Informatique',
  'Ressources Humaines',
  'Marketing',
  'Commercial',
  'Finance',
  'Direction Générale',
  'Production',
  'Qualité',
  'Logistique',
]

export default function FormationsSalaries() {
  const navigate = useNavigate()
  const notification = useNotification()
  const queryClient = useQueryClient()
  const [selectedFormation, setSelectedFormation] = useState<string | null>(null)
  const [motifRejet, setMotifRejet] = useState('')
  const [direction, setDirection] = useState('')
  const [selectedSalarieId, setSelectedSalarieId] = useState('')
  const [searchSalarie, setSearchSalarie] = useState('')
  const [showRejetModal, setShowRejetModal] = useState(false)
  const [showDirectionModal, setShowDirectionModal] = useState(false)
  const [showSalarieModal, setShowSalarieModal] = useState(false)

  const { data: formations, isLoading } = useQuery({
    queryKey: ['formations-salaries'],
    queryFn: async () => {
      const response = await (api as any).get('/api/formation')
      return response.data
    },
  })

  const { data: salaries } = useQuery({
    queryKey: ['salaries'],
    queryFn: async () => {
      const response = await (api as any).get('/api/gestion-admin/salaries')
      return response.data
    },
  })

  // Filtrer les salariés selon la recherche
  const filteredSalaries = useMemo(() => {
    if (!salaries) return []
    if (!searchSalarie.trim()) return salaries
    const searchLower = searchSalarie.toLowerCase()
    return salaries.filter((salarie: any) => 
      salarie.nom?.toLowerCase().includes(searchLower) ||
      salarie.prenom?.toLowerCase().includes(searchLower) ||
      `${salarie.prenom} ${salarie.nom}`.toLowerCase().includes(searchLower) ||
      salarie.email?.toLowerCase().includes(searchLower)
    )
  }, [salaries, searchSalarie])

  const validationMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'valide' | 'rejete'; motif?: string; direction?: string }) => {
      const response = await (api as any).put(`/api/formation/${id}`, {
        statut: action,
        motifRejet: motif,
        direction: direction,
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formations-salaries'] })
      queryClient.invalidateQueries({ queryKey: ['mes-formations'] })
      notification.success(
        variables.action === 'valide' ? 'Formation validée' : 'Formation rejetée',
        variables.action === 'valide' 
          ? 'La formation a été validée avec succès'
          : 'La formation a été rejetée avec succès'
      )
      setShowRejetModal(false)
      setShowDirectionModal(false)
      setMotifRejet('')
      setDirection('')
      setSelectedFormation(null)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour de la formation')
    },
  })

  const directionMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: string }) => {
      const response = await (api as any).put(`/api/formation/${id}`, {
        direction: direction,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations-salaries'] })
      notification.success('Direction assignée', 'La direction a été assignée à la formation avec succès')
      setShowDirectionModal(false)
      setDirection('')
      setSelectedFormation(null)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'assignation de la direction')
    },
  })

  const salarieMutation = useMutation({
    mutationFn: async ({ id, salarieId }: { id: string; salarieId: string }) => {
      const salarie = salaries?.find((s: any) => s.id === salarieId)
      const response = await (api as any).put(`/api/formation/${id}`, {
        salarieId: salarieId,
        salarieNom: salarie?.nom,
        salariePrenom: salarie?.prenom,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations-salaries'] })
      queryClient.invalidateQueries({ queryKey: ['mes-formations'] })
      notification.success('Salarié assigné', 'Le salarié a été assigné à la formation avec succès')
      setShowSalarieModal(false)
      setSelectedSalarieId('')
      setSearchSalarie('')
      setSelectedFormation(null)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'assignation du salarié')
    },
  })

  const handleValider = (id: string) => {
    validationMutation.mutate({ id, action: 'valide' })
  }

  const handleRejeter = (id: string) => {
    setSelectedFormation(id)
    setShowRejetModal(true)
  }

  const handleAssignerDirection = (id: string) => {
    setSelectedFormation(id)
    setShowDirectionModal(true)
  }

  const handleAssignerSalarie = (id: string) => {
    setSelectedFormation(id)
    setShowSalarieModal(true)
  }

  const confirmRejet = () => {
    if (selectedFormation && motifRejet.trim()) {
      validationMutation.mutate({ id: selectedFormation, action: 'rejete', motif: motifRejet })
    } else {
      notification.warning('Motif requis', 'Veuillez indiquer un motif de rejet')
    }
  }

  const confirmDirection = () => {
    if (selectedFormation && direction.trim()) {
      directionMutation.mutate({ id: selectedFormation, direction })
    } else {
      notification.warning('Direction requise', 'Veuillez sélectionner une direction')
    }
  }

  const confirmSalarie = () => {
    if (selectedFormation && selectedSalarieId) {
      salarieMutation.mutate({ id: selectedFormation, salarieId: selectedSalarieId })
    } else {
      notification.warning('Salarié requis', 'Veuillez sélectionner un salarié')
    }
  }

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

  const formationsValidees = formations?.filter((f: any) => f.statut === 'valide' || f.statut === 'termine') || []
  const formationsEnAttente = formations?.filter((f: any) => f.statut === 'en_attente_validation') || []

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
            <Users size={22} style={{ color: '#2F5FD7' }} />
            <span>Formations salariés</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Gérez les formations de tous les salariés</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card border-2 border-yellow-200 bg-yellow-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-yellow-100">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{formationsEnAttente.length}</p>
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
              <p className="text-xl font-bold text-gray-800">{formationsValidees.length}</p>
              <p className="text-xs text-gray-600">Validées</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
              <TrendingUp size={24} style={{ color: '#2F5FD7' }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {formations?.filter((f: any) => f.statut === 'en_cours').length || 0}
              </p>
              <p className="text-xs text-gray-600">En cours</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-purple-200 bg-purple-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-purple-100">
              <GraduationCap className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{formations?.length || 0}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <>
          {/* Formations validées avec progression */}
          {formationsValidees.length > 0 && (
            <div className="card border-2 border-green-200 bg-green-50/30">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-600" />
                <span>Formations validées - Progression</span>
              </h2>
              <div className="space-y-3">
                {formationsValidees.map((formation: any) => (
                  <div key={formation.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{formation.libelle}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatutColor(formation.statut)}`}>
                            {getStatutLabel(formation.statut)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Salarié :</span> {formation.salariePrenom} {formation.salarieNom}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                          {format(new Date(formation.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(formation.dateFin), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        {formation.progression !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-600">Progression</span>
                              <span className="text-xs font-medium">{formation.progression}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${formation.progression}%`,
                                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {formation.direction && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                            <Building2 size={12} />
                            <span>Direction : {formation.direction}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formations en attente de validation */}
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <GraduationCap size={20} style={{ color: '#2F5FD7' }} />
              <span>Formations en attente de validation</span>
            </h2>
            
            {formationsEnAttente.length > 0 ? (
              <div className="space-y-3">
                {formationsEnAttente.map((formation: any) => (
                  <div key={formation.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{formation.libelle}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatutColor(formation.statut)}`}>
                            {getStatutLabel(formation.statut)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Salarié :</span> {formation.salariePrenom} {formation.salarieNom}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">{formation.description}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(formation.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(formation.dateFin), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        {formation.direction && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1">
                            <Building2 size={12} />
                            <span>Direction : {formation.direction}</span>
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleValider(formation.id)}
                          className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                          disabled={validationMutation.isPending}
                        >
                          <CheckCircle size={16} />
                          <span>Valider</span>
                        </button>
                        <button
                          onClick={() => handleRejeter(formation.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                          disabled={validationMutation.isPending}
                        >
                          <XCircle size={16} />
                          <span>Rejeter</span>
                        </button>
                        <button
                          onClick={() => handleAssignerDirection(formation.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                          disabled={directionMutation.isPending}
                        >
                          <Building2 size={16} />
                          <span>Direction</span>
                        </button>
                        <button
                          onClick={() => handleAssignerSalarie(formation.id)}
                          className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                          disabled={salarieMutation.isPending}
                        >
                          <UserPlus size={16} />
                          <span>Salarié</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <GraduationCap size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune formation en attente de validation</p>
              </div>
            )}
          </div>

          {/* Toutes les formations */}
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <GraduationCap size={20} style={{ color: '#2F5FD7' }} />
              <span>Toutes les formations</span>
            </h2>
            
            {formations && formations.length > 0 ? (
              <div className="space-y-3">
                {formations.map((formation: any) => (
                  <div key={formation.id} className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{formation.libelle}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${getStatutColor(formation.statut)}`}>
                            {getStatutLabel(formation.statut)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Salarié :</span> {formation.salariePrenom} {formation.salarieNom}
                        </p>
                        <p className="text-sm text-gray-600 mb-1">{formation.description}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(formation.dateDebut), 'dd MMM yyyy', { locale: fr })} - {format(new Date(formation.dateFin), 'dd MMM yyyy', { locale: fr })}
                        </p>
                        {formation.progression !== undefined && formation.statut === 'en_cours' && (
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
                        {formation.direction && (
                          <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1">
                            <Building2 size={12} />
                            <span>Direction : {formation.direction}</span>
                          </p>
                        )}
                        {formation.motifRejet && formation.statut === 'rejete' && (
                          <p className="text-xs text-red-600 mt-2">
                            <span className="font-medium">Motif de rejet :</span> {formation.motifRejet}
                          </p>
                        )}
                      </div>
                      
                      {formation.statut === 'en_attente_validation' && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleValider(formation.id)}
                            className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                            disabled={validationMutation.isPending}
                          >
                            <CheckCircle size={16} />
                            <span>Valider</span>
                          </button>
                          <button
                            onClick={() => handleRejeter(formation.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                            disabled={validationMutation.isPending}
                          >
                            <XCircle size={16} />
                            <span>Rejeter</span>
                          </button>
                          <button
                            onClick={() => handleAssignerDirection(formation.id)}
                            className="px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                            disabled={directionMutation.isPending}
                          >
                            <Building2 size={16} />
                            <span>Direction</span>
                          </button>
                          <button
                            onClick={() => handleAssignerSalarie(formation.id)}
                            className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                            disabled={salarieMutation.isPending}
                          >
                            <UserPlus size={16} />
                            <span>Salarié</span>
                          </button>
                        </div>
                      )}
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
        </>
      )}

      {/* Modal de rejet */}
      {showRejetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Rejeter la formation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez indiquer le motif du rejet de cette formation.
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
                  setSelectedFormation(null)
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

      {/* Modal d'assignation de direction */}
      {showDirectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Building2 size={20} style={{ color: '#2F5FD7' }} />
              <span>Assigner une direction</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Veuillez sélectionner la direction à assigner à cette formation.
            </p>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 mb-4"
            >
              <option value="">Sélectionner une direction</option>
              {DIRECTIONS.map((dir) => (
                <option key={dir} value={dir}>{dir}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDirectionModal(false)
                  setDirection('')
                  setSelectedFormation(null)
                }}
                className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium"
                style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
              >
                Annuler
              </button>
              <button
                onClick={confirmDirection}
                className="px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                }}
                disabled={directionMutation.isPending || !direction.trim()}
              >
                {directionMutation.isPending ? 'Traitement...' : 'Assigner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'assignation de salarié */}
      {showSalarieModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <UserPlus size={20} style={{ color: '#2F5FD7' }} />
              <span>Assigner un salarié</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Recherchez et sélectionnez le salarié à assigner à cette formation.
            </p>
            
            {/* Champ de recherche */}
            <div className="relative mb-4">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchSalarie}
                onChange={(e) => setSearchSalarie(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                placeholder="Rechercher par nom, prénom ou email..."
              />
            </div>

            {/* Liste des salariés filtrés */}
            <div className="max-h-60 overflow-y-auto border-2 border-gray-200 rounded-lg mb-4">
              {filteredSalaries.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredSalaries.map((salarie: any) => (
                    <button
                      key={salarie.id}
                      onClick={() => setSelectedSalarieId(salarie.id)}
                      className={`w-full text-left p-3 hover:bg-blue-50 transition-colors ${
                        selectedSalarieId === salarie.id ? 'bg-blue-100 border-l-4' : ''
                      }`}
                      style={selectedSalarieId === salarie.id ? { borderColor: '#2F5FD7' } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {salarie.prenom} {salarie.nom}
                          </p>
                          <p className="text-xs text-gray-600">{salarie.email}</p>
                          {salarie.fonction && (
                            <p className="text-xs text-gray-500">{salarie.fonction}</p>
                          )}
                        </div>
                        {selectedSalarieId === salarie.id && (
                          <CheckCircle size={20} style={{ color: '#2F5FD7' }} />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {searchSalarie.trim() ? 'Aucun salarié trouvé' : 'Aucun salarié disponible'}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowSalarieModal(false)
                  setSelectedSalarieId('')
                  setSearchSalarie('')
                  setSelectedFormation(null)
                }}
                className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium"
                style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
              >
                Annuler
              </button>
              <button
                onClick={confirmSalarie}
                className="px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                }}
                disabled={salarieMutation.isPending || !selectedSalarieId}
              >
                {salarieMutation.isPending ? 'Traitement...' : 'Assigner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

