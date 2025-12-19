import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import api from '../../../api'
import { CalendarX, Plus, Edit2, Trash2, X, Save } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function MotifsAbsence() {
  const notification = useNotification()
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const form = useForm({
    defaultValues: {
      libelle: '',
    }
  })

  const { data: motifs, isLoading } = useQuery({
    queryKey: ['motifs-absence'],
    queryFn: async () => {
      const response = await (api as any).get('/api/parametrage/motifs-absence')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (libelle: string) => {
      const response = await (api as any).post('/api/parametrage/motifs-absence', { libelle })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motifs-absence'] })
      notification.success('Motif créé', 'Le motif d\'absence a été créé avec succès')
      form.reset()
      setShowForm(false)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la création du motif')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, libelle }: { id: string; libelle: string }) => {
      const response = await (api as any).put(`/api/parametrage/motifs-absence/${id}`, { libelle })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motifs-absence'] })
      notification.success('Motif modifié', 'Le motif d\'absence a été modifié avec succès')
      setEditingId(null)
      form.reset()
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la modification du motif')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await (api as any).delete(`/api/parametrage/motifs-absence/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motifs-absence'] })
      notification.success('Motif supprimé', 'Le motif d\'absence a été supprimé avec succès')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la suppression du motif')
    },
  })

  const handleEdit = (motif: any) => {
    setEditingId(motif.id)
    form.setValue('libelle', motif.libelle)
    setShowForm(true)
  }

  const handleCancel = () => {
    setEditingId(null)
    setShowForm(false)
    form.reset()
  }

  const onSubmit = (data: any) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, libelle: data.libelle })
    } else {
      createMutation.mutate(data.libelle)
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 
            className="text-xl md:text-2xl font-bold flex items-center space-x-2"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <CalendarX size={22} style={{ color: '#2F5FD7' }} />
            <span>Motifs d'absence</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Gérez les motifs d'absence disponibles</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              form.reset()
            }}
            className="px-3 py-2 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 text-sm"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
            }}
          >
            <Plus size={16} />
            <span>Nouveau motif</span>
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Libellé du motif *
              </label>
              <input
                {...form.register('libelle', { required: true })}
                type="text"
                className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: Maladie, Congé payé, RTT..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium"
                style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
              >
                <X size={16} className="inline mr-1" />
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                }}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Save size={16} />
                <span>{editingId ? (updateMutation.isPending ? 'Modification...' : 'Modifier') : (createMutation.isPending ? 'Création...' : 'Créer')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des motifs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          {motifs && motifs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Motif
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {motifs.map((motif: any) => (
                    <tr key={motif.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{motif.libelle}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(motif)}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Êtes-vous sûr de vouloir supprimer ce motif ?')) {
                                deleteMutation.mutate(motif.id)
                              }
                            }}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                            title="Supprimer"
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CalendarX size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucun motif d'absence disponible</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

