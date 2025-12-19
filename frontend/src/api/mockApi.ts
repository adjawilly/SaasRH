// Service API mock qui simule axios
import { USE_MOCK_API } from './config'
import { mockAuth } from '../mocks/data/auth'
import { mockDashboard } from '../mocks/data/dashboard'
import { mockRecrutement } from '../mocks/data/recrutement'
import { mockParametrage } from '../mocks/data/parametrage'
import { mockGestionAdmin } from '../mocks/data/gestion-admin'
import { mockDemandeAdmin } from '../mocks/data/demande-admin'
import { mockEvaluation } from '../mocks/data/evaluation'
import { mockFormation } from '../mocks/data/formation'
import { mockGestionTemps } from '../mocks/data/gestion-temps'

// Simule un délai réseau
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Interface pour simuler la réponse axios
interface MockResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

// Crée une réponse mock
const createResponse = <T>(data: T, status = 200): MockResponse<T> => ({
  data,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: {},
})

// Classe pour simuler axios
class MockAxios {
  defaults = {
    headers: {
      common: {} as Record<string, string>,
    },
  }

  async get<T = any>(url: string): Promise<MockResponse<T>> {
    await delay(200) // Simule un délai réseau

    if (!USE_MOCK_API) {
      throw new Error('Mock API désactivé. Utilisez axios réel.')
    }

    // Auth
    if (url === '/api/auth/me') {
      const token = this.defaults.headers.common['Authorization']?.split(' ')[1] || ''
      const user = await mockAuth.getMe(token)
      return createResponse(user as T)
    }

    // Dashboard
    if (url === '/api/dashboard/stats') {
      const stats = await mockDashboard.getStats()
      return createResponse(stats as T)
    }

    // Recrutement
    if (url.startsWith('/api/recrutement/offres/public/')) {
      const token = url.split('/').pop() || ''
      const offre = await mockRecrutement.getOffreByToken(token)
      return createResponse(offre as T)
    }
    if (url === '/api/recrutement/offres') {
      const offres = await mockRecrutement.getOffres()
      return createResponse(offres as T)
    }
    if (url.startsWith('/api/recrutement/offres/') && !url.includes('/public/')) {
      const id = url.split('/').pop() || ''
      const offre = await mockRecrutement.getOffre(id)
      return createResponse(offre as T)
    }
    if (url === '/api/recrutement/candidatures' || url.startsWith('/api/recrutement/candidatures?')) {
      const urlObj = new URL(url, 'http://localhost')
      const offreId = urlObj.searchParams.get('offre')
      const candidatures = await mockRecrutement.getCandidatures(offreId || undefined)
      return createResponse(candidatures as T)
    }
    if (url.startsWith('/api/recrutement/candidatures/') && !url.includes('/public')) {
      const id = url.split('/').pop() || ''
      const candidature = await mockRecrutement.getCandidature(id)
      return createResponse(candidature as T)
    }

    // Paramétrage
    if (url === '/api/parametrage/competences') {
      const competences = await mockParametrage.competences.getAll()
      return createResponse(competences as T)
    }
    if (url === '/api/parametrage/domaines') {
      const domaines = await mockParametrage.domaines.getAll()
      return createResponse(domaines as T)
    }
    if (url === '/api/parametrage/fonctions') {
      const fonctions = await mockParametrage.fonctions.getAll()
      return createResponse(fonctions as T)
    }
    if (url === '/api/parametrage/niveaux-etude') {
      const niveaux = await mockParametrage.niveauxEtude.getAll()
      return createResponse(niveaux as T)
    }
    if (url === '/api/parametrage/profils') {
      const profils = await mockParametrage.profils.getAll()
      return createResponse(profils as T)
    }

    // Gestion Admin
    if (url === '/api/gestion-admin/salaries') {
      const salaries = await mockGestionAdmin.getSalaries()
      return createResponse(salaries as T)
    }
    if (url.startsWith('/api/gestion-admin/salaries/')) {
      const id = url.split('/').pop() || ''
      const salarie = await mockGestionAdmin.getSalarie(id)
      return createResponse(salarie as T)
    }
    if (url.startsWith('/api/gestion-admin/documents/')) {
      const salarieId = url.split('/').pop() || ''
      const documents = await mockGestionAdmin.getDocuments(salarieId)
      return createResponse(documents as T)
    }

    // Demande Admin
    if (url === '/api/demande-admin/demandes' || url === '/api/demande-admin/absences' || url === '/api/demande-admin/conges' || url === '/api/demande-admin/attestations') {
      const demandes = await mockDemandeAdmin.getDemandes()
      return createResponse(demandes as T)
    }
    if (url.startsWith('/api/demande-admin/demandes/')) {
      const id = url.split('/').pop() || ''
      const demande = await mockDemandeAdmin.getDemande(id)
      return createResponse(demande as T)
    }
    if (url.startsWith('/api/demande-admin/solde-conge/')) {
      const salarieId = url.split('/').pop() || ''
      const solde = await mockDemandeAdmin.getSoldeConge(salarieId)
      return createResponse(solde as T)
    }

    // Evaluation
    if (url === '/api/evaluation/objectifs' || url.startsWith('/api/evaluation/objectifs?')) {
      const urlObj = new URL(url, 'http://localhost')
      const salarieId = urlObj.searchParams.get('salarieId') || undefined
      const objectifs = await mockEvaluation.getObjectifs(salarieId)
      return createResponse(objectifs as T)
    }
    if (url.startsWith('/api/evaluation/cartographie/')) {
      const salarieId = url.split('/').pop() || ''
      const cartographie = await mockEvaluation.getCartographieCompetences(salarieId)
      return createResponse(cartographie as T)
    }

    // Formation
    if (url === '/api/formation' || url.startsWith('/api/formation?')) {
      const urlObj = new URL(url, 'http://localhost')
      const salarieId = urlObj.searchParams.get('salarieId') || undefined
      const formations = await mockFormation.getFormations(salarieId)
      return createResponse(formations as T)
    }

    // Gestion Temps
    if (url === '/api/gestion-temps/heures-supplementaires' || url.startsWith('/api/gestion-temps/heures-supplementaires?')) {
      const urlObj = new URL(url, 'http://localhost')
      const salarieId = urlObj.searchParams.get('salarieId') || undefined
      const heures = await mockGestionTemps.getHeuresSupplementaires(salarieId)
      return createResponse(heures as T)
    }
    if (url === '/api/gestion-temps/temps-travail' || url.startsWith('/api/gestion-temps/temps-travail?')) {
      const urlObj = new URL(url, 'http://localhost')
      const salarieId = urlObj.searchParams.get('salarieId') || undefined
      const temps = await mockGestionTemps.getTempsTravail(salarieId)
      return createResponse(temps as T)
    }

    throw new Error(`Route non mockée: GET ${url}`)
  }

