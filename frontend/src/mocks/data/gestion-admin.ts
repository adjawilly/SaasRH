// Données mockées pour le module gestion administrative

export interface MockSalarie {
  id: string
  matricule: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  fonction: string
  poste?: string
  direction?: string
  dateEmbauche: string
  statut: string
  createdAt: string
  updatedAt: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockSalaries: MockSalarie[] = [
  {
    id: '1',
    matricule: 'EMP001',
    nom: 'Martin',
    prenom: 'Jean',
    email: 'jean.martin@saansrh.com',
    telephone: '+33 6 12 34 56 78',
    fonction: 'Développeur',
    poste: 'Développeur Full Stack',
    direction: 'IT',
    dateEmbauche: '2023-01-15T00:00:00Z',
    statut: 'actif',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    matricule: 'EMP002',
    nom: 'Dubois',
    prenom: 'Marie',
    email: 'marie.dubois@saansrh.com',
    telephone: '+33 6 23 45 67 89',
    fonction: 'Chef de projet',
    poste: 'Chef de Projet RH',
    direction: 'RH',
    dateEmbauche: '2023-03-20T00:00:00Z',
    statut: 'actif',
    createdAt: '2023-03-20T00:00:00Z',
    updatedAt: '2023-03-20T00:00:00Z',
  },
  {
    id: '3',
    matricule: 'EMP003',
    nom: 'Bernard',
    prenom: 'Pierre',
    email: 'pierre.bernard@saansrh.com',
    telephone: '+33 6 34 56 78 90',
    fonction: 'Manager RH',
    poste: 'Manager Ressources Humaines',
    direction: 'RH',
    dateEmbauche: '2022-06-10T00:00:00Z',
    statut: 'actif',
    createdAt: '2022-06-10T00:00:00Z',
    updatedAt: '2022-06-10T00:00:00Z',
  },
]

export const mockGestionAdmin = {
  getSalaries: async () => {
    await delay(400)
    return mockSalaries
  },

  getSalarie: async (id: string) => {
    await delay(300)
    const salarie = mockSalaries.find(s => s.id === id)
    if (!salarie) throw new Error('Salarié non trouvé')
    return salarie
  },

  createSalarie: async (data: Partial<MockSalarie>) => {
    await delay(500)
    const newSalarie: MockSalarie = {
      id: String(mockSalaries.length + 1),
      matricule: `EMP${String(mockSalaries.length + 1).padStart(3, '0')}`,
      nom: data.nom!,
      prenom: data.prenom!,
      email: data.email!,
      telephone: data.telephone,
      fonction: data.fonction!,
      poste: data.poste,
      direction: data.direction,
      dateEmbauche: data.dateEmbauche || new Date().toISOString(),
      statut: data.statut || 'actif',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockSalaries.push(newSalarie)
    return newSalarie
  },

  updateSalarie: async (id: string, data: Partial<MockSalarie>) => {
    await delay(400)
    const index = mockSalaries.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Salarié non trouvé')
    mockSalaries[index] = { ...mockSalaries[index], ...data, updatedAt: new Date().toISOString() }
    return mockSalaries[index]
  },

  deleteSalarie: async (id: string) => {
    await delay(300)
    const index = mockSalaries.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Salarié non trouvé')
    mockSalaries.splice(index, 1)
    return { message: 'Salarié supprimé' }
  },

  uploadSalaries: async (file: File) => {
    await delay(1000)
    // Simule l'upload de salariés depuis Excel
    return { message: 'Salariés chargés avec succès', count: 5 }
  },

  getDocuments: async (salarieId: string) => {
    await delay(300)
    return [
      { id: '1', type: 'CV', nomFichier: 'cv.pdf', url: '/documents/cv.pdf', createdAt: '2024-01-01T00:00:00Z' },
      { id: '2', type: 'Contrat', nomFichier: 'contrat.pdf', url: '/documents/contrat.pdf', createdAt: '2024-01-01T00:00:00Z' },
    ]
  },

  uploadDocument: async (salarieId: string, file: File) => {
    await delay(500)
    return { id: '3', type: 'Document', nomFichier: file.name, url: `/documents/${file.name}`, createdAt: new Date().toISOString() }
  },
}

