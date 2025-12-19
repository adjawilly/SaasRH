import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../../contexts/AuthContext'
import { useNotification } from '../../../contexts/NotificationContext'
import { Mail, Lock, User } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

const registerSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

interface LoginFormLeftProps {
  onShowForgotPassword: () => void
}

export default function LoginFormLeft({ onShowForgotPassword }: LoginFormLeftProps) {
  const [isLogin, setIsLogin] = useState(true)
  const { login, register } = useAuth()
  const notification = useNotification()
  const navigate = useNavigate()

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onLoginSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password)
      notification.success('Connexion réussie', 'Vous êtes maintenant connecté')
      navigate('/dashboard')
    } catch (error: any) {
      notification.error('Erreur de connexion', error.response?.data?.message || error.message || 'Identifiants invalides')
    }
  }

  const onRegisterSubmit = async (data: RegisterForm) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        nom: data.nom,
        prenom: data.prenom,
      })
      notification.success('Inscription réussie', 'Votre compte a été créé avec succès')
      navigate('/dashboard')
    } catch (error: any) {
      notification.error('Erreur d\'inscription', error.response?.data?.message || error.message || 'Une erreur est survenue')
    }
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/api/auth/google'
  }

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-4 lg:p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="SaansRH Logo" 
              className="h-20 w-auto object-contain rounded-xl"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">SaansRH</h1>
          <p className="text-gray-600">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...loginForm.register('email')}
                  type="email"
                  className="input-field pl-10"
                  placeholder="votre@email.com"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...loginForm.register('password')}
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onShowForgotPassword}
              className="text-sm text-right w-full font-medium link-blue"
            >
              Mot de passe oublié ?
            </button>

            <button 
              type="submit" 
              className="w-full text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
            >
              Se connecter
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <p className="text-center text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="font-semibold link-blue"
              >
                S'inscrire
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...registerForm.register('nom')}
                    type="text"
                    className="input-field pl-10"
                    placeholder="Nom"
                  />
                </div>
                {registerForm.formState.errors.nom && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.nom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    {...registerForm.register('prenom')}
                    type="text"
                    className="input-field pl-10"
                    placeholder="Prénom"
                  />
                </div>
                {registerForm.formState.errors.prenom && (
                  <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.prenom.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...registerForm.register('email')}
                  type="email"
                  className="input-field pl-10"
                  placeholder="votre@email.com"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...registerForm.register('password')}
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {registerForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  {...registerForm.register('confirmPassword')}
                  type="password"
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
            >
              S'inscrire
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="font-semibold link-blue"
              >
                Se connecter
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
