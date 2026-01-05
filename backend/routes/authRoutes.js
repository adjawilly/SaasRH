const express = require('express');
const router = express.Router();

// Routes d'authentification
router.post('/login', (req, res) => {
  res.status(200).json({ 
    message: 'Route de connexion - À implémenter',
    body: req.body 
  });
});

router.post('/register', (req, res) => {
  res.status(200).json({ 
    message: 'Route d\'inscription - À implémenter',
    body: req.body 
  });
});

router.post('/forgot-password', (req, res) => {
  res.status(200).json({ 
    message: 'Route de mot de passe oublié - À implémenter',
    body: req.body 
  });
});

router.get('/me', (req, res) => {
  res.status(200).json({ 
    message: 'Route de profil utilisateur - À implémenter'
  });
});

module.exports = router;

