# GroupFormer

**Projet de fin d’études — Efrei Paris**

GroupFormer est une plateforme web dédiée à la **formation de groupes pour des projets académiques**. Elle permet aux étudiants de créer leur profil, de publier et consulter des annonces, et de candidater à des groupes en fonction de leurs compétences et centres d’intérêt.

L’objectif du projet est de **simplifier la recherche de partenaires et de favoriser la constitution de groupes équilibrés**.

## Fonctionnalités

### 👤 Gestion des utilisateurs

* Création de compte pour les administrateurs.
* Import de la liste des étudiants via un fichier CSV par l’administrateur.
* Authentification via une adresse email scolaire ou professionnelle.
* Gestion des profils étudiants.
* Ajout des compétences et centres d’intérêt.

### 📢 Gestion des annonces

* Création d’annonces pour rechercher des membres.
* Consultation des annonces disponibles.
* Définition des compétences recherchées et du nombre de places disponibles.

### 👥 Formation des groupes

* Candidature des étudiants aux groupes.
* Recommandation des projets en fonction des compétences et centres d’intérêt renseignés dans le profil.
* Affichage prioritaire des projets correspondant au profil de l’étudiant.

### 📊 Statistiques

Des tableaux de bord permettent de suivre différents indicateurs, notamment :

* Nombre d’étudiants sans groupe.
* Répartition des étudiants par majeure.
* Répartition des compétences.

## Technologies utilisées

### Frontend

* **Angular** — Développement de l'interface web
* **Bootstrap** — Design et composants d’interface
* **Chart.js** — Visualisation des statistiques

### Backend

* **Python / Flask** — Développement du backend et de l'API REST
* **SQLAlchemy** — Interaction avec la base de données

### Base de données

* **PostgreSQL** — Système de gestion de base de données

### Outils

* **Git / GitHub** — Versioning et gestion du code
* **Figma** — Conception des maquettes et de l’interface

## Objectifs

GroupFormer vise à :

* **Gagner du temps** dans la recherche de partenaires.
* **Favoriser des groupes équilibrés** grâce à la complémentarité des compétences.
* **Faciliter la mise en relation** entre étudiants.
* **Proposer des projets pertinents** en fonction du profil de chaque étudiant.


## Équipe

| Rôle                     | Membre            | Responsabilités                                                                                       |
| ------------------------ | ----------------- | ----------------------------------------------------------------------------------------------------- |
| **Frontend**             | Laura Saada       | Conception de l’interface utilisateur (UI/UX), choix des intitulés, design et expérience utilisateur. |
| **Backend**              | Guillaume Clavier | Développement des méthodes backend, intégration avec la base de données et gestion des API.           |
| **Statistiques**         | Clément Guillaux  | Développement de la page statistique, analyse des besoins et étude de l’état de l’art.                |
| **Recherche et analyse** | Geoffrey Lasik    | Consultation des besoins, interviews utilisateurs, étude de marché et analyse concurrentielle.        |
| **Base de données**      | Glory Chicate     | Création de la base de données, architecture de l’infrastructure et choix des technologies.           |
| **Gestion de projet**    | Robin Lucas       | Coordination de l’équipe, gestion des délais, suivi du projet et communication externe.               |
