import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)

// Get objectifs
router.get('/objectifs', async (req, res) => {
  try {
    // TODO: Filter by user
    const objectifs = await prisma.objectif.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(objectifs)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Auto evaluation
router.post('/auto-evaluation', async (req, res) => {
  try {
    const { objectif, evaluation } = req.body
    // TODO: Get salarie from user
    const salarie = await prisma.salarie.findFirst()

    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }

    const evalObj = await prisma.evaluation.create({
      data: {
        type: 'auto_evaluation',
        commentaire: evaluation,
        salarieId: salarie.id,
      },
    })

    res.json(evalObj)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Cartographie competences
router.get('/cartographie', async (req, res) => {
  try {
    // TODO: Get actual competences from salarie
    const competences = await prisma.competence.findMany()
    res.json(competences.map(c => ({ id: c.id, nom: c.libelle, niveau: 3 })))
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

