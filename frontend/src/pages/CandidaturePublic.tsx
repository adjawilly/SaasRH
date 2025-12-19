import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../api'
import { Upload, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState } from 'react'

const candidatureSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  domaine: z.string().min(1, 'Le domaine est requis'),
  competences: z.array(z.string()).min(1, 'Au moins une compétence est requise'),
  niveauEtude: z.string().min(1, 'Le niveau d\'étude est requis'),
  genre: z.enum(['Homme', 'Femme', 'Autre']),
  commentaire: z.string().optional(),
})

type CandidatureForm = z.infer<typeof candidatureSchema>

export default function CandidaturePublic() {
  const { token } = useParams()
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [lmFile, setLmFile] = useState<File | null>(null)

  const { data: offre } = useQuery({
    queryKey: ['offre-public', token],
    queryFn: async () => {
      const response = await api.get(`/api/recrutement/offres/public/${token}`)
      return response.data
    },
  })

  const { data: domaines } = useQuery({
    queryKey: ['domaines'],
    queryFn: async () => {
      const response = await api.get('/api/parametrage/domaines')
      return response.data
    },
  })

  const { data: competences } = useQuery({
    queryKey: ['competences'],
    queryFn: async () => {
      const response = await api.get('/api/parametrage/competences')
      return response.data
    },
  })

  const { data: niveauxEtude } = useQuery({
    queryKey: ['niveaux-etude'],
    queryFn: async () => {
      const response = await api.get('/api/parametrage/niveaux-etude')
      return response.data
    },
  })

  const form = useForm<CandidatureForm>({
    resolver: zodResolver(candidatureSchema),
    defaultValues: {
      competences: [],
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: CandidatureForm) => {
      const formData = new FormData()
      // Convert competences array to string for backend
      const dataToSend = {
        ...data,
        competences: data.competences.join(','),
      }
      formData.append('data', JSON.stringify(dataToSend))
      if (cvFile) formData.append('cv', cvFile)
      if (lmFile) formData.append('lm', lmFile)
      formData.append('offreId', offre.id)

      const response = await api.post('/api/recrutement/candidatures/public', formData)
      return response.data
    },
    onSuccess: () => {
      toast.success('Candidature envoyée avec succès !')
      form.reset()
      setCvFile(null)
      setLmFile(null)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi')
    },
  })

  const onSubmit = (data: CandidatureForm) => {
    mutation.mutate(data)
  }

  if (!offre) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-white text-xl">Offre non trouvée</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-primary py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{offre.libelleOffre}</h1>
            <p className="text-gray-600">{offre.typeOffre} - {offre.domaineActivite}</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input {...form.register('nom')} className="input-field" />
                {form.formState.errors.nom && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.nom.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input {...form.register('prenom')} className="input-field" />
                {form.formState.errors.prenom && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.prenom.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input {...form.register('email')} type="email" className="input-field" />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domaine d'activité *</label>
              <select {...form.register('domaine')} className="input-field">
                <option value="">Sélectionner un domaine</option>
                {domaines?.map((d: any) => (
                  <option key={d.id} value={d.libelle}>{d.libelle}</option>
                ))}
              </select>
              {form.formState.errors.domaine && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.domaine.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences * (sélectionnez une ou plusieurs compétences)
              </label>
              <select
                multiple
                className="input-field min-h-[120px]"
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value)
                  form.setValue('competences', selected)
                }}
                value={form.watch('competences')}
              >
                {competences?.map((comp: any) => (
                  <option key={comp.id} value={comp.libelle}>
                    {comp.libelle}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs compétences
              </p>
              {form.watch('competences').length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.watch('competences').map((comp) => (
                    <span
                      key={comp}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              )}
              {form.formState.errors.competences && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.competences.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'étude *</label>
              <select {...form.register('niveauEtude')} className="input-field">
                <option value="">Sélectionner un niveau</option>
                {niveauxEtude?.map((n: any) => (
                  <option key={n.id} value={n.libelle}>{n.libelle}</option>
                ))}
              </select>
              {form.formState.errors.niveauEtude && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.niveauEtude.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
              <select {...form.register('genre')} className="input-field">
                <option value="">Sélectionner</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CV (PDF)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
                {cvFile && <span className="text-sm text-gray-600">{cvFile.name}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lettre de motivation (PDF)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setLmFile(e.target.files?.[0] || null)}
                  className="input-field"
                />
                {lmFile && <span className="text-sm text-gray-600">{lmFile.name}</span>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
              <textarea {...form.register('commentaire')} rows={4} className="input-field" />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center space-x-2"
              disabled={mutation.isPending}
            >
              <Send size={20} />
              <span>{mutation.isPending ? 'Envoi en cours...' : 'Envoyer ma candidature'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

