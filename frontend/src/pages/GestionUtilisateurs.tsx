import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { Users, UserCheck, UserX, Mail, Shield, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

export default function GestionUtilisateurs() {
  const { user } = useAuth()
  const notification = useNotification()
  const queryClient = useQueryClient()
  const isAdmin = user?.profil === 'administrateur'

  const { data: utilisateurs, isLoading } = useQuery({
    queryKey: ['gestion-utilisateurs', isAdmin ? 'rh' : 'salaries'],
    queryFn: async () => {
      const endpoint = isAdmin ? '/api/gestion-utilisateurs/rh' : '/api/gestion-utilisateurs/salaries'
      const response = await (api as any).get(endpoint)
      return response.data
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, actif }: { id: string; actif: boolean }) => {
      const endpoint = isAdmin ? '/api/gestion-utilisateurs/rh' : '/api/gestion-utilisateurs/salaries'
      const response = await (api as any).put(`${endpoint}/${id}`, { actif })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gestion-utilisateurs'] })
      notification.success(
        variables.actif ? 'Compte activé' : 'Compte désactivé',
        variables.actif 
          ? 'Le compte a été activé avec succès'
          : 'Le compte a été désactivé avec succès'
      )
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la mise à jour du compte')
    },
  })

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id, actif: !currentStatus })
  }

  const utilisateursActifs = utilisateurs?.filter((u: any) => u.actif) || []
  const utilisateursInactifs = utilisateurs?.filter((u: any) => !u.actif) || []

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 
          className="text-xl md:text-2xl font-bold flex items-center space-x-2"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          <Users size={22} style={{ color: '#2F5FD7' }} />
          <span>Gestion des utilisateurs</span>
        </h1>
        <p className="text-xs md:text-sm text-gray-600 mt-1">
          {isAdmin 
            ? 'Gérez les comptes des responsables RH' 
            : 'Gérez les comptes des salariés'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-2 border-green-200 bg-green-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-100">
              <UserCheck className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{utilisateursActifs.length}</p>
              <p className="text-xs text-gray-600">Comptes actifs</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-red-200 bg-red-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-red-100">
              <UserX className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{utilisateursInactifs.length}</p>
              <p className="text-xs text-gray-600">Comptes désactivés</p>
            </div>
          </div>
        </div>
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#EBF4FF' }}>
              <Users size={24} style={{ color: '#2F5FD7' }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{utilisateurs?.length || 0}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fonction
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {utilisateurs && utilisateurs.length > 0 ? (
                  utilisateurs.map((utilisateur: any) => (
                    <tr 
                      key={utilisateur.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        !utilisateur.actif ? 'opacity-60' : ''
                      }`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            isAdmin ? 'bg-purple-100' : 'bg-blue-100'
                          } ${!utilisateur.actif ? 'opacity-50' : ''}`}>
                            {isAdmin ? (
                              <Shield className={isAdmin ? 'text-purple-600' : 'text-blue-600'} size={18} />
                            ) : (
                              <User className="text-blue-600" size={18} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {utilisateur.prenom} {utilisateur.nom}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{utilisateur.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {utilisateur.fonction || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          utilisateur.actif
                            ? 'bg-green-100 text-green-800 border-2 border-green-200'
                            : 'bg-red-100 text-red-800 border-2 border-red-200'
                        }`}>
                          {utilisateur.actif ? (
                            <>
                              <UserCheck size={12} className="mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <UserX size={12} className="mr-1" />
                              Désactivé
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleToggleStatus(utilisateur.id, utilisateur.actif)}
                          className={`px-3 py-1.5 rounded-lg font-medium text-sm flex items-center space-x-1.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                            utilisateur.actif
                              ? 'bg-red-100 hover:bg-red-200 text-red-700'
                              : 'bg-green-100 hover:bg-green-200 text-green-700'
                          }`}
                          disabled={toggleStatusMutation.isPending}
                        >
                          {utilisateur.actif ? (
                            <>
                              <UserX size={14} />
                              <span>Désactiver</span>
                            </>
                          ) : (
                            <>
                              <UserCheck size={14} />
                              <span>Activer</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <Users size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun utilisateur disponible</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

