import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { Plus, Upload, Eye, FileText, UserCheck, Download } from 'lucide-react'

export default function SalariesList() {
  const navigate = useNavigate()
  const { data: salaries, isLoading } = useQuery({
    queryKey: ['salaries'],
    queryFn: async () => {
      const response = await api.get('/api/gestion-admin/salaries')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Salariés</h1>
          <p className="text-gray-600 mt-2">Gestion des salariés</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/gestion-admin/charger')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>Charger depuis Excel</span>
          </button>
          <button
            onClick={() => navigate('/gestion-admin/nouveau')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Nouveau salarié</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold text-gray-700">Matricule</th>
                <th className="text-left p-4 font-semibold text-gray-700">Nom</th>
                <th className="text-left p-4 font-semibold text-gray-700">Prénom</th>
                <th className="text-left p-4 font-semibold text-gray-700">Fonction</th>
                <th className="text-left p-4 font-semibold text-gray-700">Poste</th>
                <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries?.map((salarie: any) => (
                <tr key={salarie.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{salarie.matricule}</td>
                  <td className="p-4">{salarie.nom}</td>
                  <td className="p-4">{salarie.prenom}</td>
                  <td className="p-4">{salarie.fonction}</td>
                  <td className="p-4">{salarie.poste}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      salarie.statut === 'actif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {salarie.statut}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/gestion-admin/dossier/${salarie.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Voir le dossier"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => navigate(`/gestion-admin/affectation/${salarie.id}`)}
                        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                        title="Affectation"
                      >
                        <UserCheck size={20} />
                      </button>
                      <button
                        onClick={() => navigate(`/gestion-admin/fiche-poste/${salarie.id}`)}
                        className="p-2 hover:bg-green-100 rounded-lg text-green-600"
                        title="Générer fiche de poste"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

