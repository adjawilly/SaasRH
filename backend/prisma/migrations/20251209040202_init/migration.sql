-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nom" TEXT,
    "prenom" TEXT,
    "profil" TEXT NOT NULL DEFAULT 'compte_salarie',
    "googleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Salarie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matricule" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "fonction" TEXT NOT NULL,
    "poste" TEXT,
    "direction" TEXT,
    "dateEmbauche" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Salarie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Offre" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelleOffre" TEXT NOT NULL,
    "typeOffre" TEXT NOT NULL,
    "domaineActivite" TEXT NOT NULL,
    "competences" TEXT NOT NULL,
    "niveauEtude" TEXT NOT NULL,
    "datePublication" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateEffet" DATETIME NOT NULL,
    "dateExpiration" DATETIME NOT NULL,
    "lienOffre" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "competences" TEXT NOT NULL,
    "niveauEtude" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "commentaire" TEXT,
    "cvUrl" TEXT,
    "lmUrl" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "offreId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Candidature_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "noteTechnique" REAL NOT NULL,
    "noteCommunication" REAL NOT NULL,
    "noteMotivation" REAL NOT NULL,
    "noteCulture" REAL NOT NULL,
    "commentaire" TEXT,
    "candidatureId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notation_candidatureId_fkey" FOREIGN KEY ("candidatureId") REFERENCES "Candidature" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "nomFichier" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Affectation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poste" TEXT NOT NULL,
    "dateAffectation" DATETIME NOT NULL,
    "direction" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Affectation_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Demande" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "motif" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Demande_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Objectif" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "progression" REAL NOT NULL DEFAULT 0,
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Objectif_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "note" REAL,
    "commentaire" TEXT,
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evaluation_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'planifie',
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Formation_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EvaluationFormation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "note" REAL,
    "commentaire" TEXT,
    "formationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EvaluationFormation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "HeureSupplementaire" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "heures" REAL NOT NULL,
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HeureSupplementaire_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TempsTravail" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "heures" REAL NOT NULL,
    "salarieId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TempsTravail_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "Salarie" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Competence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Domaine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Fonction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "NiveauEtude" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Profil" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "libelle" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Salarie_matricule_key" ON "Salarie"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Salarie_email_key" ON "Salarie"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Salarie_userId_key" ON "Salarie"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Offre_lienOffre_key" ON "Offre"("lienOffre");

-- CreateIndex
CREATE UNIQUE INDEX "Notation_candidatureId_key" ON "Notation"("candidatureId");

-- CreateIndex
CREATE UNIQUE INDEX "Competence_libelle_key" ON "Competence"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "Domaine_libelle_key" ON "Domaine"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "Fonction_libelle_key" ON "Fonction"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "NiveauEtude_libelle_key" ON "NiveauEtude"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "Profil_libelle_key" ON "Profil"("libelle");
