import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)

// Get plans formation
router.get('/plans', async (req, res) => {
  try {
    // TODO: Filter by user
    const plans = await prisma.formation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(plans)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get historique
router.get('/historique', async (req, res) => {
  try {
    // TODO: Filter by user
    const formations = await prisma.formation.findMany({
      where: { statut: 'termine' },
      orderBy: { dateFin: 'desc' },
    })

    res.json(formations.map(f => ({
      id: f.id,
      libelle: f.libelle,
      date: f.dateDebut.toISOString(),
      description: f.description,
    })))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get formations for evaluation
router.get('/evaluation', async (req, res) => {
  try {
    const formations = await prisma.formation.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(formations)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Create evaluation
router.post('/evaluation', async (req, res) => {
  try {
    const { formationId, type, note, commentaire } = req.body

    const evaluation = await prisma.evaluationFormation.create({
      data: {
        formationId,
        type,
        note: note ? parseFloat(note) : null,
        commentaire,
      },
    })

    res.json(evaluation)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