  async post<T = any>(url: string, data?: any): Promise<MockResponse<T>> {
    await delay(300)

    if (!USE_MOCK_API) {
      throw new Error('Mock API désactivé. Utilisez axios réel.')
    }

    // Auth
    if (url === '/api/auth/login') {
      const { email, password } = data
      const result = await mockAuth.login(email, password)
      return createResponse(result as T)
    }
    if (url === '/api/auth/register') {
      const result = await mockAuth.register(data)
      return createResponse(result as T)
    }
    if (url === '/api/auth/google') {
      const { token } = data
      const result = await mockAuth.loginWithGoogle(token)
      return createResponse(result as T)
    }
    if (url === '/api/auth/forgot-password') {
      const { email } = data
      const result = await mockAuth.forgotPassword(email)
      return createResponse(result as T)
    }

    // Recrutement
    if (url === '/api/recrutement/offres') {
      const offre = await mockRecrutement.createOffre(data)
      return createResponse(offre as T)
    }
    if (url === '/api/recrutement/candidatures/public') {
      // Simule la création d'une candidature publique
      // Gère FormData
      let candidatureData = data
      if (data instanceof FormData) {
        const dataStr = data.get('data') as string
        candidatureData = JSON.parse(dataStr)
        candidatureData.offreId = data.get('offreId') || candidatureData.offreId
      }
      const candidature = await mockRecrutement.createCandidature(candidatureData)
      return createResponse(candidature as T)
    }
    if (url.startsWith('/api/recrutement/candidatures/') && url.includes('/notation')) {
      const candidatureId = url.split('/')[4]
      const notation = await mockRecrutement.createNotation(candidatureId, data)
      return createResponse(notation as T)
    }

    // Paramétrage
    if (url === '/api/parametrage/competences') {
      const competence = await mockParametrage.competences.create(data.libelle)
      return createResponse(competence as T)
    }
    if (url === '/api/parametrage/domaines') {
      const domaine = await mockParametrage.domaines.create(data.libelle)
      return createResponse(domaine as T)
    }
    if (url === '/api/parametrage/fonctions') {
      const fonction = await mockParametrage.fonctions.create(data.libelle)
      return createResponse(fonction as T)
    }
    if (url === '/api/parametrage/niveaux-etude') {
      const niveau = await mockParametrage.niveauxEtude.create(data.libelle)
      return createResponse(niveau as T)
    }
    if (url === '/api/parametrage/profils') {
      const profil = await mockParametrage.profils.create(data.libelle)
      return createResponse(profil as T)
    }

    // Gestion Admin
    if (url === '/api/gestion-admin/salaries') {
      const salarie = await mockGestionAdmin.createSalarie(data)
      return createResponse(salarie as T)
    }
    if (url === '/api/gestion-admin/charger') {
      const result = await mockGestionAdmin.uploadSalaries(data)
      return createResponse(result as T)
    }
    if (url.startsWith('/api/gestion-admin/documents/')) {
      const salarieId = url.split('/').pop() || ''
      const document = await mockGestionAdmin.uploadDocument(salarieId, data)
      return createResponse(document as T)
    }

    // Demande Admin
    if (url === '/api/demande-admin/demandes' || url === '/api/demande-admin/absences' || url === '/api/demande-admin/conges' || url === '/api/demande-admin/attestations') {
      // Détermine le type selon l'URL
      let type = 'absence'
      if (url.includes('/conges')) type = 'conge'
      if (url.includes('/attestations')) type = 'attestation'
      const demande = await mockDemandeAdmin.createDemande({ ...data, type })
      return createResponse(demande as T)
    }

    // Evaluation
    if (url === '/api/evaluation/objectifs') {
      const objectif = await mockEvaluation.createObjectif(data)
      return createResponse(objectif as T)
    }
    if (url === '/api/evaluation') {
      const evaluation = await mockEvaluation.createEvaluation(data)
      return createResponse(evaluation as T)
    }

    // Formation
    if (url === '/api/formation') {
      const formation = await mockFormation.createFormation(data)
      return createResponse(formation as T)
    }
    if (url.startsWith('/api/formation/') && url.includes('/evaluation')) {
      const formationId = url.split('/')[3]
      const evaluation = await mockFormation.createEvaluationFormation(formationId, data)
      return createResponse(evaluation as T)
    }

    // Gestion Temps
    if (url === '/api/gestion-temps/heures-supplementaires') {
      const heure = await mockGestionTemps.createHeureSupplementaire(data)
      return createResponse(heure as T)
    }
    if (url === '/api/gestion-temps/temps-travail') {
      const temps = await mockGestionTemps.createTempsTravail(data)
      return createResponse(temps as T)
    }

    throw new Error(`Route non mockée: POST ${url}`)
  }

