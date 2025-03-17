#!/bin/bash

# Script d'initialisation de la base de données
# Utilisation : ./init_database.sh

# Chemin du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Se déplacer dans le répertoire du projet
cd "$PROJECT_DIR"

# Créer la base de données
echo "Création de la base de données..."
php bin/console doctrine:database:create --if-not-exists

# Créer le schéma
echo "Création du schéma de la base de données..."
php bin/console doctrine:schema:update --force

echo "Initialisation de la base de données terminée." 