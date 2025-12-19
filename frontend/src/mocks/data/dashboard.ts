// Données mockées pour le dashboard

export interface DashboardStats {
  totalCandidatures: number
  candidaturesEnAttente: number
  totalSalaries: number
  demandesEnAttente: number
  formationsEnCours: number
  evaluationsEnCours: number
}

export const mockDashboardStats: DashboardStats = {
  totalCandidatures: 45,
  candidaturesEnAttente: 12,
  totalSalaries: 128,
  demandesEnAttente: 8,
  formationsEnCours: 5,
  evaluationsEnCours: 15,
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockDashboard = {
  getStats: async () => {
    await delay(400)
    return mockDashboardStats
  },
}