  async put<T = any>(url: string, data?: any): Promise<MockResponse<T>> {
    await delay(300)

    if (!USE_MOCK_API) {
      throw new Error('Mock API désactivé. Utilisez axios réel.')
    }

    // Recrutement
    if (url.startsWith('/api/recrutement/offres/')) {
      const id = url.split('/').pop() || ''
      const offre = await mockRecrutement.updateOffre(id, data)
      return createResponse(offre as T)
    }
    if (url.startsWith('/api/recrutement/candidatures/')) {
      const id = url.split('/').pop() || ''
      const candidature = await mockRecrutement.updateCandidature(id, data)
      return createResponse(candidature as T)
    }

    // Paramétrage
    if (url.startsWith('/api/parametrage/competences/')) {
      const id = url.split('/').pop() || ''
      const competence = await mockParametrage.competences.update(id, data.libelle)
      return createResponse(competence as T)
    }
    if (url.startsWith('/api/parametrage/domaines/')) {
      const id = url.split('/').pop() || ''
      const domaine = await mockParametrage.domaines.update(id, data.libelle)
      return createResponse(domaine as T)
    }
    if (url.startsWith('/api/parametrage/fonctions/')) {
      const id = url.split('/').pop() || ''
      const fonction = await mockParametrage.fonctions.update(id, data.libelle)
      return createResponse(fonction as T)
    }
    if (url.startsWith('/api/parametrage/niveaux-etude/')) {
      const id = url.split('/').pop() || ''
      const niveau = await mockParametrage.niveauxEtude.update(id, data.libelle)
      return createResponse(niveau as T)
    }
    if (url.startsWith('/api/parametrage/profils/')) {
      const id = url.split('/').pop() || ''
      const profil = await mockParametrage.profils.update(id, data.libelle)
      return createResponse(profil as T)
    }

    // Gestion Admin
    if (url.startsWith('/api/gestion-admin/salaries/')) {
      const id = url.split('/').pop() || ''
      const salarie = await mockGestionAdmin.updateSalarie(id, data)
      return createResponse(salarie as T)
    }

    // Demande Admin
    if (url.startsWith('/api/demande-admin/demandes/')) {
      const id = url.split('/').pop() || ''
      const demande = await mockDemandeAdmin.updateDemande(id, data)
      return createResponse(demande as T)
    }

    // Evaluation
    if (url.startsWith('/api/evaluation/objectifs/')) {
      const id = url.split('/').pop() || ''
      const objectif = await mockEvaluation.updateObjectif(id, data)
      return createResponse(objectif as T)
    }

    // Formation
    if (url.startsWith('/api/formation/')) {
      const id = url.split('/').pop() || ''
      const formation = await mockFormation.updateFormation(id, data)
      return createResponse(formation as T)
    }

    throw new Error(`Route non mockée: PUT ${url}`)
  }

