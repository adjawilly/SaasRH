import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
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
      const response = await (api as any).get('/api/recrutement/offres')
      return response.data
    },
  })

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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 
            className="text-2xl md:text-3xl font-bold flex items-center space-x-2"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <Briefcase size={28} style={{ color: '#2F5FD7' }} />
            <span>Offres d'emploi</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Gérez vos offres d'emploi et candidatures</p>
        </div>
        <button
          onClick={() => navigate('/recrutement/nouvelle-offre')}
          className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
          }}
        >
          <Plus size={18} />
          <span>Nouvelle offre</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : offres && offres.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {offres.map((offre) => (
            <div 
              key={offre.id} 
              className="card border-2 border-blue-200 bg-blue-50/30 hover:shadow-lg transition-all duration-200 p-3 md:p-4"
            >
              {/* Header de la carte */}
              <div className="mb-2 md:mb-3">
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 flex-1 leading-tight">
                    {offre.libelleOffre}
                  </h3>
                </div>
                <span className={`inline-block px-1.5 py-0.5 rounded border-2 text-xs font-medium ${getTypeBadgeColor(offre.typeOffre)}`}>
                  {offre.typeOffre}
                </span>
              </div>

              {/* Informations */}
              <div className="space-y-1 mb-2 md:mb-3">
                <div className="flex items-center text-xs text-gray-600">
                  <Briefcase size={12} className="mr-1 flex-shrink-0" style={{ color: '#2F5FD7' }} />
                  <span className="truncate">{offre.domaineActivite}</span>
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar size={12} className="mr-1 flex-shrink-0" style={{ color: '#2F5FD7' }} />
                  <span className="truncate">Expire le {format(new Date(offre.dateExpiration), 'dd MMM yyyy', { locale: fr })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col space-y-1.5">
                <div className="flex space-x-1.5">
                  <button
                    onClick={() => navigate(`/recrutement/modifier-offre/${offre.id}`)}
                    className="flex-1 px-1.5 py-1 rounded border-2 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1 text-xs font-medium"
                    style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
                  >
                    <Edit size={12} />
                    <span>Modifier</span>
                  </button>
                  <button
                    onClick={() => navigate(`/recrutement/candidatures?offre=${offre.id}`)}
                    className="flex-1 px-1.5 py-1 rounded font-semibold text-white shadow-sm hover:shadow transition-all duration-200 text-xs"
                    style={{
                      background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                    }}
                  >
                    Candidatures
                  </button>
                </div>
                <a
                  href={offre.lienOffre}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-1.5 py-1 rounded border-2 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center space-x-1 text-xs font-medium"
                  style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
                >
                  <ExternalLink size={12} />
                  <span className="truncate">Voir le lien</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-8">
          <Briefcase size={40} className="mx-auto text-gray-400 mb-3" />
          <p className="text-sm text-gray-600">Aucune offre d'emploi pour le moment</p>
        </div>
      )}
    </div>
  )
}

