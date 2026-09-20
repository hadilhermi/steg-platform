const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Stagiaire = require('./models/Stagiaire');
const Activite = require('./models/Activite');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Sample data
const users = [
  {
    nom: 'Admin',
    prenom: 'STEG',
    email: 'admin@steg.tn',
    password: 'admin123',
    role: 'admin',
    departement: 'IT',
    telephone: '+216 71 123 456'
  },
  {
    nom: 'Ben Salah',
    prenom: 'Mohamed',
    email: 'encadreur@steg.tn',
    password: 'encadreur123',
    role: 'encadreur',
    departement: 'Ingenierie',
    telephone: '+216 71 234 567'
  }
];

const stagiaires = [
  {
    nom: 'Trabelsi',
    prenom: 'Sara',
    email: 'sara.trabelsi@email.com',
    telephone: '+216 20 111 222',
    departement: 'Ingenierie',
    dateDebut: new Date('2026-01-15'),
    dateFin: new Date('2026-07-15'),
    statut: 'Actif',
    progression: 92,
    note: 18.5,
    notes: 'Excellente performance, tres motivee',
    projet: 'Optimisation reseau electrique',
    universite: 'INSAT',
    niveauEtude: 'Ingenieur'
  },
  {
    nom: 'Ben Ali',
    prenom: 'Ahmed',
    email: 'ahmed.benali@email.com',
    telephone: '+216 20 222 333',
    departement: 'Commercial',
    dateDebut: new Date('2026-02-01'),
    dateFin: new Date('2026-08-01'),
    statut: 'Actif',
    progression: 75,
    note: 17.2,
    notes: 'Bon travail en equipe',
    projet: 'Analyse marche energie',
    universite: 'ESSEC',
    niveauEtude: 'Master'
  },
  {
    nom: 'Gharbi',
    prenom: 'Leila',
    email: 'leila.gharbi@email.com',
    telephone: '+216 20 333 444',
    departement: 'RH',
    dateDebut: new Date('2026-03-01'),
    dateFin: new Date('2026-09-01'),
    statut: 'Actif',
    progression: 60,
    note: 16.8,
    notes: 'Apprentissage rapide',
    projet: 'Systeme gestion talents',
    universite: 'FSEGT',
    niveauEtude: 'Licence'
  },
  {
    nom: 'Mrad',
    prenom: 'Karim',
    email: 'karim.mrad@email.com',
    telephone: '+216 20 444 555',
    departement: 'Ingenierie',
    dateDebut: new Date('2026-06-01'),
    dateFin: new Date('2026-12-01'),
    statut: 'En attente',
    progression: 15,
    note: null,
    notes: 'Nouveau stagiaire, en periode d observation',
    projet: 'Maintenance predictive',
    universite: 'ENIT',
    niveauEtude: 'Ingenieur'
  },
  {
    nom: 'Jebali',
    prenom: 'Nadia',
    email: 'nadia.jebali@email.com',
    telephone: '+216 20 555 666',
    departement: 'Commercial',
    dateDebut: new Date('2025-12-01'),
    dateFin: new Date('2026-05-31'),
    statut: 'Termine',
    progression: 100,
    note: 15.9,
    notes: 'Stage termine avec succes',
    projet: 'Etude satisfaction client',
    universite: 'IHEC',
    niveauEtude: 'Master'
  },
  {
    nom: 'Karray',
    prenom: 'Mohamed',
    email: 'mohamed.karray@email.com',
    telephone: '+216 20 666 777',
    departement: 'Ingenierie',
    dateDebut: new Date('2025-11-01'),
    dateFin: new Date('2026-04-30'),
    statut: 'Termine',
    progression: 100,
    note: 17.0,
    notes: 'Excellent travail technique',
    projet: 'Smart Grid Tunis',
    universite: 'ENIT',
    niveauEtude: 'Ingenieur'
  }
];

const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Stagiaire.deleteMany();
    await Activite.deleteMany();
    console.log('Data cleared');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Assign encadreur to stagiaires
    const stagiairesWithEncadreur = stagiaires.map(s => ({
      ...s,
      encadreur: createdUsers[1]._id // encadreur
    }));

    const createdStagiaires = await Stagiaire.insertMany(stagiairesWithEncadreur);
    console.log(`${createdStagiaires.length} stagiaires created`);

    // Create activities
    const activities = [
      {
        type: 'ajout',
        description: 'Nouveau stagiaire ajoute: Ahmed Ben Ali',
        stagiaire: createdStagiaires[1]._id,
        utilisateur: createdUsers[0]._id
      },
      {
        type: 'validation',
        description: 'Rapport mensuel valide - Juin 2026',
        utilisateur: createdUsers[0]._id
      },
      {
        type: 'evaluation',
        description: 'Evaluation completee: Sara Trabelsi - Note: 18/20',
        stagiaire: createdStagiaires[0]._id,
        utilisateur: createdUsers[1]._id
      },
      {
        type: 'modification',
        description: 'Stage termine: Mohamed Karray - 6 mois',
        stagiaire: createdStagiaires[5]._id,
        utilisateur: createdUsers[0]._id
      }
    ];

    await Activite.insertMany(activities);
    console.log(`${activities.length} activities created`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('  Admin: admin@steg.tn / admin123');
    console.log('  Encadreur: encadreur@steg.tn / encadreur123');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(() => seedDB());