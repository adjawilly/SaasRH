import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, FileText, User, Briefcase, Calendar, FolderOpen } from 'lucide-react'

export default function DossierSalarie() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: salarie, isLoading } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/gestion-admin/salaries/${id}/dossier`)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/gestion-admin')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          style={{ color: '#2F5FD7' }}
        >
          <ArrowLeft size={20} />
        </button>
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
            <FolderOpen size={28} style={{ color: '#2F5FD7' }} />
            <span>Dossier salarié</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <User size={24} style={{ color: '#2F5FD7' }} />
              <span>Informations personnelles</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Matricule</p>
                <p className="font-medium">{salarie?.matricule}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-medium">{salarie?.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prénom</p>
                <p className="font-medium">{salarie?.prenom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{salarie?.email}</p>
              </div>
            </div>
          </div>

          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Briefcase size={24} style={{ color: '#2F5FD7' }} />
              <span>Informations professionnelles</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fonction</p>
                <p className="font-medium">{salarie?.fonction}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Poste</p>
                <p className="font-medium">{salarie?.poste}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Direction</p>
                <p className="font-medium">{salarie?.direction}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="font-medium">{salarie?.statut}</p>
              </div>
            </div>
          </div>

          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Calendar size={24} style={{ color: '#2F5FD7' }} />
              <span>Historique</span>
            </h2>
            <div className="space-y-2">
              {salarie?.historique?.map((item: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{item.type}</p>
                  <p className="text-sm text-gray-600">{item.date}</p>
                  <p className="text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FileText size={24} style={{ color: '#2F5FD7' }} />
              <span>Documents</span>
            </h2>
            <div className="space-y-2">
              {salarie?.documents?.map((doc: any) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <p className="font-medium">{doc.type}</p>
                  <p className="text-sm text-gray-600">{doc.nomFichier}</p>
                </a>
              ))}
            </div>
            <button
              onClick={() => navigate(`/gestion-admin/documents/${id}`)}
              className="mt-4 w-full px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
            >
              Gérer les documents
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

