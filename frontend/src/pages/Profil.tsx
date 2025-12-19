import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import api from '../api'
import { User, Mail, Shield } from 'lucide-react'

export default function Profil() {
  const { user } = useAuth()

  const { data: profilData } = useQuery({
    queryKey: ['profil', user?.id],
    queryFn: async () => {
      const response = await api.get('/api/auth/me')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mon profil</h1>
        <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <User size={24} />
              <span>Informations personnelles</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={user?.nom || ''}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  value={user?.prenom || ''}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Mail size={16} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Shield size={24} />
              <span>Informations de compte</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profil</label>
                <input
                  type="text"
                  value={
                    user?.profil === 'administrateur' ? 'Administrateur' :
                    user?.profil === 'compte_rh' ? 'Compte RH' :
                    'Compte Salarié'
                  }
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <User size={48} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {user?.prenom} {user?.nom}
              </h3>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

