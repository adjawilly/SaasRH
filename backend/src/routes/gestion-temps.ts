import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)

// Get suivi temps
router.get('/suivi', async (req, res) => {
  try {
    // TODO: Calculate from actual data
    res.json({
      heuresSemaine: 40,
      heuresMois: 160,
      moyenne: 8,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get heures supplementaires
router.get('/heures-supplementaires', async (req, res) => {
  try {
    // TODO: Get salarie from user
    const salarie = await prisma.salarie.findFirst()
    if (!salarie) {
      return res.json([])
    }

    const heures = await prisma.heureSupplementaire.findMany({
      where: { salarieId: salarie.id },
      orderBy: { date: 'desc' },
    })

    res.json(heures)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Create heures supplementaires
router.post('/heures-supplementaires', async (req, res) => {
  try {
    const { date, heures } = req.body
    // TODO: Get salarie from user
    const salarie = await prisma.salarie.findFirst()

    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }

    const heureSup = await prisma.heureSupplementaire.create({
      data: {
        date: new Date(date),
        heures: parseFloat(heures),
        salarieId: salarie.id,
      },
    })

    res.json(heureSup)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

