# STEG - Plateforme Gestion Stagiaires

## Description
Plateforme digitale centralisee pour la gestion et le suivi des stagiaires a la STEG (Societe Tunisienne de l'Electricite et du Gaz).

## Architecture

```
steg_platform/
├── frontend/                 # Interface utilisateur (HTML/CSS/JS)
│   ├── index.html             # Page Login
│   ├── dashboard.html         # Tableau de bord
│   └── stagiaires.html        # Gestion des stagiaires
│
└── backend/                   # API REST (Node.js + Express + MongoDB)
    ├── server.js              # Point d'entree serveur
    ├── package.json           # Dependances
    ├── .env                   # Variables d'environnement
    ├── .env.example           # Exemple de configuration
    ├── seed.js                # Donnees de test
    ├── config/
    │   └── db.js              # Connexion MongoDB
    ├── models/
    │   ├── User.js            # Modele Utilisateur
    │   ├── Stagiaire.js       # Modele Stagiaire
    │   └── Activite.js        # Modele Activite
    ├── controllers/
    │   ├── authController.js  # Authentification
    │   └── stagiaireController.js  # CRUD Stagiaires
    ├── routes/
    │   ├── auth.js            # Routes auth
    │   └── stagiaires.js      # Routes stagiaires
    └── middleware/
        ├── auth.js            # JWT Protection
        └── errorHandler.js    # Gestion erreurs
```

## Technologies Utilisees

### Frontend
- HTML5 / CSS3
- Tailwind CSS (CDN)
- JavaScript Vanilla
- Chart.js (graphiques)
- Font Awesome (icones)

### Backend
- Node.js 18+
- Express.js 4.18+
- MongoDB 6.0+
- Mongoose 7.5+
- JWT (jsonwebtoken)
- bcryptjs (hashage mots de passe)
- CORS
- Morgan (logging)
- dotenv

### Outils
- VS Code (editeur)
- MongoDB Compass (GUI BD)
- Postman (test API)
- Git (versioning)

## Installation

### 1. Prerequis
- Node.js 18+ : https://nodejs.org
- MongoDB 6.0+ : https://mongodb.com
- MongoDB Compass (optionnel) : https://mongodb.com/compass

### 2. Cloner le projet
```bash
git clone <repo-url>
cd steg_platform/backend
```

### 3. Installer les dependances
```bash
npm install
```

### 4. Configuration
```bash
cp .env.example .env
# Modifier .env avec vos parametres
```

### 5. Lancer MongoDB
```bash
# Windows (si MongoDB est en service)
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 6. Seeder la base de donnees
```bash
npm run seed
```

### 7. Lancer le serveur
```bash
# Mode developpement (avec auto-reload)
npm run dev

# Mode production
npm start
```

Le serveur demarre sur : `http://localhost:5000`

## API Endpoints

### Authentification
| Methode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | /api/auth/register | Inscription | Public |
| POST | /api/auth/login | Connexion | Public |
| GET | /api/auth/me | Profil utilisateur | JWT |
| PUT | /api/auth/me | Modifier profil | JWT |

### Stagiaires
| Methode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | /api/stagiaires | Liste stagiaires | JWT |
| GET | /api/stagiaires/:id | Detail stagiaire | JWT |
| POST | /api/stagiaires | Creer stagiaire | JWT |
| PUT | /api/stagiaires/:id | Modifier stagiaire | JWT |
| DELETE | /api/stagiaires/:id | Supprimer stagiaire | Admin |
| GET | /api/stagiaires/stats/dashboard | Stats dashboard | JWT |

### Sante
| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/health | Verifier l'etat de l'API |

## Comptes de Test

| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@steg.tn | admin123 |
| Encadreur | encadreur@steg.tn | encadreur123 |

## Modeles de Donnees

### User
- nom, prenom, email, password, role (admin/encadreur/stagiaire)
- departement, telephone, avatar, actif, derniereConnexion

### Stagiaire
- nom, prenom, email, telephone, departement
- dateDebut, dateFin, statut, progression, note
- notes, encadreur, projet, universite, niveauEtude

### Activite
- type, description, stagiaire, utilisateur, details

## Securite
- JWT tokens avec expiration (7 jours)
- Mots de passe hashes avec bcrypt (12 rounds)
- CORS configure
- Validation des entrees avec express-validator
- Middleware de protection des routes
- Gestion centralisee des erreurs

## Scripts NPM

| Commande | Description |
|----------|-------------|
| `npm start` | Lancer en production |
| `npm run dev` | Lancer en developpement (nodemon) |
| `npm run seed` | Remplir la BD avec des donnees de test |

## Auteur
STEG Team - Projet PFE 2026
