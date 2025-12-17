import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, ExternalLink, Calendar, Briefcase, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Offre {
  id: string
  libelleOffre: string
  typeOffre: 'CDD' | 'CDI' | 'Stage'
  domaineActivite: string
  competences: string[]
  niveauEtude: string
  datePublication: string
  dateEffet: string
  dateExpiration: string
  lienOffre: string
}

export default function OffresList() {
  const navigate = useNavigate()
  const { data: offres, isLoading } = useQuery<Offre[]>({
    queryKey: ['offres'],
    queryFn: async () => {
      const response = await axios.get('/api/recrutement/offres')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Offres d'emploi</h1>
          <p className="text-gray-600 mt-2">Gérez vos offres d'emploi et candidatures</p>
        </div>
        <button
          onClick={() => navigate('/recrutement/nouvelle-offre')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nouvelle offre</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offres?.map((offre) => (
            <div key={offre.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{offre.libelleOffre}</h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {offre.typeOffre}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase size={16} className="mr-2" />
                  {offre.domaineActivite}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  Expire le {format(new Date(offre.dateExpiration), 'dd MMM yyyy', { locale: fr })}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/recrutement/modifier-offre/${offre.id}`)}
                    className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-sm"
                  >
                    <Edit size={16} />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => navigate(`/recrutement/candidatures?offre=${offre.id}`)}
                    className="flex-1 btn-primary text-sm"
                  >
                    Candidatures
                  </button>
                </div>
                <a
                  href={offre.lienOffre}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-secondary flex items-center justify-center space-x-2 text-sm"
                >
                  <ExternalLink size={16} />
                  <span>Voir le lien de publication</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

