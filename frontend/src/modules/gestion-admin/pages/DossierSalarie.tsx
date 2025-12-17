import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, FileText, User, Briefcase, Calendar } from 'lucide-react'

export default function DossierSalarie() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: salarie, isLoading } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await axios.get(`/api/gestion-admin/salaries/${id}/dossier`)
      return response.data
    },
  })

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/gestion-admin')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dossier salarié</h1>
          <p className="text-gray-600 mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <User size={24} />
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

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Briefcase size={24} />
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

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Calendar size={24} />
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

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <FileText size={24} />
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
              className="mt-4 btn-primary w-full"
            >
              Gérer les documents
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

