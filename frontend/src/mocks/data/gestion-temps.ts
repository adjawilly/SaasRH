// Données mockées pour le module gestion des temps

export interface MockHeureSupplementaire {
  id: string
  date: string
  heures: number
  salarieId: string
  createdAt: string
}

export interface MockTempsTravail {
  id: string
  date: string
  heures: number
  salarieId: string
  createdAt: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockHeuresSupplementaires: MockHeureSupplementaire[] = [
  {
    id: '1',
    date: '2024-01-15T00:00:00Z',
    heures: 2,
    salarieId: '1',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    date: '2024-01-20T00:00:00Z',
    heures: 3,
    salarieId: '1',
    createdAt: '2024-01-20T00:00:00Z',
  },
]

export const mockTempsTravail: MockTempsTravail[] = [
  {
    id: '1',
    date: '2024-01-15T00:00:00Z',
    heures: 8,
    salarieId: '1',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    date: '2024-01-16T00:00:00Z',
    heures: 7.5,
    salarieId: '1',
    createdAt: '2024-01-16T00:00:00Z',
  },
]

export const mockGestionTemps = {
  getHeuresSupplementaires: async (salarieId?: string) => {
    await delay(400)
    if (salarieId) {
      return mockHeuresSupplementaires.filter(h => h.salarieId === salarieId)
    }
    return mockHeuresSupplementaires
  },

  createHeureSupplementaire: async (data: Partial<MockHeureSupplementaire>) => {
    await delay(500)
    const newHeure: MockHeureSupplementaire = {
      id: String(mockHeuresSupplementaires.length + 1),
      date: data.date!,
      heures: data.heures!,
      salarieId: data.salarieId!,
      createdAt: new Date().toISOString(),
    }
    mockHeuresSupplementaires.push(newHeure)
    return newHeure
  },

  getTempsTravail: async (salarieId?: string) => {
    await delay(400)
    if (salarieId) {
      return mockTempsTravail.filter(t => t.salarieId === salarieId)
    }
    return mockTempsTravail
  },

  createTempsTravail: async (data: Partial<MockTempsTravail>) => {
    await delay(500)
    const newTemps: MockTempsTravail = {
      id: String(mockTempsTravail.length + 1),
      date: data.date!,
      heures: data.heures!,
      salarieId: data.salarieId!,
      createdAt: new Date().toISOString(),
    }
    mockTempsTravail.push(newTemps)
    return newTemps
  },
}

