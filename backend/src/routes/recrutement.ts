import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireProfil } from '../middleware/auth'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()
const prisma = new PrismaClient()

// Public route for candidature
router.get('/offres/public/:token', async (req, res) => {
  try {
    const { token } = req.params
    // Find offre by lienOffre (token is part of the link)
    const offre = await prisma.offre.findFirst({
      where: {
        lienOffre: {
          contains: token,
        },
      },
    })
    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvée' })
    }
    res.json(offre)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/candidatures/public', async (req, res) => {
  try {
    const data = JSON.parse(req.body.data)
    const { offreId, nom, prenom, email, domaine, competences, niveauEtude, genre, commentaire } = data

    // TODO: Handle file uploads (CV and LM)
    const candidature = await prisma.candidature.create({
      data: {
        nom,
        prenom,
        email,
        domaine,
        competences,
        niveauEtude,
        genre,
        commentaire,
        offreId,
      },
    })

    res.json(candidature)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.use(authenticate)
router.use(requireProfil('compte_rh', 'administrateur'))

// Get all offres
router.get('/offres', async (req, res) => {
  try {
    const offres = await prisma.offre.findMany({
      orderBy: { createdAt: 'desc' },
    })
    const formatted = offres.map(offre => ({
      ...offre,
      competences: offre.competences.split(','),
    }))
    res.json(formatted)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Create offre
router.post('/offres', async (req, res) => {
  try {
    const { libelleOffre, typeOffre, domaineActivite, competences, niveauEtude, dateEffet, dateExpiration } = req.body

    const lienOffre = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/candidature/${uuidv4()}`

    const offre = await prisma.offre.create({
      data: {
        libelleOffre,
        typeOffre,
        domaineActivite,
        competences: Array.isArray(competences) ? competences.join(',') : competences,
        niveauEtude,
        dateEffet: new Date(dateEffet),
        dateExpiration: new Date(dateExpiration),
        lienOffre,
      },
    })

    res.json(offre)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get offre by id
router.get('/offres/:id', async (req, res) => {
  try {
    const offre = await prisma.offre.findUnique({
      where: { id: req.params.id },
    })
    if (!offre) {
      return res.status(404).json({ message: 'Offre non trouvée' })
    }
    res.json({
      ...offre,
      competences: offre.competences.split(','),
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Update offre
router.put('/offres/:id', async (req, res) => {
  try {
    const { libelleOffre, typeOffre, domaineActivite, competences, niveauEtude, dateEffet, dateExpiration } = req.body

    // Get existing offre to preserve lienOffre
    const existingOffre = await prisma.offre.findUnique({
      where: { id: req.params.id },
    })

    if (!existingOffre) {
      return res.status(404).json({ message: 'Offre non trouvée' })
    }

    const offre = await prisma.offre.update({
      where: { id: req.params.id },
      data: {
        libelleOffre,
        typeOffre,
        domaineActivite,
        competences: Array.isArray(competences) ? competences.join(',') : competences,
        niveauEtude,
        dateEffet: new Date(dateEffet),
        dateExpiration: new Date(dateExpiration),
        // lienOffre remains unchanged
      },
    })

    res.json(offre)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get candidatures
router.get('/candidatures', async (req, res) => {
  try {
    const { offre } = req.query
    const where: any = {}
    if (offre) {
      where.offreId = offre as string
    }

    const candidatures = await prisma.candidature.findMany({
      where,
      include: { offre: true },
      orderBy: { createdAt: 'desc' },
    })

    const formatted = candidatures.map(c => ({
      ...c,
      competences: c.competences.split(','),
      offreLibelle: c.offre.libelleOffre,
    }))

    res.json(formatted)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get candidature by id
router.get('/candidatures/:id', async (req, res) => {
  try {
    const candidature = await prisma.candidature.findUnique({
      where: { id: req.params.id },
      include: { offre: true, notation: true },
    })
    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' })
    }

    res.json({
      ...candidature,
      competences: candidature.competences.split(','),
      offreLibelle: candidature.offre.libelleOffre,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Preselection
router.post('/candidatures/:id/preselection', async (req, res) => {
  try {
    const { preselectionne } = req.body
    const candidature = await prisma.candidature.update({
      where: { id: req.params.id },
      data: {
        statut: preselectionne ? 'preselectionne' : 'rejete',
      },
    })
    res.json(candidature)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Notation entretien
router.post('/candidatures/:id/entretien', async (req, res) => {
  try {
    const { noteTechnique, noteCommunication, noteMotivation, noteCulture, commentaire } = req.body

    const notation = await prisma.notation.upsert({
      where: { candidatureId: req.params.id },
      update: {
        noteTechnique,
        noteCommunication,
        noteMotivation,
        noteCulture,
        commentaire,
      },
      create: {
        candidatureId: req.params.id,
        noteTechnique,
        noteCommunication,
        noteMotivation,
        noteCulture,
        commentaire,
      },
    })

    await prisma.candidature.update({
      where: { id: req.params.id },
      data: { statut: 'entretien' },
    })

    res.json(notation)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Generate contract
router.post('/candidatures/:id/contrat', async (req, res) => {
  try {
    const candidature = await prisma.candidature.findUnique({
      where: { id: req.params.id },
      include: { offre: true },
    })

    if (!candidature) {
      return res.status(404).json({ message: 'Candidature non trouvée' })
    }

    // TODO: Generate actual contract PDF
    const contractUrl = `/contracts/${req.params.id}.pdf`

    await prisma.candidature.update({
      where: { id: req.params.id },
      data: { statut: 'embauche' },
    })

    res.json({ url: contractUrl })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Onboarding
router.post('/candidatures/:id/onboarding', async (req, res) => {
  try {
    const { stepId } = req.body
    // TODO: Implement onboarding steps
    res.json({ stepId, completed: true })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