  async delete<T = any>(url: string): Promise<MockResponse<T>> {
    await delay(300)

    if (!USE_MOCK_API) {
      throw new Error('Mock API désactivé. Utilisez axios réel.')
    }

    // Recrutement
    if (url.startsWith('/api/recrutement/offres/')) {
      const id = url.split('/').pop() || ''
      const result = await mockRecrutement.deleteOffre(id)
      return createResponse(result as T)
    }

    // Paramétrage
    if (url.startsWith('/api/parametrage/competences/')) {
      const id = url.split('/').pop() || ''
      const result = await mockParametrage.competences.delete(id)
      return createResponse(result as T)
    }
    if (url.startsWith('/api/parametrage/domaines/')) {
      const id = url.split('/').pop() || ''
      const result = await mockParametrage.domaines.delete(id)
      return createResponse(result as T)
    }
    if (url.startsWith('/api/parametrage/fonctions/')) {
      const id = url.split('/').pop() || ''
      const result = await mockParametrage.fonctions.delete(id)
      return createResponse(result as T)
    }
    if (url.startsWith('/api/parametrage/niveaux-etude/')) {
      const id = url.split('/').pop() || ''
      const result = await mockParametrage.niveauxEtude.delete(id)
      return createResponse(result as T)
    }
    if (url.startsWith('/api/parametrage/profils/')) {
      const id = url.split('/').pop() || ''
      const result = await mockParametrage.profils.delete(id)
      return createResponse(result as T)
    }

    // Evaluation
    if (url.startsWith('/api/evaluation/objectifs/')) {
      const id = url.split('/').pop() || ''
      const result = await mockEvaluation.deleteObjectif(id)
      return createResponse(result as T)
    }

    throw new Error(`Route non mockée: DELETE ${url}`)
  }
}

// Instance unique
const mockAxios = new MockAxios()

export default mockAxios

