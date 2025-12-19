// Données mockées pour le module formation

export interface MockFormation {
  id: string
  libelle: string
  description: string
  dateDebut: string
  dateFin: string
  statut: 'planifie' | 'en_cours' | 'termine' | 'valide' | 'rejete' | 'en_attente_validation'
  salarieId: string
  salarieNom?: string
  salariePrenom?: string
  progression?: number
  direction?: string
  motifRejet?: string
  createdAt: string
  updatedAt: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockFormations: MockFormation[] = [
  {
    id: '1',
    libelle: 'Formation React Avancé',
    description: 'Formation approfondie sur les hooks avancés et les performances',
    dateDebut: '2024-02-01T00:00:00Z',
    dateFin: '2024-02-05T00:00:00Z',
    statut: 'en_cours',
    salarieId: '1',
    salarieNom: 'Martin',
    salariePrenom: 'Pierre',
    progression: 65,
    direction: 'Informatique',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    libelle: 'Gestion de projet Agile',
    description: 'Formation sur les méthodologies Agile et Scrum',
    dateDebut: '2024-01-20T00:00:00Z',
    dateFin: '2024-01-25T00:00:00Z',
    statut: 'valide',
    salarieId: '2',
    salarieNom: 'Dubois',
    salariePrenom: 'Marie',
    progression: 100,
    direction: 'Ressources Humaines',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    libelle: 'Formation Leadership',
    description: 'Développement des compétences en leadership et management',
    dateDebut: '2024-03-01T00:00:00Z',
    dateFin: '2024-03-05T00:00:00Z',
    statut: 'en_attente_validation',
    salarieId: '3',
    salarieNom: 'Bernard',
    salariePrenom: 'Luc',
    progression: 0,
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-01-22T00:00:00Z',
  },
  {
    id: '4',
    libelle: 'Formation Excel Avancé',
    description: 'Maîtrise des fonctions avancées d\'Excel',
    dateDebut: '2024-01-15T00:00:00Z',
    dateFin: '2024-01-18T00:00:00Z',
    statut: 'rejete',
    salarieId: '1',
    salarieNom: 'Martin',
    salariePrenom: 'Pierre',
    progression: 0,
    motifRejet: 'Formation non prioritaire pour le poste actuel',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
]

export const mockFormation = {
  getFormations: async (salarieId?: string) => {
    await delay(400)
    if (salarieId) {
      return mockFormations.filter(f => f.salarieId === salarieId)
    }
    return mockFormations
  },

  getFormation: async (id: string) => {
    await delay(300)
    const formation = mockFormations.find(f => f.id === id)
    if (!formation) throw new Error('Formation non trouvée')
    return formation
  },

  createFormation: async (data: Partial<MockFormation>) => {
    await delay(500)
    const newFormation: MockFormation = {
      id: String(mockFormations.length + 1),
      libelle: data.libelle!,
      description: data.description!,
      dateDebut: data.dateDebut!,
      dateFin: data.dateFin!,
      statut: data.statut || 'planifie',
      salarieId: data.salarieId || '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockFormations.push(newFormation)
    return newFormation
  },

  createDemandeFormation: async (data: Partial<MockFormation>) => {
    await delay(500)
    const newFormation: MockFormation = {
      id: String(mockFormations.length + 1),
      libelle: data.libelle!,
      description: data.description!,
      dateDebut: data.dateDebut!,
      dateFin: data.dateFin!,
      statut: 'en_attente_validation',
      salarieId: data.salarieId || '1',
      progression: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockFormations.push(newFormation)
    return newFormation
  },

  updateFormation: async (id: string, data: Partial<MockFormation>) => {
    await delay(400)
    const index = mockFormations.findIndex(f => f.id === id)
    if (index === -1) throw new Error('Formation non trouvée')
    mockFormations[index] = { 
      ...mockFormations[index], 
      ...data, 
      salarieId: data.salarieId || mockFormations[index].salarieId,
      salarieNom: data.salarieNom || mockFormations[index].salarieNom,
      salariePrenom: data.salariePrenom || mockFormations[index].salariePrenom,
      motifRejet: data.motifRejet || mockFormations[index].motifRejet,
      direction: data.direction || mockFormations[index].direction,
      updatedAt: new Date().toISOString() 
    }
    return mockFormations[index]
  },

  createEvaluationFormation: async (formationId: string, data: any) => {
    await delay(500)
    return {
      id: '1',
      formationId,
      type: data.type,
      note: data.note,
      commentaire: data.commentaire,
      createdAt: new Date().toISOString(),
    }
  },
}

