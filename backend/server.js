require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Import de la configuration de la base de données
const db = require('./config/db');

// Import des routes
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware de sécurité
app.use(helmet());

app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:3000', 
      'http://localhost:5173',
      'http://localhost:5000', // API elle-même
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));


// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes publiques
app.use('/api/auth', authRoutes);

// Route de santé
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Serveur backend Ferme actif ',
    timestamp: new Date().toISOString()
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    path: req.originalUrl 
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(' Erreur serveur:', err);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Quelque chose s\'est mal passé'
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(` Serveur RBAQ démarré sur le port ${PORT}`);
  console.log(` Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL: http://localhost:${PORT}`);
});