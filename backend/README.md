# API de Gestion de Véhicules

Cette API permet de gérer les véhicules, clients, ventes et autres données liées à un parc automobile.

## Installation

```bash
# Cloner le dépôt
git clone <repository-url>

# Installer les dépendances
composer install

# Configurer la base de données dans .env
# DATABASE_URL="mysql://user:password@127.0.0.1:3306/db_name"

# Créer la base de données
php bin/console doctrine:database:create

# Créer le schéma
php bin/console doctrine:schema:create

# Lancer le serveur de développement
symfony serve
```

## Réinitialisation de la base de données

Un script est disponible pour réinitialiser la base de données :

```bash
./reset-db.sh
```

## Endpoints API

L'API est accessible à l'adresse `/api`. La documentation complète est disponible à l'adresse `/api/docs`.

### Véhicules

- `GET /api/vehicules` - Liste tous les véhicules (avec pagination)
- `GET /api/vehicules/{id}` - Récupère un véhicule spécifique
- `POST /api/vehicules` - Crée un nouveau véhicule
- `PUT /api/vehicules/{id}` - Met à jour un véhicule existant
- `DELETE /api/vehicules/{id}` - Supprime un véhicule
- `GET /api/vehicules/search` - Recherche avancée de véhicules avec filtres multiples

### Clients

- `GET /api/clients` - Liste tous les clients (avec pagination)
- `GET /api/clients/{id}` - Récupère un client spécifique
- `POST /api/clients` - Crée un nouveau client
- `PUT /api/clients/{id}` - Met à jour un client existant
- `DELETE /api/clients/{id}` - Supprime un client
- `GET /api/clients/search` - Recherche avancée de clients avec filtres multiples

### Marques

- `GET /api/marques` - Liste des marques
- `GET /api/marques/{id}` - Détails d'une marque
- `POST /api/marques` - Créer une marque
- `PUT /api/marques/{id}` - Mettre à jour une marque
- `DELETE /api/marques/{id}` - Supprimer une marque

### Modèles

- `GET /api/modeles` - Liste des modèles
- `GET /api/modeles/{id}` - Détails d'un modèle
- `POST /api/modeles` - Créer un modèle
- `PUT /api/modeles/{id}` - Mettre à jour un modèle
- `DELETE /api/modeles/{id}` - Supprimer un modèle

### Énergies

- `GET /api/energies` - Liste des énergies
- `GET /api/energies/{id}` - Détails d'une énergie
- `POST /api/energies` - Créer une énergie
- `PUT /api/energies/{id}` - Mettre à jour une énergie
- `DELETE /api/energies/{id}` - Supprimer une énergie

### Statistiques

- `GET /api/stats/dashboard` - Statistiques générales (nombre de véhicules, clients, ventes, etc.)

### Import

- `POST /api/import/xlsx` - Importer des données depuis un fichier XLSX

### Ventes

- `GET /api/ventes` - Liste toutes les ventes (avec pagination)
- `GET /api/ventes/{id}` - Récupère une vente spécifique
- `POST /api/ventes` - Crée une nouvelle vente
- `PUT /api/ventes/{id}` - Met à jour une vente existante
- `DELETE /api/ventes/{id}` - Supprime une vente
- `GET /api/ventes/search` - Recherche avancée de ventes avec filtres multiples

## Filtres et Tri

Tous les endpoints de liste supportent les filtres et le tri :

- Filtres : `?property=value`
- Tri : `?order[property]=asc|desc`
- Pagination : `?page=1&itemsPerPage=10`

Exemple : `/api/vehicules?marque.libelle=Renault&order[dateMiseCirculation]=desc`

## Authentification

L'API ne nécessite pas d'authentification pour le moment.

## Développement

### Structure du projet

- `src/Entity` - Entités Doctrine
- `src/Repository` - Repositories Doctrine
- `src/Controller` - Contrôleurs
- `src/Service` - Services
- `config` - Configuration

### Tests

  ```bash
php bin/phpunit
```

### Recherche avancée

L'API propose des endpoints de recherche avancée pour les entités principales :

#### Recherche de véhicules
`GET /search/vehicules`

Paramètres de recherche :
- `marque` - Filtre par marque (correspondance exacte)
- `modele` - Filtre par modèle (correspondance partielle)
- `energie` - Filtre par type d'énergie (correspondance exacte)
- `dateMin` - Date de mise en circulation minimum (format YYYY-MM-DD)
- `dateMax` - Date de mise en circulation maximum (format YYYY-MM-DD)
- `immatriculation` - Filtre par immatriculation (correspondance partielle)
- `vin` - Filtre par numéro VIN (correspondance partielle)
- `clientNom` - Filtre par nom de client (correspondance partielle)

Paramètres de pagination et tri :
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10, max: 50)
- `sortBy` - Champ de tri (id, immatriculation, vin, dateMiseCirculation, marque, modele, energie, clientNom)
- `sortOrder` - Ordre de tri (ASC ou DESC, défaut: DESC)

#### Recherche de clients
`GET /search/clients`

Paramètres de recherche :
- `nom` - Filtre par nom (correspondance partielle)
- `civilite` - Filtre par civilité (correspondance exacte)
- `codePostal` - Filtre par code postal (correspondance partielle)
- `ville` - Filtre par ville (correspondance partielle)
- `email` - Filtre par email (correspondance partielle)
- `telephone` - Filtre par téléphone (correspondance partielle)
- `estProprietaireActuel` - Filtre par statut de propriétaire (true ou false)

Paramètres de pagination et tri :
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10, max: 50)
- `sortBy` - Champ de tri (id, nom, civilite, ville, codePostal, email)
- `sortOrder` - Ordre de tri (ASC ou DESC, défaut: DESC)

#### Recherche de ventes
`GET /search/ventes`

Paramètres de recherche :
- `numeroDossier` - Filtre par numéro de dossier (correspondance partielle)
- `typeVnVo` - Filtre par type VN/VO (correspondance exacte)
- `clientNom` - Filtre par nom de client (correspondance partielle)
- `vehiculeVin` - Filtre par VIN du véhicule (correspondance partielle)
- `vehiculeImmatriculation` - Filtre par immatriculation du véhicule (correspondance partielle)
- `vendeurNom` - Filtre par nom du vendeur (correspondance partielle)
- `dateAchatMin` - Date d'achat minimum (format YYYY-MM-DD)
- `dateAchatMax` - Date d'achat maximum (format YYYY-MM-DD)
- `dateLivraisonMin` - Date de livraison minimum (format YYYY-MM-DD)
- `dateLivraisonMax` - Date de livraison maximum (format YYYY-MM-DD)

Paramètres de pagination et tri :
- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10, max: 50)
- `sortBy` - Champ de tri (id, numeroDossier, typeVnVo, dateAchat, dateLivraison, clientNom, vehiculeVin, vehiculeImmatriculation, vendeurNom)
- `sortOrder` - Ordre de tri (ASC ou DESC, défaut: DESC) 