import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../../../api'
import { Plus, Upload, Eye, FileText, UserCheck, Download, Users } from 'lucide-react'

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
            <Users size={28} style={{ color: '#2F5FD7' }} />
            <span>Salariés</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Gestion des salariés</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/gestion-admin/charger')}
            className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm md:text-base font-medium"
            style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
          >
            <Upload size={18} />
            <span>Charger depuis Excel</span>
          </button>
          <button
            onClick={() => navigate('/gestion-admin/nouveau')}
            className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 text-sm md:text-base"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
            }}
          >
            <Plus size={18} />
            <span>Nouveau salarié</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="card border-2 border-blue-200 bg-blue-50/30 overflow-x-auto">
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
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        style={{ color: '#2F5FD7' }}
                        title="Voir le dossier"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/gestion-admin/affectation/${salarie.id}`)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        style={{ color: '#2F5FD7' }}
                        title="Affectation"
                      >
                        <UserCheck size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/gestion-admin/fiche-poste/${salarie.id}`)}
                        className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                        title="Générer fiche de poste"
                      >
                        <Download size={18} />
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

