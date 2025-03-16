# Application de Gestion de Voitures

Cette application React permet de visualiser et gérer les données de voitures à partir d'une base de données SQL.

## Structure de la Base de Données

L'application est basée sur une base de données avec les tables suivantes :
- LibelleCivilite
- TypeProspect
- proprio
- energie
- TypeVentes
- TypeVehicule
- voiture
- ficheVente
- compteAffaire
- compteEvenement
- OrigineEvenement
- ficheTechniqueVoiture

## Installation

1. Assurez-vous d'avoir Node.js installé sur votre machine (version 14.0.0 ou supérieure recommandée)
2. Clonez ce dépôt
3. Installez les dépendances :

```bash
npm install
```

## Démarrage de l'application

Pour démarrer l'application en mode développement :

```bash
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Fonctionnalités

- Barre de navigation affichant toutes les tables de la base de données
- Interface utilisateur réactive et moderne
- Structure prête à être étendue pour ajouter des fonctionnalités CRUD pour chaque table

## Technologies utilisées

- React 18
- CSS moderne
- Structure de projet modulaire
