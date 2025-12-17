import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)

// Get all demandes
router.get('/demandes', async (req, res) => {
  try {
    // TODO: Filter by user
    const demandes = await prisma.demande.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const enAttente = demandes.filter(d => d.statut === 'en_attente').length
    const approuvees = demandes.filter(d => d.statut === 'approuve').length

    res.json({
      liste: demandes,
      enAttente,
      approuvees,
      total: demandes.length,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Create absence
router.post('/absences', async (req, res) => {
  try {
    const { dateDebut, dateFin, motif } = req.body
    // TODO: Get salarie from user
    const salarie = await prisma.salarie.findFirst()

    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }

    const demande = await prisma.demande.create({
      data: {
        type: 'absence',
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        motif,
        salarieId: salarie.id,
      },
    })

    res.json(demande)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Create conge
router.post('/conges', async (req, res) => {
  try {
    const { dateDebut, dateFin, typeConge } = req.body
    // TODO: Get salarie from user
    const salarie = await prisma.salarie.findFirst()

    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }

    const demande = await prisma.demande.create({
      data: {
        type: typeConge,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
        salarieId: salarie.id,
      },
    })

    res.json(demande)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Generate attestation
router.post('/attestations', async (req, res) => {
  try {
    // TODO: Get salarie from user
    const salarie = await prisma.salarie.findFirst()

    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }

    // TODO: Generate actual PDF
    const url = `/attestations/${salarie.id}.pdf`

    res.json({ url })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get solde conge
router.get('/solde-conge', async (req, res) => {
  try {
    // TODO: Calculate from actual data
    res.json({
      acquis: 25,
      pris: 10,
      restant: 15,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

