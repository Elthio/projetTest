#!/bin/bash

# Script d'importation de fichiers XLSX dans la base de données
# Utilisation : ./import_xlsx.sh chemin/vers/fichier.xlsx

# Vérifier si un argument a été fourni
if [ $# -eq 0 ]; then
    echo "Erreur : Aucun fichier spécifié."
    echo "Utilisation : ./import_xlsx.sh chemin/vers/fichier.xlsx"
    exit 1
fi

# Vérifier si le fichier existe
if [ ! -f "$1" ]; then
    echo "Erreur : Le fichier '$1' n'existe pas."
    exit 1
fi

# Chemin absolu vers le fichier
FILE_PATH=$(realpath "$1")

# Chemin du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Exécuter la commande Symfony
cd "$PROJECT_DIR" && php bin/console app:import:xlsx "$FILE_PATH"

# Vérifier le code de retour
if [ $? -eq 0 ]; then
    echo "Importation terminée avec succès."
    exit 0
else
    echo "Erreur lors de l'importation."
    exit 1
fi 