// Données mockées pour le module évaluation

export interface MockObjectif {
  id: string
  libelle: string
  description: string
  progression: number
  salarieId: string
  createdAt: string
  updatedAt: string
}

export interface MockEvaluation {
  id: string
  type: string
  note?: number
  commentaire?: string
  salarieId: string
  createdAt: string
  updatedAt: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockObjectifs: MockObjectif[] = [
  {
    id: '1',
    libelle: 'Améliorer les compétences React',
    description: 'Maîtriser les hooks avancés et les patterns de performance',
    progression: 75,
    salarieId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    libelle: 'Formation en gestion de projet',
    description: 'Suivre une formation certifiante en gestion de projet',
    progression: 50,
    salarieId: '2',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
]

export const mockEvaluations: MockEvaluation[] = [
  {
    id: '1',
    type: 'auto_evaluation',
    note: 8,
    commentaire: 'Bon travail cette année',
    salarieId: '1',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
]

export const mockEvaluation = {
  getObjectifs: async (salarieId?: string) => {
    await delay(400)
    if (salarieId) {
      return mockObjectifs.filter(o => o.salarieId === salarieId)
    }
    return mockObjectifs
  },

  createObjectif: async (data: Partial<MockObjectif>) => {
    await delay(500)
    const newObjectif: MockObjectif = {
      id: String(mockObjectifs.length + 1),
      libelle: data.libelle!,
      description: data.description!,
      progression: data.progression || 0,
      salarieId: data.salarieId!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockObjectifs.push(newObjectif)
    return newObjectif
  },

  updateObjectif: async (id: string, data: Partial<MockObjectif>) => {
    await delay(400)
    const index = mockObjectifs.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Objectif non trouvé')
    mockObjectifs[index] = { ...mockObjectifs[index], ...data, updatedAt: new Date().toISOString() }
    return mockObjectifs[index]
  },

  deleteObjectif: async (id: string) => {
    await delay(300)
    const index = mockObjectifs.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Objectif non trouvé')
    mockObjectifs.splice(index, 1)
    return { message: 'Objectif supprimé' }
  },

  getEvaluations: async (salarieId?: string) => {
    await delay(400)
    if (salarieId) {
      return mockEvaluations.filter(e => e.salarieId === salarieId)
    }
    return mockEvaluations
  },

  createEvaluation: async (data: Partial<MockEvaluation>) => {
    await delay(500)
    const newEvaluation: MockEvaluation = {
      id: String(mockEvaluations.length + 1),
      type: data.type!,
      note: data.note,
      commentaire: data.commentaire,
      salarieId: data.salarieId!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockEvaluations.push(newEvaluation)
    return newEvaluation
  },

  getCartographieCompetences: async (salarieId: string) => {
    await delay(400)
    return {
      competences: [
        { nom: 'React', niveau: 8, max: 10 },
        { nom: 'Node.js', niveau: 7, max: 10 },
        { nom: 'TypeScript', niveau: 9, max: 10 },
      ],
    }
  },
}

