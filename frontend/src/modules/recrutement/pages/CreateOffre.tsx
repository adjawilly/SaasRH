import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

const offreSchema = z.object({
  libelleOffre: z.string().min(3, 'Le libellé doit contenir au moins 3 caractères'),
  typeOffre: z.enum(['CDD', 'CDI', 'Stage']),
  domaineActivite: z.string().min(1, 'Le domaine est requis'),
  competences: z.array(z.string()).min(1, 'Au moins une compétence est requise'),
  niveauEtude: z.string().min(1, 'Le niveau d\'étude est requis'),
  dateEffet: z.string(),
  dateExpiration: z.string(),
})

type OffreForm = z.infer<typeof offreSchema>

export default function CreateOffre() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

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

  const { data: offreData } = useQuery({
    queryKey: ['offre', id],
    queryFn: async () => {
      const response = await api.get(`/api/recrutement/offres/${id}`)
      return response.data
    },
    enabled: isEditMode,
  })

  const form = useForm<OffreForm>({
    resolver: zodResolver(offreSchema),
    defaultValues: {
      competences: [],
    },
  })

  useEffect(() => {
    if (offreData && isEditMode) {
      form.reset({
        libelleOffre: offreData.libelleOffre,
        typeOffre: offreData.typeOffre,
        domaineActivite: offreData.domaineActivite,
        competences: Array.isArray(offreData.competences) ? offreData.competences : (offreData.competences ? offreData.competences.split(',') : []),
        niveauEtude: offreData.niveauEtude,
        dateEffet: offreData.dateEffet ? offreData.dateEffet.split('T')[0] : '',
        dateExpiration: offreData.dateExpiration ? offreData.dateExpiration.split('T')[0] : '',
      })
    }
  }, [offreData, isEditMode, form])

  const mutation = useMutation({
    mutationFn: async (data: OffreForm) => {
      if (isEditMode) {
        const response = await api.put(`/api/recrutement/offres/${id}`, data)
        return response.data
      } else {
        const response = await api.post('/api/recrutement/offres', data)
        return response.data
      }
    },
    onSuccess: () => {
      toast.success(isEditMode ? 'Offre modifiée avec succès' : 'Offre créée avec succès')
      navigate('/recrutement')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Erreur lors de ${isEditMode ? 'la modification' : 'la création'}`)
    },
  })

  const onSubmit = (data: OffreForm) => {
    mutation.mutate(data)
  }

  const removeCompetence = (competence: string) => {
    const current = form.getValues('competences')
    form.setValue('competences', current.filter(c => c !== competence))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/recrutement')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditMode ? 'Modifier l\'offre d\'emploi' : 'Nouvelle offre d\'emploi'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Modifiez les informations de l\'offre' : 'Créez une nouvelle offre d\'emploi'}
          </p>
          {isEditMode && offreData && (
            <p className="text-sm text-gray-500 mt-1">
              Lien de publication : <a href={offreData.lienOffre} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{offreData.lienOffre}</a>
            </p>
          )}
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Libellé de l'offre *
          </label>
          <input
            {...form.register('libelleOffre')}
            className="input-field"
            placeholder="Ex: Développeur Full Stack"
          />
          {form.formState.errors.libelleOffre && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.libelleOffre.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'offre *
            </label>
            <select {...form.register('typeOffre')} className="input-field">
              <option value="">Sélectionner</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
            </select>
            {form.formState.errors.typeOffre && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.typeOffre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domaine d'activité *
            </label>
            <select {...form.register('domaineActivite')} className="input-field">
              <option value="">Sélectionner</option>
              {domaines?.map((d: any) => (
                <option key={d.id} value={d.libelle}>{d.libelle}</option>
              ))}
            </select>
            {form.formState.errors.domaineActivite && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.domaineActivite.message}</p>
            )}
          </div>
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
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{comp}</span>
                  <button
                    type="button"
                    onClick={() => removeCompetence(comp)}
                    className="hover:text-primary-900 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {form.formState.errors.competences && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.competences.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau d'étude *
          </label>
          <select {...form.register('niveauEtude')} className="input-field">
            <option value="">Sélectionner</option>
            {niveauxEtude?.map((n: any) => (
              <option key={n.id} value={n.libelle}>{n.libelle}</option>
            ))}
          </select>
          {form.formState.errors.niveauEtude && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.niveauEtude.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'effet *
            </label>
            <input
              {...form.register('dateEffet')}
              type="date"
              className="input-field"
            />
            {form.formState.errors.dateEffet && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.dateEffet.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'expiration *
            </label>
            <input
              {...form.register('dateExpiration')}
              type="date"
              className="input-field"
            />
            {form.formState.errors.dateExpiration && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.dateExpiration.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/recrutement')}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center space-x-2" disabled={mutation.isPending}>
            <Save size={20} />
            <span>{mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

