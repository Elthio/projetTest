-- Schéma de base de données normalisé pour les données d'importation
-- Création de la base de données
CREATE DATABASE IF NOT EXISTS gestion_vehicules CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestion_vehicules;

-- Table des civilités
CREATE TABLE IF NOT EXISTS civilites (
    id_civilite INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table des types de clients
CREATE TABLE IF NOT EXISTS types_clients (
    id_type_client INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
    id_client INT AUTO_INCREMENT PRIMARY KEY,
    compte_affaire VARCHAR(50),
    id_civilite INT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    est_societe BOOLEAN DEFAULT FALSE,
    est_proprietaire_actuel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_civilite) REFERENCES civilites(id_civilite)
) ENGINE=InnoDB;

-- Table des adresses
CREATE TABLE IF NOT EXISTS adresses (
    id_adresse INT AUTO_INCREMENT PRIMARY KEY,
    id_client INT NOT NULL,
    voie VARCHAR(255),
    complement VARCHAR(255),
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
) ENGINE=InnoDB;

-- Table des contacts
CREATE TABLE IF NOT EXISTS contacts (
    id_contact INT AUTO_INCREMENT PRIMARY KEY,
    id_client INT NOT NULL,
    telephone_domicile VARCHAR(20),
    telephone_portable VARCHAR(20),
    telephone_professionnel VARCHAR(20),
    email VARCHAR(100),
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
) ENGINE=InnoDB;

