import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  titre: string
  message: string
  date: string
  lu: boolean
}

export default function Notifications() {
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      // TODO: Implémenter l'API réelle
      // Pour l'instant, retourner des données mock
      return [
        {
          id: '1',
          type: 'success',
          titre: 'Candidature approuvée',
          message: 'Votre candidature pour le poste de Développeur Full Stack a été approuvée.',
          date: new Date().toISOString(),
          lu: false,
        },
        {
          id: '2',
          type: 'info',
          titre: 'Nouvelle demande',
          message: 'Une nouvelle demande de congé nécessite votre attention.',
          date: new Date(Date.now() - 86400000).toISOString(),
          lu: true,
        },
      ]
    },
  })

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />
      case 'error':
        return <XCircle className="text-red-500" size={20} />
      default:
        return <Info className="text-blue-500" size={20} />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
          <Bell size={32} />
          <span>Mes notifications</span>
        </h1>
        <p className="text-gray-600 mt-2">Consultez toutes vos notifications</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card ${!notification.lu ? 'border-l-4 border-l-primary-500' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{notification.titre}</h3>
                    <span className="text-xs text-gray-500">
                      {format(new Date(notification.date), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <p className="text-gray-600">{notification.message}</p>
                </div>
                {!notification.lu && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                    Nouveau
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Bell className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Aucune notification pour le moment</p>
        </div>
      )}
    </div>
  )
}

