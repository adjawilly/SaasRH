// Données mockées pour le module paramétrage

export interface MockParametrage {
  id: string
  libelle: string
  createdAt: string
  updatedAt: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockCompetences: MockParametrage[] = [
  { id: '1', libelle: 'React', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', libelle: 'Node.js', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '3', libelle: 'TypeScript', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '4', libelle: 'Gestion de projet', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '5', libelle: 'Communication', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

export const mockDomaines: MockParametrage[] = [
  { id: '1', libelle: 'Informatique', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', libelle: 'Ressources Humaines', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '3', libelle: 'Marketing', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '4', libelle: 'Finance', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

export const mockFonctions: MockParametrage[] = [
  { id: '1', libelle: 'Développeur', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', libelle: 'Chef de projet', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '3', libelle: 'Manager RH', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '4', libelle: 'Comptable', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

export const mockNiveauxEtude: MockParametrage[] = [
  { id: '1', libelle: 'Bac', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', libelle: 'Bac+2', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '3', libelle: 'Bac+3', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '4', libelle: 'Bac+5', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

export const mockProfils: MockParametrage[] = [
  { id: '1', libelle: 'administrateur', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', libelle: 'compte_rh', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '3', libelle: 'compte_salarie', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
]

const createCRUD = (items: MockParametrage[]) => ({
  getAll: async () => {
    await delay(300)
    return items
  },

  getById: async (id: string) => {
    await delay(200)
    const item = items.find(i => i.id === id)
    if (!item) throw new Error('Item non trouvé')
    return item
  },

  create: async (libelle: string) => {
    await delay(400)
    const newItem: MockParametrage = {
      id: String(items.length + 1),
      libelle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    items.push(newItem)
    return newItem
  },

  update: async (id: string, libelle: string) => {
    await delay(400)
    const item = items.find(i => i.id === id)
    if (!item) throw new Error('Item non trouvé')
    item.libelle = libelle
    item.updatedAt = new Date().toISOString()
    return item
  },

  delete: async (id: string) => {
    await delay(300)
    const index = items.findIndex(i => i.id === id)
    if (index === -1) throw new Error('Item non trouvé')
    items.splice(index, 1)
    return { message: 'Item supprimé' }
  },
})

export const mockParametrage = {
  competences: createCRUD(mockCompetences),
  domaines: createCRUD(mockDomaines),
  fonctions: createCRUD(mockFonctions),
  niveauxEtude: createCRUD(mockNiveauxEtude),
  profils: createCRUD(mockProfils),
}

