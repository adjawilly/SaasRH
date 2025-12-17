import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)

router.get('/stats', async (req, res) => {
  try {
    const totalCandidatures = await prisma.candidature.count()
    const candidaturesEnAttente = await prisma.candidature.count({
      where: { statut: 'en_attente' },
    })
    const totalSalaries = await prisma.salarie.count({
      where: { statut: 'actif' },
    })
    const demandesEnAttente = await prisma.demande.count({
      where: { statut: 'en_attente' },
    })
    const formationsEnCours = await prisma.formation.count({
      where: { statut: 'en_cours' },
    })
    const evaluationsEnCours = await prisma.evaluation.count({
      where: { statut: 'en_cours' },
    })

    res.json({
      totalCandidatures,
      candidaturesEnAttente,
      totalSalaries,
      demandesEnAttente,
      formationsEnCours,
      evaluationsEnCours,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

