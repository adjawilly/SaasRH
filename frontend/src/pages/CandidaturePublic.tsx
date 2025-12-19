import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../api'
import { Upload, Send, Briefcase, User, Mail, GraduationCap, FileText, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useNotification } from '../contexts/NotificationContext'
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
  const [isSubmitted, setIsSubmitted] = useState(false)
  const notification = useNotification()

  const { data: offre, isLoading: offreLoading } = useQuery({
    queryKey: ['offre-public', token],
    queryFn: async () => {
      const response = await (api as any).get(`/api/recrutement/offres/public/${token}`)
      return response.data
    },
  })

  const { data: domaines } = useQuery({
    queryKey: ['domaines'],
    queryFn: async () => {
      const response = await (api as any).get('/api/parametrage/domaines')
      return response.data
    },
  })

  const { data: competences } = useQuery({
    queryKey: ['competences'],
    queryFn: async () => {
      const response = await (api as any).get('/api/parametrage/competences')
      return response.data
    },
  })

  const { data: niveauxEtude } = useQuery({
    queryKey: ['niveaux-etude'],
    queryFn: async () => {
      const response = await (api as any).get('/api/parametrage/niveaux-etude')
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

      const response = await (api as any).post('/api/recrutement/candidatures/public', formData)
      return response.data
    },
    onSuccess: () => {
      notification.success('Candidature envoyée avec succès !', 'Votre candidature a été transmise avec succès')
      form.reset()
      setCvFile(null)
      setLmFile(null)
      setIsSubmitted(true)
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'envoi de votre candidature')
    },
  })

  const onSubmit = (data: CandidatureForm) => {
    mutation.mutate(data)
  }

  if (offreLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!offre) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
      }}>
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Offre non trouvée</h2>
          <p className="text-gray-600">Cette offre d'emploi n'existe pas ou a expiré.</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{
        background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
      }}>
        <div className="max-w-2xl mx-auto w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
            }}>
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Candidature envoyée avec succès !</h2>
            <p className="text-lg text-gray-600 mb-6">
              Merci pour votre candidature. Nous avons bien reçu votre dossier et vous contacterons sous peu.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <Briefcase size={20} style={{ color: '#2F5FD7' }} />
                <span>{offre.libelleOffre}</span>
              </h3>
              <p className="text-sm text-gray-600">{offre.typeOffre} - {offre.domaineActivite}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'CDI':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'CDD':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Stage':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen py-8 md:py-12 px-4" style={{
      background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
    }}>
      <div className="max-w-3xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-6 border-2 border-white/20">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-xl bg-white border-2" style={{ borderColor: '#2F5FD7' }}>
                <Briefcase size={40} style={{ color: '#2F5FD7' }} />
              </div>
            </div>
            <h1 
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {offre.libelleOffre}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className={`px-3 py-1 rounded-lg border-2 text-sm font-medium ${getTypeBadgeColor(offre.typeOffre)}`}>
                {offre.typeOffre}
              </span>
              <span className="text-gray-600 text-sm md:text-base">•</span>
              <span className="text-gray-600 text-sm md:text-base">{offre.domaineActivite}</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-white/20">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center space-x-2">
              <User size={24} style={{ color: '#2F5FD7' }} />
              <span>Formulaire de candidature</span>
            </h2>
            <p className="text-sm text-gray-600 mt-2">Remplissez le formulaire ci-dessous pour postuler</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
            {/* Informations personnelles */}
            <div className="bg-blue-50/50 border-2 border-blue-200 rounded-lg p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <User size={20} style={{ color: '#2F5FD7' }} />
                <span>Informations personnelles</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <User size={14} />
                    <span>Nom *</span>
                  </label>
                  <input 
                    {...form.register('nom')} 
                    className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                    placeholder="Votre nom"
                  />
                  {form.formState.errors.nom && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.nom.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <User size={14} />
                    <span>Prénom *</span>
                  </label>
                  <input 
                    {...form.register('prenom')} 
                    className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                    placeholder="Votre prénom"
                  />
                  {form.formState.errors.prenom && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.prenom.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Mail size={14} />
                  <span>Email *</span>
                </label>
                <input 
                  {...form.register('email')} 
                  type="email" 
                  className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                  placeholder="votre@email.com"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Informations professionnelles */}
            <div className="bg-purple-50/50 border-2 border-purple-200 rounded-lg p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Briefcase size={20} style={{ color: '#2F5FD7' }} />
                <span>Informations professionnelles</span>
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domaine d'activité *</label>
                <select 
                  {...form.register('domaine')} 
                  className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un domaine</option>
                  {domaines?.map((d: any) => (
                    <option key={d.id} value={d.libelle}>{d.libelle}</option>
                  ))}
                </select>
                {form.formState.errors.domaine && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.domaine.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compétences * (sélectionnez une ou plusieurs compétences)
                </label>
                <select
                  multiple
                  className="input-field min-h-[100px] bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                  <div className="mt-3 flex flex-wrap gap-1.5 md:gap-2">
                    {form.watch('competences').map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-1 bg-blue-100 text-blue-700 border-2 border-blue-200 rounded-lg text-xs md:text-sm"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                )}
                {form.formState.errors.competences && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.competences.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <GraduationCap size={14} />
                  <span>Niveau d'étude *</span>
                </label>
                <select 
                  {...form.register('niveauEtude')} 
                  className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveauxEtude?.map((n: any) => (
                    <option key={n.id} value={n.libelle}>{n.libelle}</option>
                  ))}
                </select>
                {form.formState.errors.niveauEtude && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.niveauEtude.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                <select 
                  {...form.register('genre')} 
                  className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                </select>
                {form.formState.errors.genre && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.genre.message}</p>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="bg-green-50/50 border-2 border-green-200 rounded-lg p-4 md:p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FileText size={20} style={{ color: '#2F5FD7' }} />
                <span>Documents</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <Upload size={14} />
                    <span>CV (PDF) *</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm font-medium" style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}>
                        <Upload size={16} />
                        <span>{cvFile ? 'Changer le fichier' : 'Choisir un fichier'}</span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                    {cvFile && (
                      <span className="text-sm text-gray-600 flex items-center space-x-1">
                        <FileText size={14} />
                        <span>{cvFile.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                    <Upload size={14} />
                    <span>Lettre de motivation (PDF)</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm font-medium" style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}>
                        <Upload size={16} />
                        <span>{lmFile ? 'Changer le fichier' : 'Choisir un fichier'}</span>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setLmFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                    {lmFile && (
                      <span className="text-sm text-gray-600 flex items-center space-x-1">
                        <FileText size={14} />
                        <span>{lmFile.name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Commentaire */}
            <div className="bg-gray-50/50 border-2 border-gray-200 rounded-lg p-4 md:p-5">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                <MessageSquare size={14} />
                <span>Commentaire (optionnel)</span>
              </label>
              <textarea 
                {...form.register('commentaire')} 
                rows={4} 
                className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
                placeholder="Ajoutez un commentaire ou une note supplémentaire..."
              />
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
              className="w-full px-6 py-3 md:py-4 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 text-base md:text-lg disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={mutation.isPending}
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
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

