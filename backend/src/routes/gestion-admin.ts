import express from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticate, requireProfil } from '../middleware/auth'
import multer from 'multer'
import * as XLSX from 'xlsx'

const router = express.Router()
const prisma = new PrismaClient()
const upload = multer({ dest: 'uploads/' })

router.use(authenticate)
router.use(requireProfil('compte_rh', 'administrateur'))

// Get all salaries
router.get('/salaries', async (req, res) => {
  try {
    const salaries = await prisma.salarie.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(salaries)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Create salarie
router.post('/salaries', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, fonction, dateEmbauche } = req.body

    // Generate matricule
    const count = await prisma.salarie.count()
    const matricule = `EMP${String(count + 1).padStart(6, '0')}`

    const salarie = await prisma.salarie.create({
      data: {
        matricule,
        nom,
        prenom,
        email,
        telephone,
        fonction,
        dateEmbauche: new Date(dateEmbauche),
      },
    })

    res.json(salarie)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Load from Excel
router.post('/salaries/charger', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fichier manquant' })
    }

    const workbook = XLSX.readFile(req.file.path)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(sheet)

    let count = 0
    for (const row of data as any[]) {
      const countSalaries = await prisma.salarie.count()
      const matricule = `EMP${String(countSalaries + 1).padStart(6, '0')}`

      await prisma.salarie.create({
        data: {
          matricule,
          nom: row.nom || '',
          prenom: row.prenom || '',
          email: row.email || '',
          telephone: row.telephone,
          fonction: row.fonction || '',
          dateEmbauche: new Date(row.dateEmbauche || Date.now()),
        },
      })
      count++
    }

    res.json({ count, message: `${count} salarié(s) chargé(s)` })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get salarie by id
router.get('/salaries/:id', async (req, res) => {
  try {
    const salarie = await prisma.salarie.findUnique({
      where: { id: req.params.id },
    })
    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }
    res.json(salarie)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get documents
router.get('/salaries/:id/documents', async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: { salarieId: req.params.id },
    })
    res.json(documents)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Add document
router.post('/salaries/:id/documents', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fichier manquant' })
    }

    const { type } = req.body
    const document = await prisma.document.create({
      data: {
        type,
        nomFichier: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        salarieId: req.params.id,
      },
    })

    res.json(document)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Delete document
router.delete('/salaries/:id/documents/:docId', async (req, res) => {
  try {
    await prisma.document.delete({
      where: { id: req.params.docId },
    })
    res.json({ message: 'Document supprimé' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Affectation
router.post('/salaries/:id/affectation', async (req, res) => {
  try {
    const { poste, dateAffectation, direction, statut } = req.body

    const affectation = await prisma.affectation.create({
      data: {
        poste,
        dateAffectation: new Date(dateAffectation),
        direction,
        statut,
        salarieId: req.params.id,
      },
    })

    await prisma.salarie.update({
      where: { id: req.params.id },
      data: { poste, direction, statut },
    })

    res.json(affectation)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Generate fiche poste
router.post('/salaries/:id/fiche-poste', async (req, res) => {
  try {
    const { format } = req.body
    const salarie = await prisma.salarie.findUnique({
      where: { id: req.params.id },
    })

    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }

    // TODO: Generate actual PDF/Excel/Word file
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=fiche-poste-${salarie.matricule}.${format === 'excel' ? 'xlsx' : format === 'word' ? 'docx' : 'pdf'}`)
    res.send('Fiche de poste content')
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get dossier salarie
router.get('/salaries/:id/dossier', async (req, res) => {
  try {
    const salarie = await prisma.salarie.findUnique({
      where: { id: req.params.id },
      include: {
        documents: true,
        affectations: { orderBy: { createdAt: 'desc' } },
        demandes: { orderBy: { createdAt: 'desc' } },
        objectifs: true,
        evaluations: true,
        formations: true,
      },
    })

    if (!salarie) {
      return res.status(404).json({ message: 'Salarié non trouvé' })
    }

    const historique = [
      ...salarie.affectations.map(a => ({
        type: 'Affectation',
        date: a.dateAffectation,
        description: `${a.poste} - ${a.direction}`,
      })),
      ...salarie.demandes.map(d => ({
        type: d.type,
        date: d.dateDebut,
        description: d.motif || '',
      })),
    ]

    res.json({
      ...salarie,
      historique,
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

export default router

