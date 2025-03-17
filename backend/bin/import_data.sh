#!/bin/bash

# Script principal d'importation de données
# Utilisation : ./import_data.sh chemin/vers/fichier.xlsx

# Vérifier si un argument a été fourni
if [ $# -eq 0 ]; then
    echo "Erreur : Aucun fichier spécifié."
    echo "Utilisation : ./import_data.sh chemin/vers/fichier.xlsx"
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

# Initialiser la base de données
echo "Initialisation de la base de données..."
"$SCRIPT_DIR/init_database.sh"

# Vérifier le code de retour
if [ $? -ne 0 ]; then
    echo "Erreur lors de l'initialisation de la base de données."
    exit 1
fi

# Importer les données
echo "Importation des données..."
"$SCRIPT_DIR/import_xlsx.sh" "$FILE_PATH"

# Vérifier le code de retour
if [ $? -eq 0 ]; then
    echo "Importation des données terminée avec succès."
    exit 0
else
    echo "Erreur lors de l'importation des données."
    exit 1
fi 