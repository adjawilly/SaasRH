import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Edit, Trash2, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function Fonctions() {
  const [editing, setEditing] = useState<any>(null)
  const [libelle, setLibelle] = useState('')

  const { data: fonctions, refetch } = useQuery({
    queryKey: ['fonctions'],
    queryFn: async () => {
      const response = await axios.get('/api/parametrage/fonctions')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: { libelle: string }) => {
      const response = await axios.post('/api/parametrage/fonctions', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Fonction créée')
      refetch()
      setLibelle('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; libelle: string }) => {
      const response = await axios.put(`/api/parametrage/fonctions/${data.id}`, { libelle: data.libelle })
      return response.data
    },
    onSuccess: () => {
      toast.success('Fonction mise à jour')
      refetch()
      setEditing(null)
      setLibelle('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/parametrage/fonctions/${id}`)
    },
    onSuccess: () => {
      toast.success('Fonction supprimée')
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
            placeholder="Libellé de la fonction"
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
        {fonctions && fonctions.length > 0 ? (
          <div className="space-y-2">
            {fonctions.map((f: any) => (
              <div key={f.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-800">{f.libelle}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => { setEditing(f); setLibelle(f.libelle) }} 
                    className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${f.libelle}" ?`)) {
                        deleteMutation.mutate(f.id)
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

