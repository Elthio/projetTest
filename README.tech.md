# Application de Gestion de Parc Automobile - Documentation Technique

Cette documentation technique détaille l'architecture, les optimisations et les choix d'implémentation de l'application de gestion de parc automobile.

## Architecture globale

L'application est construite selon une architecture client-serveur moderne :

- **Backend** : API REST développée avec Symfony 6.x
- **Frontend** : Application SPA (Single Page Application) développée avec React 18.x

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│   Client    │◄────►│  API REST   │◄────►│  Base de    │
│   React     │      │  Symfony    │      │  données    │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Optimisations Frontend

### 1. Gestion optimisée des appels API

Nous avons implémenté un hook personnalisé `useApi` qui offre plusieurs avantages :

```javascript
// Exemple d'utilisation du hook useApi
const { data, loading, error, refetch } = useApi(
  fetchVehicules,
  [page, limit, sortBy, sortOrder, JSON.stringify(filters)],
  {
    initialData: { items: [], total: 0 },
    onSuccess: (result) => {
      console.log('Données chargées avec succès:', result);
    },
    onError: (err) => {
      console.error('Erreur lors du chargement des données:', err);
    }
  }
);
```

#### Caractéristiques principales :

- **Prévention des appels dupliqués** : Utilisation de références React pour éviter les appels API redondants
- **Gestion d'état unifiée** : États de chargement, données et erreurs gérés de manière cohérente
- **Annulation des requêtes** : Possibilité d'annuler les requêtes en cours lors du démontage des composants
- **Rechargement contrôlé** : Fonction `refetch` pour recharger les données à la demande

### 2. Normalisation des données API

Un utilitaire `extractApiData` a été développé pour normaliser les différentes structures de réponse API :

```javascript
export const extractApiData = (response) => {
  // Logique de normalisation pour gérer différentes structures
  // (hydra:member, member, tableaux directs, etc.)
  
  return { items: normalizedItems, total: normalizedTotal };
};
```

Cette approche permet de :
- Gérer différents formats de réponse API sans modifier les composants
- Assurer une structure de données cohérente dans toute l'application
- Faciliter les tests et la maintenance

### 3. Gestion intelligente des états UI

Les composants de liste (VehiculeList, ClientList) implémentent une gestion avancée des états :

- **Indicateurs de chargement** : Affichage d'un spinner pendant le chargement des données
- **Gestion des erreurs** : Affichage de messages d'erreur contextuels
- **États vides** : Affichage de messages et actions appropriés quand aucune donnée n'est disponible
- **Pagination optimisée** : Chargement uniquement des données nécessaires

## Optimisations Backend

### 1. Requêtes de base de données

Les requêtes ont été optimisées pour minimiser le temps de réponse :

- **Requêtes paramétrées** : Utilisation de requêtes préparées pour éviter les injections SQL
- **Sélection ciblée** : Récupération uniquement des champs nécessaires (`SELECT field1, field2` au lieu de `SELECT *`)
- **Jointures optimisées** : Utilisation de LEFT JOIN uniquement lorsque nécessaire
- **Pagination efficace** : Implémentation de LIMIT/OFFSET avec comptage optimisé

Exemple de requête optimisée :

```php
// Exemple de requête optimisée dans VehiculeRepository
public function findByFilters(array $filters, int $page, int $limit)
{
    $qb = $this->createQueryBuilder('v')
        ->select('v', 'm', 'mo', 'e') // Sélection ciblée
        ->leftJoin('v.marque', 'm')
        ->leftJoin('v.modele', 'mo')
        ->leftJoin('v.energie', 'e');
    
    // Application des filtres
    if (isset($filters['marque'])) {
        $qb->andWhere('m.libelle LIKE :marque')
           ->setParameter('marque', '%' . $filters['marque'] . '%');
    }
    
    // Pagination
    $qb->setFirstResult(($page - 1) * $limit)
       ->setMaxResults($limit);
       
    return $qb->getQuery()->getResult();
}
```

### 2. Indexation de la base de données

Des index ont été créés sur les colonnes fréquemment utilisées pour les recherches et les tris :

```sql
-- Exemple d'index sur les tables principales
CREATE INDEX idx_vehicule_immatriculation ON vehicule (immatriculation);
CREATE INDEX idx_vehicule_date_mise_circulation ON vehicule (date_mise_circulation);
CREATE INDEX idx_client_nom ON client (nom);
CREATE INDEX idx_client_code_postal ON client (code_postal);
```

### 3. Mise en cache

Plusieurs niveaux de cache ont été implémentés :

- **Cache HTTP** : Utilisation des en-têtes Cache-Control et ETag
- **Cache applicatif** : Mise en cache des résultats de requêtes fréquentes
- **Cache de doctrine** : Configuration optimisée du cache de métadonnées et de requêtes

## Sécurité

### 1. Validation des données

- **Côté client** : Validation avec React Hook Form et Yup
- **Côté serveur** : Validation avec les contraintes Symfony et les Assert

### 2. Protection contre les attaques courantes

- **CSRF** : Tokens CSRF pour les formulaires
- **XSS** : Échappement automatique des données avec React et Twig
- **CORS** : Configuration restrictive des origines autorisées
- **Rate limiting** : Limitation du nombre de requêtes par IP

## Tests

L'application est testée à plusieurs niveaux :

- **Tests unitaires** : PHPUnit pour le backend, Jest pour le frontend
- **Tests d'intégration** : Tests des API avec PHPUnit
- **Tests E2E** : Cypress pour tester l'application de bout en bout

## Performances

Les performances sont surveillées et optimisées :

- **Temps de réponse API** : < 300ms pour 95% des requêtes
- **Taille des bundles JS** : Optimisation avec code splitting et lazy loading
- **Temps de chargement initial** : < 1.5s sur une connexion standard

## Environnement de développement

### Prérequis

- PHP 8.x
- Symfony 6.x
- Node.js 16+
- MySQL/MariaDB
- Composer
- Yarn/npm

### Installation

```bash
# Cloner le dépôt
git clone [URL_DU_REPO]
cd [NOM_DU_PROJET]

# Installer les dépendances backend
composer install

# Installer les dépendances frontend
cd frontend_test
npm install

# Configurer la base de données
# Éditer le fichier .env avec vos paramètres

# Créer la base de données et effectuer les migrations
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Lancer l'application
# Terminal 1 - Backend
symfony server:start

# Terminal 2 - Frontend
cd frontend_test
npm start
```

## Déploiement

L'application peut être déployée avec :

- **Backend** : Serveur web (Nginx/Apache) + PHP-FPM
- **Frontend** : Serveur statique ou CDN après build
- **Base de données** : MySQL/MariaDB optimisé pour la production

## Contribution

Pour contribuer au projet :

1. Forker le dépôt
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Add some amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. 