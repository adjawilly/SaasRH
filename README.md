# SaasRH
Application Gestion administrative RH

Je veux que tu creer une application Saas avec les 8 Modules ci-dessous ainsi que les fonctionnalités contenues dans ces modules. Dans les parenthèses se trouvent certains détails spécifiques au Module ou à la fonctionnalité rattachée au Module. Dans les accolades se trouvent certains détails.
Propose moi une belle couleur dégradée vert bleue.
Creer le frontend en react JS avec vite.

1)Recrutement 
1.1. Publier offre (libelleOffre, typeOffre{CDD/CDI/Stage}, Domaine activité, compétences, niveau etude, date_publication, date_effet, date_expiration, lien_Offre {ce champ est généré lors de la creation de l'offre, et est un lien public accessibe à tous les candidats qui souhaitent postuler}) 
1.2. Depot de candidatures depuis le lien_Offre (nom, prenoms, domaine, compétences, niveau etude, joindre CV, joindre LM, genre, commentaire) 
1.3. Preselection candidature (selon les criteres de selection Domaine, compétences, niveau etude) 
1.4. Notation à l'entretien 
1.5. Génération Contrat de travail 
1.6. Onboarding digital

2)Gestion administratives 
2.1. Création salarié (Génération matricule, fonction, ect..) 
2.2. Chargement de salarié (charger depuis un fichier Excel) 
2.3. Gestion documents salariés (ajout de pièce ou document pour les salariés) 
2.4. Affectation salarié (Poste, date affectation, Direction, statut actif/inactif) 
2.5. Génération Fiche de Poste (format pdf, format excel, format word) 
2.6. Dossier Salarié (toutes les infos possible sur le salarie)

3)Demande administratives 
3.1. Demande d'absences 
3.2. Demande de congé 
3.3. Demande attestation de Travail 
3.4. Solde congé en temps reel

4)Évaluation & Compétences 
4.1. Fixation des objectifs 
4.2. Auto-evaluation 
4.3. Cartographie des compétences

5)Gestion des temps et activités 
5.1. Suivi temps 
5.2. Heure supplementaire

6)Formation 
6.1. Elaboration Plan de formation 
6.2. Historique plan de formation 
6.3. Evaluation à chaud/froid

7)Tableau de bord (KPI pour tous les modules)

8)Paramétrage 
8.1. CRUD compétences 
8.2. CRUD Domaines activités 
8.3. CRUD Fonction 
8.4. CRUD niveau Etude 
8.5. CRUD Profil (administrateur {a accès à tous les modules}, compte RH{a accès aux modules de 1 à 7}, compte salarié {a accès aux modules 3 à 6})

Authentification
Pour la gestion de l'Authentification, permet la creation de compte avec google et egalement le choix de le faire avec nom et prenoms. rajoute l'option mot de passe oublié et notification mail

Compte
Creer des comptes qui permettent de tester l'application

Fais le backend avec NodeJS Express et le SGBD avec SQLite et ORM prisma.

