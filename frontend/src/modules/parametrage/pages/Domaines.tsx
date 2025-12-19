import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function Domaines() {
  const [editing, setEditing] = useState<any>(null)
  const [libelle, setLibelle] = useState('')

  const { data: domaines, refetch } = useQuery({
    queryKey: ['domaines'],
    queryFn: async () => {
      const response = await api.get('/api/parametrage/domaines')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: { libelle: string }) => {
      const response = await api.post('/api/parametrage/domaines', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Domaine créé')
      refetch()
      setLibelle('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; libelle: string }) => {
      const response = await api.put(`/api/parametrage/domaines/${data.id}`, { libelle: data.libelle })
      return response.data
    },
    onSuccess: () => {
      toast.success('Domaine mis à jour')
      refetch()
      setEditing(null)
      setLibelle('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/parametrage/domaines/${id}`)
    },
    onSuccess: () => {
      toast.success('Domaine supprimé')
      refetch()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateMutation.mutate({ id: editing.id, libelle })
    } else {
      createMutation.mutate({ libelle })
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-6">
          <input
            type="text"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            className="input-field flex-1"
            placeholder="Libellé du domaine d'activité"
            required
          />
          <button type="submit" className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>{editing ? 'Modifier' : 'Ajouter'}</span>
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setLibelle('') }} className="btn-secondary">
              Annuler
            </button>
          )}
        </form>
        {domaines && domaines.length > 0 ? (
          <div className="space-y-2">
            {domaines.map((dom: any) => (
              <div key={dom.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-800">{dom.libelle}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => { setEditing(dom); setLibelle(dom.libelle) }} 
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${dom.libelle}" ?`)) {
                        deleteMutation.mutate(dom.id)
                      }
                    }} 
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">Aucun élément pour le moment</p>
            <p className="text-gray-500 text-sm mt-1">Cliquez sur "Ajouter" pour créer votre premier élément</p>
          </div>
        )}
      </div>
    </div>
  )
}

