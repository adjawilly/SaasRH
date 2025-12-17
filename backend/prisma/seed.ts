import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Créer un administrateur
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@saansrh.com' },
    update: {},
    create: {
      email: 'admin@saansrh.com',
      password: adminPassword,
      nom: 'Admin',
      prenom: 'Système',
      profil: 'administrateur',
    },
  })

  // Créer un compte RH
  const rhPassword = await bcrypt.hash('rh123', 10)
  const rh = await prisma.user.upsert({
    where: { email: 'rh@saansrh.com' },
    update: {},
    create: {
      email: 'rh@saansrh.com',
      password: rhPassword,
      nom: 'Dupont',
      prenom: 'Marie',
      profil: 'compte_rh',
    },
  })

  // Créer un compte salarié
  const salariePassword = await bcrypt.hash('salarie123', 10)
  const salarie = await prisma.user.upsert({
    where: { email: 'salarie@saansrh.com' },
    update: {},
    create: {
      email: 'salarie@saansrh.com',
      password: salariePassword,
      nom: 'Martin',
      prenom: 'Jean',
      profil: 'compte_salarie',
    },
  })

  // Créer un salarié associé au compte salarié
  await prisma.salarie.upsert({
    where: { matricule: 'EMP000001' },
    update: {},
    create: {
      matricule: 'EMP000001',
      nom: 'Martin',
      prenom: 'Jean',
      email: 'salarie@saansrh.com',
      telephone: '+33 6 12 34 56 78',
      fonction: 'Développeur',
      poste: 'Développeur Full Stack',
      direction: 'Direction Technique',
      dateEmbauche: new Date('2023-01-15'),
      statut: 'actif',
      userId: salarie.id,
    },
  })

  // Créer quelques données de paramétrage
  await prisma.competence.upsert({
    where: { libelle: 'JavaScript' },
    update: {},
    create: { libelle: 'JavaScript' },
  })

  await prisma.competence.upsert({
    where: { libelle: 'React' },
    update: {},
    create: { libelle: 'React' },
  })

  await prisma.competence.upsert({
    where: { libelle: 'Node.js' },
    update: {},
    create: { libelle: 'Node.js' },
  })

  await prisma.domaine.upsert({
    where: { libelle: 'Informatique' },
    update: {},
    create: { libelle: 'Informatique' },
  })

  await prisma.domaine.upsert({
    where: { libelle: 'Ressources Humaines' },
    update: {},
    create: { libelle: 'Ressources Humaines' },
  })

  await prisma.fonction.upsert({
    where: { libelle: 'Développeur' },
    update: {},
    create: { libelle: 'Développeur' },
  })

  await prisma.fonction.upsert({
    where: { libelle: 'Chef de Projet' },
    update: {},
    create: { libelle: 'Chef de Projet' },
  })

  await prisma.niveauEtude.upsert({
    where: { libelle: 'Bac+3' },
    update: {},
    create: { libelle: 'Bac+3' },
  })

  await prisma.niveauEtude.upsert({
    where: { libelle: 'Bac+5' },
    update: {},
    create: { libelle: 'Bac+5' },
  })

  await prisma.profil.upsert({
    where: { libelle: 'administrateur' },
    update: {},
    create: { libelle: 'administrateur' },
  })

  await prisma.profil.upsert({
    where: { libelle: 'compte_rh' },
    update: {},
    create: { libelle: 'compte_rh' },
  })

  await prisma.profil.upsert({
    where: { libelle: 'compte_salarie' },
    update: {},
    create: { libelle: 'compte_salarie' },
  })

  console.log('✅ Comptes de test créés avec succès !')
  console.log('\n📋 Comptes disponibles :')
  console.log('\n👤 Administrateur:')
  console.log('   Email: admin@saansrh.com')
  console.log('   Mot de passe: admin123')
  console.log('   Accès: Tous les modules')
  console.log('\n👤 Compte RH:')
  console.log('   Email: rh@saansrh.com')
  console.log('   Mot de passe: rh123')
  console.log('   Accès: Modules 1 à 7')
  console.log('\n👤 Compte Salarié:')
  console.log('   Email: salarie@saansrh.com')
  console.log('   Mot de passe: salarie123')
  console.log('   Accès: Modules 3 à 6')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