-- Table des marques
CREATE TABLE IF NOT EXISTS marques (
    id_marque INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table des modèles
CREATE TABLE IF NOT EXISTS modeles (
    id_modele INT AUTO_INCREMENT PRIMARY KEY,
    id_marque INT NOT NULL,
    libelle VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_modele_marque (id_marque, libelle),
    FOREIGN KEY (id_marque) REFERENCES marques(id_marque)
) ENGINE=InnoDB;

-- Table des énergies
CREATE TABLE IF NOT EXISTS energies (
    id_energie INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table des types de véhicules (VN/VO)
CREATE TABLE IF NOT EXISTS types_vehicules (
    id_type_vehicule INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table des vendeurs
CREATE TABLE IF NOT EXISTS vendeurs (
    id_vendeur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    est_vn BOOLEAN DEFAULT TRUE,
    est_vo BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- Table des véhicules
CREATE TABLE IF NOT EXISTS vehicules (
    id_vehicule INT AUTO_INCREMENT PRIMARY KEY,
    vin VARCHAR(50) UNIQUE,
    immatriculation VARCHAR(20) UNIQUE,
    id_marque INT NOT NULL,
    id_modele INT,
    version VARCHAR(255),
    id_energie INT,
    date_mise_circulation DATE,
    id_type_client INT,
    id_client INT,
    numero_fiche VARCHAR(20),
    FOREIGN KEY (id_marque) REFERENCES marques(id_marque),
    FOREIGN KEY (id_modele) REFERENCES modeles(id_modele),
    FOREIGN KEY (id_energie) REFERENCES energies(id_energie),
    FOREIGN KEY (id_type_client) REFERENCES types_clients(id_type_client),
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
) ENGINE=InnoDB;

-- Table des origines d'événements
CREATE TABLE IF NOT EXISTS origines_evenements (
    id_origine INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table des types d'événements
CREATE TABLE IF NOT EXISTS types_evenements (
    id_type_evenement INT AUTO_INCREMENT PRIMARY KEY,
    libelle VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Table des événements
CREATE TABLE IF NOT EXISTS evenements (
    id_evenement INT AUTO_INCREMENT PRIMARY KEY,
    compte_evenement VARCHAR(50),
    compte_dernier_evenement VARCHAR(50),
    id_vehicule INT NOT NULL,
    date_evenement DATE,
    id_origine INT,
    commentaire TEXT,
    kilometrage INT,
    FOREIGN KEY (id_vehicule) REFERENCES vehicules(id_vehicule),
    FOREIGN KEY (id_origine) REFERENCES origines_evenements(id_origine)
) ENGINE=InnoDB;

-- Table des ventes
CREATE TABLE IF NOT EXISTS ventes (
    id_vente INT AUTO_INCREMENT PRIMARY KEY,
    id_vehicule INT NOT NULL,
    id_client INT NOT NULL,
    id_vendeur_vn INT,
    id_vendeur_vo INT,
    date_achat DATE,
    date_livraison DATE,
    type_vn_vo VARCHAR(2),
    numero_dossier VARCHAR(50),
    intermediaire_vente VARCHAR(100),
    commentaire TEXT,
    FOREIGN KEY (id_vehicule) REFERENCES vehicules(id_vehicule),
    FOREIGN KEY (id_client) REFERENCES clients(id_client),
    FOREIGN KEY (id_vendeur_vn) REFERENCES vendeurs(id_vendeur),
    FOREIGN KEY (id_vendeur_vo) REFERENCES vendeurs(id_vendeur)
) ENGINE=InnoDB;

-- Vue pour afficher les informations complètes des véhicules
CREATE OR REPLACE VIEW vue_vehicules_complet AS
SELECT 
    v.id_vehicule,
    v.vin,
    v.immatriculation,
    m.libelle AS marque,
    mo.libelle AS modele,
    v.version,
    e.libelle AS energie,
    v.date_mise_circulation,
    tc.libelle AS type_client,
    c.nom AS nom_client,
    c.prenom AS prenom_client,
    a.voie,
    a.code_postal,
    a.ville,
    co.telephone_portable,
    co.email,
    ev.date_evenement AS dernier_evenement,
    ev.kilometrage AS dernier_kilometrage,
    oe.libelle AS origine_evenement
FROM 
    vehicules v
LEFT JOIN marques m ON v.id_marque = m.id_marque
LEFT JOIN modeles mo ON v.id_modele = mo.id_modele
LEFT JOIN energies e ON v.id_energie = e.id_energie
LEFT JOIN types_clients tc ON v.id_type_client = tc.id_type_client
LEFT JOIN clients c ON v.id_client = c.id_client
LEFT JOIN adresses a ON c.id_client = a.id_client
LEFT JOIN contacts co ON c.id_client = co.id_client
LEFT JOIN (
    SELECT id_vehicule, MAX(date_evenement) AS max_date
    FROM evenements
    GROUP BY id_vehicule
) latest_ev ON v.id_vehicule = latest_ev.id_vehicule
LEFT JOIN evenements ev ON latest_ev.id_vehicule = ev.id_vehicule AND latest_ev.max_date = ev.date_evenement
LEFT JOIN origines_evenements oe ON ev.id_origine = oe.id_origine;

-- Vue pour les ventes avec informations complètes
CREATE OR REPLACE VIEW vue_ventes_complet AS
SELECT 
    vt.id_vente,
    v.vin,
    v.immatriculation,
    m.libelle AS marque,
    mo.libelle AS modele,
    c.nom AS nom_client,
    c.prenom AS prenom_client,
    vn.nom AS vendeur_vn_nom,
    vn.prenom AS vendeur_vn_prenom,
    vo.nom AS vendeur_vo_nom,
    vo.prenom AS vendeur_vo_prenom,
    vt.date_achat,
    vt.date_livraison,
    vt.type_vn_vo,
    vt.numero_dossier
FROM 
    ventes vt
JOIN vehicules v ON vt.id_vehicule = v.id_vehicule
JOIN clients c ON vt.id_client = c.id_client
LEFT JOIN marques m ON v.id_marque = m.id_marque
LEFT JOIN modeles mo ON v.id_modele = mo.id_modele
LEFT JOIN vendeurs vn ON vt.id_vendeur_vn = vn.id_vendeur
LEFT JOIN vendeurs vo ON vt.id_vendeur_vo = vo.id_vendeur;

-- Index pour optimiser les performances
CREATE INDEX idx_vehicules_client ON vehicules(id_client);
CREATE INDEX idx_vehicules_marque_modele ON vehicules(id_marque, id_modele);
CREATE INDEX idx_evenements_vehicule ON evenements(id_vehicule);
CREATE INDEX idx_evenements_date ON evenements(date_evenement);
CREATE INDEX idx_ventes_vehicule ON ventes(id_vehicule);
CREATE INDEX idx_ventes_client ON ventes(id_client);
CREATE INDEX idx_ventes_dates ON ventes(date_achat, date_livraison); 