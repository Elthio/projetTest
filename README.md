# Application de Gestion de Données

Cette application a été développée avec Symfony et React pour gérer l'importation, l'affichage et la modification de données.

## Fonctionnalités

- Import de données depuis un fichier externe
- Affichage des données dans un tableau paginé (10 lignes par page)
- Tri sur les colonnes
- Filtres personnalisés
- Opérations CRUD (Création, Lecture, Mise à jour, Suppression)

## Prérequis

- PHP 8.x
- Symfony 6.x
- Node.js
- MySQL/MariaDB
- Composer
- Yarn/npm

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_PROJET]
```

2. Installer les dépendances PHP :
```bash
composer install
```

3. Installer les dépendances JavaScript :
```bash
yarn install
# ou
npm install
```

4. Configurer la base de données dans `.env` :
```
DATABASE_URL="mysql://[user]:[password]@127.0.0.1:3306/[database]"
```

5. Créer la base de données et effectuer les migrations :
```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

6. Lancer le serveur de développement :
```bash
symfony server:start
yarn dev-server
```

## Structure du Projet

- `src/Controller/` : Contrôleurs Symfony
- `src/Entity/` : Entités Doctrine
- `src/Repository/` : Repositories Doctrine
- `assets/` : Code React et styles
- `templates/` : Templates Twig

## Optimisations

- Pagination côté serveur pour une meilleure performance
- Mise en cache des requêtes fréquentes
- Indexation des colonnes de tri dans la base de données
- Validation des données côté client et serveur

## Sécurité

- Validation des entrées utilisateur
- Protection CSRF
- Échappement des données affichées
- Gestion sécurisée des fichiers importés 