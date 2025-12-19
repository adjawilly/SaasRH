// Données mockées pour la gestion des utilisateurs

export interface MockUtilisateur {
  id: string
  email: string
  nom: string
  prenom: string
  profil: 'administrateur' | 'compte_rh' | 'compte_salarie'
  fonction?: string
  actif: boolean
  createdAt: string
  updatedAt: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Liste des RH (pour les admin)
export const mockRH: MockUtilisateur[] = [
  {
    id: 'rh1',
    email: 'rh1@saansrh.com',
    nom: 'Dubois',
    prenom: 'Sophie',
    profil: 'compte_rh',
    fonction: 'Responsable RH',
    actif: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'rh2',
    email: 'rh2@saansrh.com',
    nom: 'Martin',
    prenom: 'Pierre',
    profil: 'compte_rh',
    fonction: 'Manager RH',
    actif: true,
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-02-20T00:00:00Z',
  },
  {
    id: 'rh3',
    email: 'rh3@saansrh.com',
    nom: 'Bernard',
    prenom: 'Marie',
    profil: 'compte_rh',
    fonction: 'Chargée de recrutement',
    actif: false,
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-05-15T00:00:00Z',
  },
]

// Liste des salariés (pour les RH)
export const mockSalariesUtilisateurs: MockUtilisateur[] = [
  {
    id: 'sal1',
    email: 'jean.martin@saansrh.com',
    nom: 'Martin',
    prenom: 'Jean',
    profil: 'compte_salarie',
    fonction: 'Développeur',
    actif: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 'sal2',
    email: 'marie.dubois@saansrh.com',
    nom: 'Dubois',
    prenom: 'Marie',
    profil: 'compte_salarie',
    fonction: 'Chef de projet',
    actif: true,
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2023-03-20T00:00:00Z',
  },
  {
    id: 'sal3',
    email: 'pierre.bernard@saansrh.com',
    nom: 'Bernard',
    prenom: 'Pierre',
    profil: 'compte_salarie',
    fonction: 'Manager',
    actif: true,
    createdAt: '2022-06-10T00:00:00Z',
    updatedAt: '2022-06-10T00:00:00Z',
  },
  {
    id: 'sal4',
    email: 'luc.durand@saansrh.com',
    nom: 'Durand',
    prenom: 'Luc',
    profil: 'compte_salarie',
    fonction: 'Designer',
    actif: false,
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z',
  },
  {
    id: 'sal5',
    email: 'sophie.moreau@saansrh.com',
    nom: 'Moreau',
    prenom: 'Sophie',
    profil: 'compte_salarie',
    fonction: 'Marketing',
    actif: false,
    createdAt: '2023-05-12T00:00:00Z',
    updatedAt: '2023-07-01T00:00:00Z',
  },
]

export const mockGestionUtilisateurs = {
  getRH: async () => {
    await delay(400)
    return mockRH
  },

  getSalaries: async () => {
    await delay(400)
    // Retourner uniquement les salariés qui ne sont pas RH
    return mockSalariesUtilisateurs.filter(s => s.profil === 'compte_salarie')
  },

  updateRH: async (id: string, data: Partial<MockUtilisateur>) => {
    await delay(400)
    const index = mockRH.findIndex(rh => rh.id === id)
    if (index === -1) throw new Error('Utilisateur RH non trouvé')
    mockRH[index] = {
      ...mockRH[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return mockRH[index]
  },

  updateSalarie: async (id: string, data: Partial<MockUtilisateur>) => {
    await delay(400)
    const index = mockSalariesUtilisateurs.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Salarié non trouvé')
    mockSalariesUtilisateurs[index] = {
      ...mockSalariesUtilisateurs[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return mockSalariesUtilisateurs[index]
  },
}

