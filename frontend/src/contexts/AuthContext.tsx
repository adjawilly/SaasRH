import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'
import { toast } from 'react-toastify'

interface User {
  id: string
  email: string
  nom?: string
  prenom?: string
  profil: 'administrateur' | 'compte_rh' | 'compte_salarie'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (token: string) => Promise<void>
  register: (data: { email: string; password: string; nom: string; prenom: string }) => Promise<void>
  logout: () => void
  forgotPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      if (api.defaults && api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/auth/me')
      setUser(response.data)
    } catch (error: any) {
      localStorage.removeItem('token')
      if (api.defaults && api.defaults.headers) {
        delete api.defaults.headers.common['Authorization']
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      if (api.defaults && api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      setUser(user)
      toast.success('Connexion réussie')
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erreur de connexion')
      throw error
    }
  }

  const loginWithGoogle = async (token: string) => {
    try {
      const response = await api.post('/api/auth/google', { token })
      const { token: authToken, user } = response.data
      localStorage.setItem('token', authToken)
      if (api.defaults && api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
      }
      setUser(user)
      toast.success('Connexion réussie')
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erreur de connexion Google')
      throw error
    }
  }

  const register = async (data: { email: string; password: string; nom: string; prenom: string }) => {
    try {
      const response = await api.post('/api/auth/register', data)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      if (api.defaults && api.defaults.headers) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      setUser(user)
      toast.success('Inscription réussie')
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erreur d\'inscription')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    if (api.defaults && api.defaults.headers) {
      delete api.defaults.headers.common['Authorization']
    }
    setUser(null)
    toast.info('Déconnexion réussie')
  }

  const forgotPassword = async (email: string) => {
    try {
      await api.post('/api/auth/forgot-password', { email })
      toast.success('Email de réinitialisation envoyé')
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Erreur lors de l\'envoi de l\'email')
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

