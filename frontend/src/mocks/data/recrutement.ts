// Données mockées pour le module recrutement

export interface MockOffre {
  id: string
  libelleOffre: string
  typeOffre: 'CDD' | 'CDI' | 'Stage'
  domaineActivite: string
  competences: string
  niveauEtude: string
  datePublication: string
  dateEffet: string
  dateExpiration: string
  lienOffre: string
  createdAt: string
  updatedAt: string
}

export interface MockCandidature {
  id: string
  nom: string
  prenom: string
  email: string
  domaine: string
  competences: string
  niveauEtude: string
  genre: string
  commentaire?: string
  cvUrl?: string
  lmUrl?: string
  statut: string
  offreId: string
  offre?: MockOffre
  createdAt: string
  updatedAt: string
}

export interface MockNotation {
  id: string
  noteTechnique: number
  noteCommunication: number
  noteMotivation: number
  noteCulture: number
  commentaire?: string
  candidatureId: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockOffres: MockOffre[] = [
  {
    id: '1',
    libelleOffre: 'Développeur Full Stack',
    typeOffre: 'CDI',
    domaineActivite: 'Informatique',
    competences: 'React, Node.js, TypeScript',
    niveauEtude: 'Bac+5',
    datePublication: '2024-01-15T00:00:00Z',
    dateEffet: '2024-02-01T00:00:00Z',
    dateExpiration: '2024-03-01T00:00:00Z',
    lienOffre: 'http://localhost:3000/candidature/offre-1-token',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    libelleOffre: 'Chef de Projet RH',
    typeOffre: 'CDD',
    domaineActivite: 'Ressources Humaines',
    competences: 'Gestion de projet, Communication',
    niveauEtude: 'Bac+5',
    datePublication: '2024-01-20T00:00:00Z',
    dateEffet: '2024-02-15T00:00:00Z',
    dateExpiration: '2024-03-15T00:00:00Z',
    lienOffre: 'http://localhost:3000/candidature/offre-2-token',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    libelleOffre: 'Stagiaire Marketing Digital',
    typeOffre: 'Stage',
    domaineActivite: 'Marketing',
    competences: 'SEO, Réseaux sociaux, Content Marketing',
    niveauEtude: 'Bac+3',
    datePublication: '2024-01-25T00:00:00Z',
    dateEffet: '2024-02-20T00:00:00Z',
    dateExpiration: '2024-03-20T00:00:00Z',
    lienOffre: 'http://localhost:3000/candidature/offre-3-token',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
]

export const mockCandidatures: MockCandidature[] = [
  {
    id: '1',
    nom: 'Martin',
    prenom: 'Pierre',
    email: 'pierre.martin@email.com',
    domaine: 'Informatique',
    competences: 'React, Node.js',
    niveauEtude: 'Bac+5',
    genre: 'Homme',
    statut: 'en_attente',
    offreId: '1',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
  },
  {
    id: '2',
    nom: 'Dubois',
    prenom: 'Marie',
    email: 'marie.dubois@email.com',
    domaine: 'Ressources Humaines',
    competences: 'Gestion de projet',
    niveauEtude: 'Bac+5',
    genre: 'Femme',
    statut: 'preselectionne',
    offreId: '2',
    createdAt: '2024-01-21T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
  },
  {
    id: '3',
    nom: 'Bernard',
    prenom: 'Luc',
    email: 'luc.bernard@email.com',
    domaine: 'Informatique',
    competences: 'TypeScript, React',
    niveauEtude: 'Bac+5',
    genre: 'Homme',
    statut: 'rejete',
    offreId: '1',
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
  },
]

export const mockRecrutement = {
  getOffres: async () => {
    await delay(400)
    return mockOffres
  },

  getOffre: async (id: string) => {
    await delay(300)
    const offre = mockOffres.find(o => o.id === id)
    if (!offre) throw new Error('Offre non trouvée')
    return offre
  },

  getOffreByToken: async (token: string) => {
    await delay(300)
    // Simule la récupération d'une offre par token
    const offreId = token.split('-')[1]
    const offre = mockOffres.find(o => o.id === offreId)
    if (!offre) throw new Error('Offre non trouvée')
    return offre
  },

  createOffre: async (data: Partial<MockOffre>) => {
    await delay(500)
    const newOffre: MockOffre = {
      id: String(mockOffres.length + 1),
      libelleOffre: data.libelleOffre!,
      typeOffre: data.typeOffre!,
      domaineActivite: data.domaineActivite!,
      competences: data.competences!,
      niveauEtude: data.niveauEtude!,
      datePublication: new Date().toISOString(),
      dateEffet: data.dateEffet!,
      dateExpiration: data.dateExpiration!,
      lienOffre: `http://localhost:3000/candidature/offre-${mockOffres.length + 1}-token`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockOffres.push(newOffre)
    return newOffre
  },

  updateOffre: async (id: string, data: Partial<MockOffre>) => {
    await delay(400)
    const index = mockOffres.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Offre non trouvée')
    mockOffres[index] = { ...mockOffres[index], ...data, updatedAt: new Date().toISOString() }
    return mockOffres[index]
  },

  deleteOffre: async (id: string) => {
    await delay(300)
    const index = mockOffres.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Offre non trouvée')
    mockOffres.splice(index, 1)
    return { message: 'Offre supprimée' }
  },

  getCandidatures: async (offreId?: string) => {
    await delay(400)
    let candidatures = offreId 
      ? mockCandidatures.filter(c => c.offreId === offreId)
      : mockCandidatures
    
    // Ajouter dateDepot et offreLibelle pour chaque candidature
    return candidatures.map(c => {
      const offre = mockOffres.find(o => o.id === c.offreId)
      return {
        ...c,
        dateDepot: c.createdAt,
        offreLibelle: offre?.libelleOffre || 'Offre inconnue',
        competences: Array.isArray(c.competences) ? c.competences : (c.competences ? c.competences.split(',') : [])
      }
    })
  },

  getCandidature: async (id: string) => {
    await delay(300)
    const candidature = mockCandidatures.find(c => c.id === id)
    if (!candidature) throw new Error('Candidature non trouvée')
    const offre = mockOffres.find(o => o.id === candidature.offreId)
    return { 
      ...candidature, 
      offre,
      dateDepot: candidature.createdAt,
      offreLibelle: offre?.libelleOffre || 'Offre inconnue',
      competences: Array.isArray(candidature.competences) 
        ? candidature.competences 
        : (candidature.competences ? candidature.competences.split(',') : [])
    }
  },

  createCandidature: async (data: Partial<MockCandidature>) => {
    await delay(500)
    const newCandidature: MockCandidature = {
      id: String(mockCandidatures.length + 1),
      nom: data.nom!,
      prenom: data.prenom!,
      email: data.email!,
      domaine: data.domaine!,
      competences: data.competences!,
      niveauEtude: data.niveauEtude!,
      genre: data.genre!,
      commentaire: data.commentaire,
      statut: 'en_attente',
      offreId: data.offreId!,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockCandidatures.push(newCandidature)
    return newCandidature
  },

  updateCandidature: async (id: string, data: Partial<MockCandidature>) => {
    await delay(400)
    const index = mockCandidatures.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Candidature non trouvée')
    mockCandidatures[index] = { ...mockCandidatures[index], ...data, updatedAt: new Date().toISOString() }
    return mockCandidatures[index]
  },

  createNotation: async (candidatureId: string, data: Partial<MockNotation>) => {
    await delay(500)
    return {
      id: '1',
      candidatureId,
      noteTechnique: data.noteTechnique!,
      noteCommunication: data.noteCommunication!,
      noteMotivation: data.noteMotivation!,
      noteCulture: data.noteCulture!,
      commentaire: data.commentaire,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },
}

