import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireProfil } from '../middleware/auth'

const router = express.Router()
const prisma = new PrismaClient()

router.use(authenticate)
router.use(requireProfil('administrateur'))

// Competences
router.get('/competences', async (req, res) => {
  try {
    const competences = await prisma.competence.findMany()
    res.json(competences)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/competences', async (req, res) => {
  try {
    const { libelle } = req.body
    const competence = await prisma.competence.create({ data: { libelle } })
    res.json(competence)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/competences/:id', async (req, res) => {
  try {
    const { libelle } = req.body
    const competence = await prisma.competence.update({
      where: { id: req.params.id },
      data: { libelle },
    })
    res.json(competence)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/competences/:id', async (req, res) => {
  try {
    await prisma.competence.delete({ where: { id: req.params.id } })
    res.json({ message: 'Compétence supprimée' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Domaines
router.get('/domaines', async (req, res) => {
  try {
    const domaines = await prisma.domaine.findMany()
    res.json(domaines)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/domaines', async (req, res) => {
  try {
    const { libelle } = req.body
    const domaine = await prisma.domaine.create({ data: { libelle } })
    res.json(domaine)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/domaines/:id', async (req, res) => {
  try {
    const { libelle } = req.body
    const domaine = await prisma.domaine.update({
      where: { id: req.params.id },
      data: { libelle },
    })
    res.json(domaine)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/domaines/:id', async (req, res) => {
  try {
    await prisma.domaine.delete({ where: { id: req.params.id } })
    res.json({ message: 'Domaine supprimé' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Fonctions
router.get('/fonctions', async (req, res) => {
  try {
    const fonctions = await prisma.fonction.findMany()
    res.json(fonctions)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/fonctions', async (req, res) => {
  try {
    const { libelle } = req.body
    const fonction = await prisma.fonction.create({ data: { libelle } })
    res.json(fonction)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/fonctions/:id', async (req, res) => {
  try {
    const { libelle } = req.body
    const fonction = await prisma.fonction.update({
      where: { id: req.params.id },
      data: { libelle },
    })
    res.json(fonction)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/fonctions/:id', async (req, res) => {
  try {
    await prisma.fonction.delete({ where: { id: req.params.id } })
    res.json({ message: 'Fonction supprimée' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Niveaux etude
router.get('/niveaux-etude', async (req, res) => {
  try {
    const niveaux = await prisma.niveauEtude.findMany()
    res.json(niveaux)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/niveaux-etude', async (req, res) => {
  try {
    const { libelle } = req.body
    const niveau = await prisma.niveauEtude.create({ data: { libelle } })
    res.json(niveau)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/niveaux-etude/:id', async (req, res) => {
  try {
    const { libelle } = req.body
    const niveau = await prisma.niveauEtude.update({
      where: { id: req.params.id },
      data: { libelle },
    })
    res.json(niveau)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/niveaux-etude/:id', async (req, res) => {
  try {
    await prisma.niveauEtude.delete({ where: { id: req.params.id } })
    res.json({ message: 'Niveau d\'étude supprimé' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Profils
router.get('/profils', async (req, res) => {
  try {
    const profils = await prisma.profil.findMany()
    res.json(profils)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/profils', async (req, res) => {
  try {
    const { libelle } = req.body
    const profil = await prisma.profil.create({ data: { libelle } })
    res.json(profil)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/profils/:id', async (req, res) => {
  try {
    const { libelle } = req.body
    const profil = await prisma.profil.update({
      where: { id: req.params.id },
      data: { libelle },
    })
    res.json(profil)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

router.delete('/profils/:id', async (req, res) => {
  try {
    await prisma.profil.delete({ where: { id: req.params.id } })
    res.json({ message: 'Profil supprimé' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

