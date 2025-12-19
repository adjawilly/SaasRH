import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../../api'
import { Plus, Edit, Trash2, Award, X, Save } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Competences() {
  const notification = useNotification()
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const form = useForm({
    defaultValues: {
      libelle: '',
    }
  })

  const { data: competences, isLoading } = useQuery({
    queryKey: ['competences'],
    queryFn: async () => {
      const response = await (api as any).get('/api/parametrage/competences')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (libelle: string) => {
      const response = await (api as any).post('/api/parametrage/competences', { libelle })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences'] })
      notification.success('Compétence créée', 'La compétence a été créée avec succès')
      form.reset()
      setShowForm(false)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la création de la compétence')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, libelle }: { id: string; libelle: string }) => {
      const response = await (api as any).put(`/api/parametrage/competences/${id}`, { libelle })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences'] })
      notification.success('Compétence modifiée', 'La compétence a été modifiée avec succès')
      setEditingId(null)
      form.reset()
      setShowForm(false)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la modification de la compétence')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await (api as any).delete(`/api/parametrage/competences/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competences'] })
      notification.success('Compétence supprimée', 'La compétence a été supprimée avec succès')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la suppression de la compétence')
    },
  })

  const handleEdit = (competence: any) => {
    setEditingId(competence.id)
    form.setValue('libelle', competence.libelle)
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
            <Award size={22} style={{ color: '#2F5FD7' }} />
            <span>Compétences</span>
          </h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Gérez les compétences disponibles</p>
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
            <span>Nouvelle compétence</span>
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Libellé de la compétence *
              </label>
              <input
                {...form.register('libelle', { required: true })}
                type="text"
                className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: React, Node.js, TypeScript..."
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

      {/* Liste des compétences */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          {competences && competences.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Compétence
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {competences.map((comp: any) => (
                    <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{comp.libelle}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(comp)}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
                                deleteMutation.mutate(comp.id)
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
              <Award size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune compétence disponible</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

