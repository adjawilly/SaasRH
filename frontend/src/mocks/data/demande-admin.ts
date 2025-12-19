// Données mockées pour le module demande administrative

export interface MockDemande {
  id: string
  type: 'absence' | 'conge' | 'attestation'
  dateDebut: string
  dateFin: string
  motif?: string
  motifRejet?: string
  statut: 'en_attente' | 'approuve' | 'rejete'
  salarieId: string
  salarieNom?: string
  salariePrenom?: string
  createdAt: string
  updatedAt: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockDemandes: MockDemande[] = [
  {
    id: '1',
    type: 'conge',
    dateDebut: '2024-02-15T00:00:00Z',
    dateFin: '2024-02-20T00:00:00Z',
    motif: 'Vacances',
    statut: 'en_attente',
    salarieId: '1',
    salarieNom: 'Martin',
    salariePrenom: 'Pierre',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    type: 'absence',
    dateDebut: '2024-02-10T00:00:00Z',
    dateFin: '2024-02-10T00:00:00Z',
    motif: 'Maladie',
    statut: 'approuve',
    salarieId: '2',
    salarieNom: 'Dubois',
    salariePrenom: 'Marie',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '3',
    type: 'attestation',
    dateDebut: '2024-01-01T00:00:00Z',
    dateFin: '2024-01-01T00:00:00Z',
    statut: 'approuve',
    salarieId: '1',
    salarieNom: 'Martin',
    salariePrenom: 'Pierre',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
  },
  {
    id: '4',
    type: 'absence',
    dateDebut: '2024-02-25T00:00:00Z',
    dateFin: '2024-02-25T00:00:00Z',
    motif: 'Rendez-vous médical',
    statut: 'en_attente',
    salarieId: '3',
    salarieNom: 'Bernard',
    salariePrenom: 'Luc',
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
  {
    id: '5',
    type: 'conge',
    dateDebut: '2024-03-01T00:00:00Z',
    dateFin: '2024-03-05T00:00:00Z',
    motif: 'Congé annuel',
    statut: 'rejete',
    motifRejet: 'Pas assez de jours de congé restants',
    salarieId: '2',
    salarieNom: 'Dubois',
    salariePrenom: 'Marie',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
  },
]

export const mockDemandeAdmin = {
  getDemandes: async () => {
    await delay(400)
    // Calculer les statistiques
    const enAttente = mockDemandes.filter(d => d.statut === 'en_attente').length
    const approuvees = mockDemandes.filter(d => d.statut === 'approuve').length
    const total = mockDemandes.length
    
    return {
      enAttente,
      approuvees,
      total,
      liste: mockDemandes.map(d => ({
        ...d,
        typeConge: d.type === 'conge' ? 'annuel' : undefined,
      })),
    }
  },

  getDemande: async (id: string) => {
    await delay(300)
    const demande = mockDemandes.find(d => d.id === id)
    if (!demande) throw new Error('Demande non trouvée')
    return demande
  },

  createDemande: async (data: Partial<MockDemande> & { type?: string }) => {
    await delay(500)
    const newDemande: MockDemande = {
      id: String(mockDemandes.length + 1),
      type: (data.type as 'absence' | 'conge' | 'attestation') || 'absence',
      dateDebut: data.dateDebut!,
      dateFin: data.dateFin!,
      motif: data.motif,
      statut: 'en_attente',
      salarieId: data.salarieId || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockDemandes.push(newDemande)
    return newDemande
  },

  updateDemande: async (id: string, data: Partial<MockDemande>) => {
    await delay(400)
    const index = mockDemandes.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Demande non trouvée')
    mockDemandes[index] = { 
      ...mockDemandes[index], 
      ...data, 
      motifRejet: data.motifRejet || mockDemandes[index].motifRejet,
      updatedAt: new Date().toISOString() 
    }
    return mockDemandes[index]
  },

  getSoldeConge: async (salarieId?: string) => {
    await delay(300)
    return {
      acquis: 25,
      pris: 10,
      restant: 15,
    }
  },
}

