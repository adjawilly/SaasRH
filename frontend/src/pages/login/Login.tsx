import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import LoginFormLeft from './_UI/LoginFormLeft'
import LoginFormRight from './_UI/LoginFormRight'

export default function Login() {
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const { forgotPassword } = useAuth()
  const notification = useNotification()

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(forgotEmail)
      notification.success('Email envoyé', 'Un email de réinitialisation a été envoyé')
      setShowForgotPassword(false)
      setForgotEmail('')
    } catch (error: any) {
      notification.error('Erreur', error.response?.data?.message || error.message || 'Erreur lors de l\'envoi de l\'email')
    }
  }

  if (showForgotPassword) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mot de passe oublié</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="input-field"
                placeholder="votre@email.com"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 bg-white px-6 py-2 rounded-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: '#2F5FD7',
                  color: '#2F5FD7'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleForgotPassword}
                className="flex-1 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                }}
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <LoginFormLeft onShowForgotPassword={() => setShowForgotPassword(true)} />
      <LoginFormRight />
    </div>
  )
}
