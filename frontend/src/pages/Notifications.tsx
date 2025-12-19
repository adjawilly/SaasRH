import { useState } from 'react'
import { Bell, Check, X, AlertCircle, Info, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  date: string
  read: boolean
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nouvelle candidature reçue',
      message: 'Une nouvelle candidature a été soumise pour le poste de Développeur Full Stack',
      type: 'info',
      date: 'Il y a 2 heures',
      read: false,
    },
    {
      id: '2',
      title: 'Formation terminée',
      message: 'La formation "Gestion du temps" a été complétée avec succès',
      type: 'success',
      date: 'Il y a 5 heures',
      read: false,
    },
    {
      id: '3',
      title: 'Demande de congé en attente',
      message: 'Une demande de congé nécessite votre validation',
      type: 'warning',
      date: 'Il y a 1 jour',
      read: true,
    },
    {
      id: '4',
      title: 'Évaluation programmée',
      message: 'L\'évaluation trimestrielle de Jean Dupont est programmée pour le 15 mars',
      type: 'info',
      date: 'Il y a 2 jours',
      read: true,
    },
    {
      id: '5',
      title: 'Document expiré',
      message: 'Le contrat de Marie Martin expire dans 30 jours',
      type: 'error',
      date: 'Il y a 3 jours',
      read: true,
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-green-500" />
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />
      default:
        return <Info size={20} className="text-blue-500" />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50'
      case 'warning':
        return 'bg-yellow-50'
      case 'error':
        return 'bg-red-50'
      default:
        return 'bg-blue-50'
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200'
      case 'warning':
        return 'border-yellow-200'
      case 'error':
        return 'border-red-200'
      default:
        return 'border-blue-200'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 
              ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Toutes vos notifications sont lues'
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
            >
              <Check size={18} />
              <span>Tout marquer comme lu</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 border border-gray-100 text-center">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucune notification</h3>
            <p className="text-gray-500">Vous n'avez aucune notification pour le moment</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 ${
                notification.read ? 'border-gray-100 opacity-75' : getBorderColor(notification.type)
              } ${getBgColor(notification.type)}`}
            >
              <div className="p-5">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    notification.read ? 'bg-gray-100' : 'bg-white'
                  }`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-lg font-semibold ${
                            notification.read ? 'text-gray-600' : 'text-gray-800'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                        <p className={`text-sm mb-2 ${
                          notification.read ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock size={14} />
                          <span>{notification.date}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                            title="Marquer comme lu"
                          >
                            <Check size={18} className="text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-white/80 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <X size={18} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
