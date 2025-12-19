# Système de Mocks - Frontend SaasRH

## Vue d'ensemble

Le frontend a été réorganisé pour fonctionner de manière indépendante du backend grâce à un système de mocks complet. Tous les appels API sont maintenant gérés par un service mock qui simule le comportement du backend.

## Structure

```
frontend/src/
├── api/
│   ├── config.ts          # Configuration pour activer/désactiver les mocks
│   ├── index.ts           # Point d'entrée unique (exporte mockApi ou axios)
│   └── mockApi.ts         # Service API mock qui simule axios
└── mocks/
    └── data/
        ├── auth.ts                # Données mockées pour l'authentification
        ├── dashboard.ts           # Données mockées pour le dashboard
        ├── recrutement.ts         # Données mockées pour le recrutement
        ├── parametrage.ts         # Données mockées pour le paramétrage
        ├── gestion-admin.ts       # Données mockées pour la gestion admin
        ├── demande-admin.ts      # Données mockées pour les demandes admin
        ├── evaluation.ts         # Données mockées pour l'évaluation
        ├── formation.ts          # Données mockées pour la formation
        └── gestion-temps.ts       # Données mockées pour la gestion du temps
```

## Utilisation

### Activer/Désactiver les mocks

Dans `src/api/config.ts`, modifiez la variable `USE_MOCK_API` :

```typescript
export const USE_MOCK_API = true  // Active les mocks
export const USE_MOCK_API = false // Utilise le backend réel
```

### Utilisation dans les composants

Tous les composants utilisent maintenant `api` au lieu de `axios` directement :

```typescript
import api from '../api'  // ou '../api' selon la profondeur du fichier

// GET
const response = await api.get('/api/dashboard/stats')
const data = response.data

// POST
const response = await api.post('/api/auth/login', { email, password })

// PUT
const response = await api.put('/api/recrutement/offres/1', data)

// DELETE
const response = await api.delete('/api/parametrage/competences/1')
```

## Données mockées

### Authentification

Comptes de test disponibles :
- **Admin** : `admin@saansrh.com` / `password123`
- **RH** : `rh@saansrh.com` / `password123`
- **Salarié** : `salarie@saansrh.com` / `password123`

### Modules mockés

Tous les modules sont entièrement mockés avec des données réalistes :
- ✅ Authentification (login, register, Google OAuth, mot de passe oublié)
- ✅ Dashboard (statistiques)
- ✅ Recrutement (offres, candidatures, notation)
- ✅ Paramétrage (CRUD pour tous les paramètres)
- ✅ Gestion Admin (salariés, documents, affectations)
- ✅ Demande Admin (absences, congés, attestations)
- ✅ Évaluation (objectifs, auto-évaluation, cartographie)
- ✅ Formation (plans, historique, évaluations)
- ✅ Gestion Temps (heures supplémentaires, suivi temps)

## Avantages

1. **Indépendance** : Le frontend fonctionne sans backend
2. **Développement rapide** : Pas besoin d'attendre le backend
3. **Tests** : Facilite les tests et le développement UI
4. **Réversibilité** : Facile de reconnecter au backend réel

## Reconnecter au backend réel

Pour reconnecter au backend réel :

1. Modifiez `src/api/config.ts` :
   ```typescript
   export const USE_MOCK_API = false
   ```

2. Assurez-vous que le backend est démarré et accessible

3. Vérifiez que les URLs du backend sont correctes dans votre configuration

## Notes importantes

- Les mocks simulent des délais réseau (200-500ms) pour un comportement réaliste
- Les données sont stockées en mémoire et seront réinitialisées au rechargement de la page
- Les fichiers uploadés (FormData) sont simulés mais ne sont pas réellement stockés
- Les tokens JWT sont simulés avec un format simple : `mock_token_{userId}_{timestamp}`

## Personnalisation

Pour ajouter ou modifier des données mockées, éditez les fichiers dans `src/mocks/data/`.

Pour ajouter de nouvelles routes mockées, modifiez `src/api/mockApi.ts`.

