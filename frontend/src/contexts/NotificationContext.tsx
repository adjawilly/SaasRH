import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react'

export interface NotificationToastData {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

interface NotificationContextType {
  showNotification: (notification: Omit<NotificationToastData, 'id'>) => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationToastData[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const showNotification = useCallback((notification: Omit<NotificationToastData, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`
    const newNotification: NotificationToastData = {
      ...notification,
      id,
    }
    setNotifications(prev => [...prev, newNotification])
  }, [])

  const success = useCallback((title: string, message: string = '', duration?: number) => {
    showNotification({ title, message, type: 'success', duration })
  }, [showNotification])

  const error = useCallback((title: string, message: string = '', duration?: number) => {
    showNotification({ title, message, type: 'error', duration })
  }, [showNotification])

  const info = useCallback((title: string, message: string = '', duration?: number) => {
    showNotification({ title, message, type: 'info', duration })
  }, [showNotification])

  const warning = useCallback((title: string, message: string = '', duration?: number) => {
    showNotification({ title, message, type: 'warning', duration })
  }, [showNotification])

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, info, warning }}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}

// Composant pour afficher les notifications
function NotificationContainer({ 
  notifications, 
  onRemove 
}: { 
  notifications: NotificationToastData[]
  onRemove: (id: string) => void 
}) {
  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast notification={notification} onClose={onRemove} />
        </div>
      ))}
    </div>
  )
}

// Import dynamique pour éviter les dépendances circulaires
function NotificationToast({ notification, onClose }: { notification: NotificationToastData, onClose: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)

  React.useEffect(() => {
    setTimeout(() => setIsVisible(true), 10)
    const duration = notification.duration || 3000
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(notification.id), 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [notification.id, notification.duration, onClose])

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

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 ${getBorderColor(notification.type)} ${getBgColor(notification.type)} transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{ minWidth: '320px', maxWidth: '420px' }}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 p-2 rounded-lg bg-white">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              {notification.title}
            </h3>
            {notification.message && (
              <p className="text-xs text-gray-600">
                {notification.message}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(() => onClose(notification.id), 300)
            }}
            className="flex-shrink-0 p-1 hover:bg-white/80 rounded-lg transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}


