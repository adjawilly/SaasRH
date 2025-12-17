import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Download } from 'lucide-react'
import { toast } from 'react-toastify'

export default function DemandeAttestation() {
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/demande-admin/attestations')
      return response.data
    },
    onSuccess: (data) => {
      window.open(data.url, '_blank')
      toast.success('Attestation générée')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/demande-admin')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Attestation de travail</h1>
      </div>
      <div className="card">
        <p className="mb-4">Générer une attestation de travail</p>
        <button onClick={() => mutation.mutate()} className="btn-primary flex items-center space-x-2" disabled={mutation.isPending}>
          <Download size={20} />
          <span>Générer l'attestation</span>
        </button>
      </div>
    </div>
  )
}

