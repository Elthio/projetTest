#!/bin/bash

# Couleurs pour les messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Début de la réinitialisation de la base de données...${NC}\n"

# Suppression de la base de données
echo -e "${GREEN}Suppression de la base de données...${NC}"
php bin/console doctrine:database:drop --force --if-exists
if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de la suppression de la base de données${NC}"
    exit 1
fi

# Création de la base de données
echo -e "\n${GREEN}Création de la base de données...${NC}"
php bin/console doctrine:database:create
if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de la création de la base de données${NC}"
    exit 1
fi

# Création du schéma
echo -e "\n${GREEN}Création du schéma de la base de données...${NC}"
php bin/console doctrine:schema:create
if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de la création du schéma${NC}"
    exit 1
fi

# Chargement des fixtures (si elles existent)
if [ -d "src/DataFixtures" ]; then
    echo -e "\n${GREEN}Chargement des fixtures...${NC}"
    php bin/console doctrine:fixtures:load --no-interaction
    if [ $? -ne 0 ]; then
        echo -e "${RED}Erreur lors du chargement des fixtures${NC}"
        exit 1
    fi
fi

echo -e "\n${GREEN}Base de données réinitialisée avec succès !${NC}" 