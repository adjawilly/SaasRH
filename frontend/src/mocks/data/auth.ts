// Données mockées pour l'authentification

export interface MockUser {
  id: string
  email: string
  nom?: string
  prenom?: string
  profil: 'administrateur' | 'compte_rh' | 'compte_salarie'
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@saansrh.com',
    nom: 'Admin',
    prenom: 'Super',
    profil: 'administrateur',
  },
  {
    id: '2',
    email: 'rh@saansrh.com',
    nom: 'RH',
    prenom: 'Manager',
    profil: 'compte_rh',
  },
  {
    id: '3',
    email: 'salarie@saansrh.com',
    nom: 'Dupont',
    prenom: 'Jean',
    profil: 'compte_salarie',
  },
]

// Simule un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAuth = {
  login: async (email: string, password: string) => {
    await delay(500)
    const user = mockUsers.find(u => u.email === email)
    if (!user || password !== 'password123') {
      throw new Error('Identifiants invalides')
    }
    const token = `mock_token_${user.id}_${Date.now()}`
    return { token, user }
  },

  register: async (data: { email: string; password: string; nom: string; prenom: string }) => {
    await delay(500)
    const existingUser = mockUsers.find(u => u.email === data.email)
    if (existingUser) {
      throw new Error('Email déjà utilisé')
    }
    const newUser: MockUser = {
      id: String(mockUsers.length + 1),
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      profil: 'compte_salarie',
    }
    mockUsers.push(newUser)
    const token = `mock_token_${newUser.id}_${Date.now()}`
    return { token, user: newUser }
  },

  loginWithGoogle: async (token: string) => {
    await delay(500)
    // Simule une connexion Google réussie
    const user: MockUser = {
      id: 'google_user_1',
      email: 'google.user@gmail.com',
      nom: 'Google',
      prenom: 'User',
      profil: 'compte_salarie',
    }
    const authToken = `mock_token_google_${Date.now()}`
    return { token: authToken, user }
  },

  getMe: async (token: string) => {
    await delay(300)
    // Extrait l'ID utilisateur du token mock
    const userId = token.split('_')[2]
    const user = mockUsers.find(u => u.id === userId)
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }
    return user
  },

  forgotPassword: async (email: string) => {
    await delay(500)
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      throw new Error('Email non trouvé')
    }
    return { message: 'Email de réinitialisation envoyé' }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    await delay(500)
    // Simule la vérification du mot de passe actuel
    if (currentPassword !== 'password123') {
      throw new Error('Mot de passe actuel incorrect')
    }
    if (newPassword.length < 6) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères')
    }
    return { message: 'Mot de passe modifié avec succès' }
  },
}

