import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import nodemailer from 'nodemailer'

const router = express.Router()
const prisma = new PrismaClient()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, nom, prenom } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        profil: 'compte_salarie',
      },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, profil: user.profil },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({ token, user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, profil: user.profil } })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, profil: user.profil },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({ token, user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, profil: user.profil } })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Google OAuth
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return res.status(401).json({ message: 'Token Google invalide' })
    }

    let user = await prisma.user.findUnique({
      where: { googleId: payload.sub },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email!,
          nom: payload.family_name,
          prenom: payload.given_name,
          googleId: payload.sub,
          profil: 'compte_salarie',
        },
      })
    }

    const authToken = jwt.sign(
      { id: user.id, email: user.email, profil: user.profil },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.json({ token: authToken, user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, profil: user.profil } })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'Email non trouvé' })
    }

    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Réinitialisation de mot de passe',
      html: `
        <h2>Réinitialisation de mot de passe</h2>
        <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ce lien expire dans 1 heure.</p>
      `,
    })

    res.json({ message: 'Email de réinitialisation envoyé' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
})

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, nom: true, prenom: true, profil: true },
    })

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    res.json(user)
  } catch (error: any) {
    res.status(401).json({ message: 'Token invalide' })
  }
})

export default router

