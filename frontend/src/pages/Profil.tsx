import { useAuth } from '../contexts/AuthContext'
import { User, Mail, Shield, Edit2, Calendar, Briefcase, Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import api from '../api'
import { useNotification } from '../contexts/NotificationContext'

export default function Profil() {
  const { user } = useAuth()
  const notification = useNotification()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  })

  const passwordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await (api as any).put('/api/auth/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      return response.data
    },
    onSuccess: () => {
      notification.success('Mot de passe modifié', 'Votre mot de passe a été modifié avec succès')
      form.reset()
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la modification du mot de passe')
    },
  })

  const onSubmit = (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      notification.warning('Erreur de confirmation', 'Les mots de passe ne correspondent pas')
      return
    }
    if (data.newPassword.length < 6) {
      notification.warning('Mot de passe trop court', 'Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    passwordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  const getProfilBadge = (profil: string) => {
    const badges = {
      administrateur: {
        label: 'Administrateur',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Shield
      },
      compte_rh: {
        label: 'Compte RH',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Briefcase
      },
      compte_salarie: {
        label: 'Compte Salarié',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: User
      }
    }
    return badges[profil as keyof typeof badges] || badges.compte_salarie
  }

  const profilInfo = user?.profil ? getProfilBadge(user.profil) : getProfilBadge('compte_salarie')
  const ProfilIcon = profilInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 
            className="text-3xl font-bold flex items-center space-x-2"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <User size={32} style={{ color: '#2F5FD7' }} />
            <span>Mon profil</span>
          </h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles</p>
        </div>
        <button
          className="mt-4 md:mt-0 px-6 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
          }}
        >
          <Edit2 size={18} />
          <span>Modifier le profil</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-white border-2" style={{
                  borderColor: '#2F5FD7'
                }}>
                  <User size={20} style={{ color: '#2F5FD7' }} />
                </div>
                <span>Informations personnelles</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <User size={14} />
                  <span>Nom</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user?.nom || 'Non renseigné'}
                    disabled
                    className="input-field bg-white border-gray-200 text-gray-800 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <User size={14} />
                  <span>Prénom</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={user?.prenom || 'Non renseigné'}
                    disabled
                    className="input-field bg-white border-gray-200 text-gray-800 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Mail size={14} />
                  <span>Email</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={user?.email || 'Non renseigné'}
                    disabled
                    className="input-field bg-white border-gray-200 text-gray-800 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informations de compte */}
          <div className="card border-2 border-purple-200 bg-purple-50/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-white border-2" style={{
                  borderColor: '#2F5FD7'
                }}>
                  <Shield size={20} style={{ color: '#2F5FD7' }} />
                </div>
                <span>Informations de compte</span>
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Shield size={14} />
                  <span>Type de profil</span>
                </label>
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-2 rounded-lg border-2 font-semibold flex items-center space-x-2 ${profilInfo.color}`}>
                    <ProfilIcon size={16} />
                    <span>{profilInfo.label}</span>
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                  <Calendar size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Membre depuis</p>
                    <p className="text-sm font-semibold text-gray-800">Janvier 2024</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                  <Shield size={20} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Statut</p>
                    <p className="text-sm font-semibold text-green-600">Actif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modification du mot de passe */}
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-white border-2" style={{
                  borderColor: '#2F5FD7'
                }}>
                  <Lock size={20} style={{ color: '#2F5FD7' }} />
                </div>
                <span>Modification du mot de passe</span>
              </h2>
            </div>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Lock size={14} />
                  <span>Mot de passe actuel *</span>
                </label>
                <div className="relative">
                  <input
                    {...form.register('currentPassword', { required: true })}
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    placeholder="Entrez votre mot de passe actuel"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Lock size={14} />
                  <span>Nouveau mot de passe *</span>
                </label>
                <div className="relative">
                  <input
                    {...form.register('newPassword', { required: true, minLength: 6 })}
                    type={showNewPassword ? 'text' : 'password'}
                    className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    placeholder="Entrez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Le mot de passe doit contenir au moins 6 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-1">
                  <Lock size={14} />
                  <span>Confirmer le nouveau mot de passe *</span>
                </label>
                <div className="relative">
                  <input
                    {...form.register('confirmPassword', { required: true })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    placeholder="Confirmez votre nouveau mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center space-x-2"
                  style={{
                    background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                  }}
                  disabled={passwordMutation.isPending}
                >
                  <Lock size={18} />
                  <span>{passwordMutation.isPending ? 'Modification...' : 'Modifier le mot de passe'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Carte avatar */}
          <div className="card border-2" style={{ borderColor: '#2F5FD7' }}>
            <div className="flex flex-col items-center py-6">
              <div 
                className="w-32 h-32 rounded-full flex items-center justify-center mb-4 shadow-lg bg-white border-4"
                style={{
                  borderColor: '#2F5FD7'
                }}
              >
                <User size={64} style={{ color: '#2F5FD7' }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {user?.prenom || ''} {user?.nom || ''}
              </h3>
              <p className="text-gray-600 mb-4 flex items-center space-x-1">
                <Mail size={14} />
                <span>{user?.email}</span>
              </p>
              <span className={`px-4 py-2 rounded-lg border-2 font-semibold flex items-center space-x-2 ${profilInfo.color}`}>
                <ProfilIcon size={16} />
                <span>{profilInfo.label}</span>
              </span>
            </div>
          </div>

          {/* Statistiques rapides */}
          <div className="card border-2 border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Activité ce mois</span>
                <span className="text-sm font-semibold text-gray-800">24 actions</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Dernière connexion</span>
                <span className="text-sm font-semibold text-gray-800">Aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm text-gray-600">Notifications</span>
                <span className="text-sm font-semibold text-gray-800">3 non lues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

