import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import recrutementRoutes from './routes/recrutement'
import gestionAdminRoutes from './routes/gestion-admin'
import demandeAdminRoutes from './routes/demande-admin'
import evaluationRoutes from './routes/evaluation'
import gestionTempsRoutes from './routes/gestion-temps'
import formationRoutes from './routes/formation'
import parametrageRoutes from './routes/parametrage'
import dashboardRoutes from './routes/dashboard'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/recrutement', recrutementRoutes)
app.use('/api/gestion-admin', gestionAdminRoutes)
app.use('/api/demande-admin', demandeAdminRoutes)
app.use('/api/evaluation', evaluationRoutes)
app.use('/api/gestion-temps', gestionTempsRoutes)
app.use('/api/formation', formationRoutes)
app.use('/api/parametrage', parametrageRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SaansRH API is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

