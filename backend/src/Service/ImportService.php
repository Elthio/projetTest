<?php

namespace App\Service;

use App\Entity\Adresse;
use App\Entity\Client;
use App\Entity\Contact;
use App\Entity\Energie;
use App\Entity\Evenement;
use App\Entity\Marque;
use App\Entity\Modele;
use App\Entity\OrigineEvenement;
use App\Entity\TypeClient;
use App\Entity\TypeVehicule;
use App\Entity\Vehicule;
use App\Entity\Vente;
use App\Entity\Vendeur;
use App\Entity\Civilite;
use App\Repository\CiviliteRepository;
use App\Repository\ClientRepository;
use App\Repository\EnergieRepository;
use App\Repository\MarqueRepository;
use App\Repository\ModeleRepository;
use App\Repository\OrigineEvenementRepository;
use App\Repository\TypeClientRepository;
use App\Repository\TypeVehiculeRepository;
use App\Repository\VehiculeRepository;
use App\Repository\VendeurRepository;
use Doctrine\ORM\EntityManagerInterface;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ImportService
{
    private EntityManagerInterface $entityManager;
    private CiviliteRepository $civiliteRepository;
    private TypeClientRepository $typeClientRepository;
    private EnergieRepository $energieRepository;
    private TypeVehiculeRepository $typeVehiculeRepository;
    private OrigineEvenementRepository $origineEvenementRepository;
    private ClientRepository $clientRepository;
    private MarqueRepository $marqueRepository;
    private ModeleRepository $modeleRepository;
    private VehiculeRepository $vehiculeRepository;
    private VendeurRepository $vendeurRepository;
    private array $civilites = [];
    private array $energies = [];
    private array $typeClients = [];
    private array $typeVehicules = [];
    private array $origineEvenements = [];
    private array $marques = [];

    public function __construct(
        EntityManagerInterface $entityManager,
        CiviliteRepository $civiliteRepository,
        TypeClientRepository $typeClientRepository,
        EnergieRepository $energieRepository,
        TypeVehiculeRepository $typeVehiculeRepository,
        OrigineEvenementRepository $origineEvenementRepository,
        ClientRepository $clientRepository,
        MarqueRepository $marqueRepository,
        ModeleRepository $modeleRepository,
        VehiculeRepository $vehiculeRepository,
        VendeurRepository $vendeurRepository
    ) {
        $this->entityManager = $entityManager;
        $this->civiliteRepository = $civiliteRepository;
        $this->typeClientRepository = $typeClientRepository;
        $this->energieRepository = $energieRepository;
        $this->typeVehiculeRepository = $typeVehiculeRepository;
        $this->origineEvenementRepository = $origineEvenementRepository;
        $this->clientRepository = $clientRepository;
        $this->marqueRepository = $marqueRepository;
        $this->modeleRepository = $modeleRepository;
        $this->vehiculeRepository = $vehiculeRepository;
        $this->vendeurRepository = $vendeurRepository;
    }

    public function importXlsx(string $filePath, InputInterface $input, OutputInterface $output): array
    {
        $output->writeln(['', '<info>Importation du fichier XLSX</info>', '']);
        
        // Vérifier si le fichier existe
        if (!file_exists($filePath)) {
            $output->writeln("<error>Le fichier $filePath n'existe pas.</error>");
            return ['success' => false, 'message' => "Le fichier $filePath n'existe pas."];
        }
        
        try {
            // Charger le fichier XLSX
            $spreadsheet = IOFactory::load($filePath);
            $worksheet = $spreadsheet->getActiveSheet();
            
            // Récupérer les données
            $data = [];
            $headers = [];
            
            foreach ($worksheet->getRowIterator() as $rowIndex => $row) {
                $rowData = [];
                $cellIterator = $row->getCellIterator();
                $cellIterator->setIterateOnlyExistingCells(false);
                
                foreach ($cellIterator as $columnIndex => $cell) {
                    $value = $cell->getValue();
                    
                    if ($rowIndex === 1) {
                        // Première ligne = en-têtes
                        $headers[$columnIndex] = $value;
                    } else {
                        // Autres lignes = données
                        $rowData[$headers[$columnIndex]] = $value;
                    }
                }
                
                if ($rowIndex > 1 && !empty(array_filter($rowData))) {
                    $data[] = $rowData;
                }
            }
            
            $output->writeln(sprintf('Nombre de lignes trouvées : %d', count($data)));
            
            // Traiter les données
            $this->processData($data, $output);
            
            return ['success' => true, 'message' => 'Importation réussie.', 'count' => count($data)];
        } catch (\Exception $e) {
            $output->writeln('<error>Erreur lors de l\'importation : ' . $e->getMessage() . '</error>');
            return ['success' => false, 'message' => 'Erreur lors de l\'importation : ' . $e->getMessage()];
        }
    }
    
    private function processData(array $data, OutputInterface $output): void
    {
        $count = 0;
        $total = count($data);
        $batchSize = 10;
        
        $output->writeln(sprintf('<info>Traitement de %d lignes...</info>', $total));
        
        // Traiter chaque ligne
        foreach ($data as $row) {
            try {
                // Commencer une nouvelle transaction
                $this->entityManager->beginTransaction();
                
                // Pré-traiter les entités de référence pour éviter les doublons
                $this->preProcessReferenceEntities($row);
                
                $this->processRow($row);
                $count++;
                
                // Valider la transaction
                $this->entityManager->commit();
                
                if ($count % $batchSize === 0) {
                    // Flush toutes les 10 lignes pour éviter de surcharger la mémoire
                    $this->entityManager->flush();
                    $this->entityManager->clear();
                    
                    // Réinitialiser les caches après le clear
                    $this->civilites = [];
                    $this->energies = [];
                    $this->typeClients = [];
                    $this->typeVehicules = [];
                    $this->origineEvenements = [];
                    $this->marques = [];
                    
                    $output->writeln(sprintf('<info>%d/%d lignes traitées</info>', $count, $total));
                }
            } catch (\Exception $e) {
                $output->writeln('<error>Erreur ligne ' . ($count + 1) . ': ' . $e->getMessage() . '</error>');
                
                // Annuler la transaction en cours
                if ($this->entityManager->getConnection()->isTransactionActive()) {
                    $this->entityManager->rollback();
                }
                
                // Nettoyer l'EntityManager en cas d'erreur
                if ($this->entityManager->isOpen()) {
                    $this->entityManager->clear();
                    
                    // Réinitialiser les caches après le clear
                    $this->civilites = [];
                    $this->energies = [];
                    $this->typeClients = [];
                    $this->typeVehicules = [];
                    $this->origineEvenements = [];
                    $this->marques = [];
                } else {
                    // Si l'EntityManager est fermé, on ne peut pas continuer
                    $output->writeln('<error>L\'EntityManager est fermé, impossible de continuer l\'importation.</error>');
                    return;
                }
            }
        }
        
        // Flush final seulement si l'EntityManager est ouvert
        if ($this->entityManager->isOpen()) {
            try {
                $this->entityManager->flush();
            } catch (\Exception $e) {
                $output->writeln('<error>Erreur lors du flush final : ' . $e->getMessage() . '</error>');
            }
        }
        
        $output->writeln(sprintf('<info>%d lignes importées avec succès.</info>', $count));
    }
    
    private function preProcessReferenceEntities(array $row): void
    {
        // Traiter les civilités
        if (!empty($row['Libellé civilité'])) {
            $this->getOrCreateReferenceEntity(
                $row['Libellé civilité'],
                $this->civilites,
                $this->civiliteRepository,
                Civilite::class
            );
        }
        
        // Traiter les énergies
        if (!empty($row['Libellé énergie (Energ)'])) {
            $this->getOrCreateReferenceEntity(
                $row['Libellé énergie (Energ)'],
                $this->energies,
                $this->energieRepository,
                Energie::class
            );
        }
        
        // Traiter les types de client
        if (!empty($row['Type de prospect'])) {
            $this->getOrCreateReferenceEntity(
                $row['Type de prospect'],
                $this->typeClients,
                $this->typeClientRepository,
                TypeClient::class
            );
        }
        
        // Traiter les types de véhicule
        if (!empty($row['Type VN VO'])) {
            $this->getOrCreateReferenceEntity(
                $row['Type VN VO'],
                $this->typeVehicules,
                $this->typeVehiculeRepository,
                TypeVehicule::class
            );
        }
        
        // Traiter les origines d'événement
        if (!empty($row['Origine évènement (Veh)'])) {
            $this->getOrCreateReferenceEntity(
                $row['Origine évènement (Veh)'],
                $this->origineEvenements,
                $this->origineEvenementRepository,
                OrigineEvenement::class
            );
        }
        
        // Traiter les marques
        if (!empty($row['Libellé marque (Mrq)'])) {
            $this->getOrCreateReferenceEntity(
                $row['Libellé marque (Mrq)'],
                $this->marques,
                $this->marqueRepository,
                Marque::class
            );
        }
    }
    
    private function getOrCreateReferenceEntity(string $libelle, array &$cache, $repository, string $entityClass): object
    {
        $normalizedLibelle = method_exists($repository, 'normalizeLibelle')
            ? $repository->normalizeLibelle($libelle)
            : trim(strtoupper($libelle));
            
        if (!isset($cache[$normalizedLibelle])) {
            $entity = $repository->findOneBy(['libelle' => $normalizedLibelle]);
            if (!$entity) {
                $entity = new $entityClass();
                $entity->setLibelle($normalizedLibelle);
                $this->entityManager->persist($entity);
                $this->entityManager->flush();
            }
            $cache[$normalizedLibelle] = $entity;
        }
        
        return $cache[$normalizedLibelle];
    }
    
    private function processRow(array $row): void
    {
        // Traiter les tables de typage
        $civilite = $this->getCivilite($row['Libellé civilité'] ?? null);
        $typeClient = $this->getTypeClient($row['Type de prospect'] ?? null);
        $energie = $this->getEnergie($row['Libellé énergie (Energ)'] ?? null);
        $typeVehicule = $this->getTypeVehicule($row['Type VN VO'] ?? null);
        $origineEvenement = $this->getOrigineEvenement($row['Origine évènement (Veh)'] ?? null);
        
        // Traiter le client
        $client = $this->getClient($row);
        
        // Ajouter l'adresse au client
        $this->addAdresseToClient($client, $row);
        
        // Ajouter les contacts au client
        $this->addContactToClient($client, $row);
        
        // Traiter la marque et le modèle
        $marque = $this->getMarque($row['Libellé marque (Mrq)'] ?? null);
        $modele = null;
        if ($marque && !empty($row['Libellé modèle (Mod)'])) {
            $modele = $this->getModele($row['Libellé modèle (Mod)'], $marque);
        }
        
        // Traiter le véhicule
        $vehicule = $this->getVehicule($row, $marque, $modele, $energie, $typeClient, $client);
        
        // Traiter l'événement
        if ($vehicule && !empty($row['Date évènement (Veh)'])) {
            $this->createEvenement($row, $vehicule, $origineEvenement);
        }
        
        // Traiter la vente
        if ($vehicule && $client && !empty($row['Date achat (date de livraison)'])) {
            $this->createVente($row, $vehicule, $client, $typeVehicule);
        }
    }
    
    private function getCivilite(?string $libelle): ?Civilite
    {
        if (empty($libelle)) {
            return null;
        }
        
        $normalizedLibelle = $this->civiliteRepository->normalizeLibelle($libelle);
        return $this->civilites[$normalizedLibelle] ?? null;
    }
    
    private function getEnergie(?string $libelle): ?Energie
    {
        if (empty($libelle)) {
            return null;
        }
        
        $normalizedLibelle = method_exists($this->energieRepository, 'normalizeLibelle')
            ? $this->energieRepository->normalizeLibelle($libelle)
            : trim(strtoupper($libelle));
            
        return $this->energies[$normalizedLibelle] ?? null;
    }
    
    private function getTypeClient(?string $libelle): ?TypeClient
    {
        if (empty($libelle)) {
            return null;
        }
        
        $normalizedLibelle = method_exists($this->typeClientRepository, 'normalizeLibelle')
            ? $this->typeClientRepository->normalizeLibelle($libelle)
            : trim(strtoupper($libelle));
            
        return $this->typeClients[$normalizedLibelle] ?? null;
    }
    
    private function getTypeVehicule(?string $libelle): ?TypeVehicule
    {
        if (empty($libelle)) {
            return null;
        }
        
        $normalizedLibelle = method_exists($this->typeVehiculeRepository, 'normalizeLibelle')
            ? $this->typeVehiculeRepository->normalizeLibelle($libelle)
            : trim(strtoupper($libelle));
            
        return $this->typeVehicules[$normalizedLibelle] ?? null;
    }
    
    private function getOrigineEvenement(?string $libelle): ?OrigineEvenement
    {
        if (empty($libelle)) {
            return null;
        }
        
        $normalizedLibelle = method_exists($this->origineEvenementRepository, 'normalizeLibelle')
            ? $this->origineEvenementRepository->normalizeLibelle($libelle)
            : trim(strtoupper($libelle));
            
        return $this->origineEvenements[$normalizedLibelle] ?? null;
    }
    
    private function getMarque(?string $libelle): ?Marque
    {
        if (empty($libelle)) {
            return null;
        }
        
        $normalizedLibelle = method_exists($this->marqueRepository, 'normalizeLibelle')
            ? $this->marqueRepository->normalizeLibelle($libelle)
            : trim(strtoupper($libelle));
            
        return $this->marques[$normalizedLibelle] ?? null;
    }
    
    private function getClient(array $row): Client
    {
        $nom = $row['Nom'] ?? '';
        $prenom = $row['Prénom'] ?? null;
        
        $client = $this->clientRepository->findOrCreateByNomPrenom($nom, $prenom);
        
        $client->setCompteAffaire($row['Compte Affaire'] ?? null);
        $client->setCivilite($this->getCivilite($row['Libellé civilité'] ?? null));
        $client->setEstProprietaireActuel(!empty($row['Propriétaire actuel du véhicule']));
        
        if (!$client->getId()) {
            $this->entityManager->persist($client);
        }
        
        return $client;
    }
    
    private function addAdresseToClient(Client $client, array $row): void
    {
        $adresse = new Adresse();
        $adresse->setClient($client);
        $adresse->setVoie($row['N° et Nom de la voie'] ?? null);
        $adresse->setComplement($row['Complément adresse 1'] ?? null);
        $adresse->setCodePostal($row['Code postal'] ?? null);
        $adresse->setVille($row['Ville'] ?? null);
        
        $client->addAdresse($adresse);
        $this->entityManager->persist($adresse);
    }
    
    private function addContactToClient(Client $client, array $row): void
    {
        $contact = new Contact();
        $contact->setClient($client);
        $contact->setTelephoneDomicile($row['Téléphone domicile'] ?? null);
        $contact->setTelephonePortable($row['Téléphone portable'] ?? null);
        $contact->setTelephoneProfessionnel($row['Téléphone job'] ?? null);
        $contact->setEmail($row['Email'] ?? null);
        
        $client->addContact($contact);
        $this->entityManager->persist($contact);
    }
    
    private function getModele(string $libelle, Marque $marque): Modele
    {
        $modele = $this->modeleRepository->findOrCreateByLibelleAndMarque($libelle, $marque);
        
        if (!$modele->getId()) {
            $this->entityManager->persist($modele);
        }
        
        return $modele;
    }
    
    private function getVehicule(array $row, ?Marque $marque, ?Modele $modele, ?Energie $energie, ?TypeClient $typeClient, ?Client $client): ?Vehicule
    {
        $vin = $row['VIN'] ?? null;
        $immatriculation = $row['Immatriculation'] ?? null;
        
        if (empty($vin) && empty($immatriculation)) {
            return null;
        }
        
        $vehicule = null;
        
        if (!empty($vin)) {
            $vehicule = $this->vehiculeRepository->findOneByVin($vin);
        }
        
        if (!$vehicule && !empty($immatriculation)) {
            $vehicule = $this->vehiculeRepository->findOneByImmatriculation($immatriculation);
        }
        
        if (!$vehicule) {
            $vehicule = new Vehicule();
            $vehicule->setVin($vin);
            $vehicule->setImmatriculation($immatriculation);
        }
        
        $vehicule->setMarque($marque);
        $vehicule->setModele($modele);
        $vehicule->setVersion($row['Version'] ?? null);
        $vehicule->setEnergie($energie);
        $vehicule->setTypeClient($typeClient);
        $vehicule->setClient($client);
        $vehicule->setNumeroFiche($row['Numéro de fiche'] ?? null);
        
        // Convertir la date de mise en circulation depuis le format Excel
        if (!empty($row['Date de mise en circulation'])) {
            try {
                // Convertir le nombre de jours Excel en timestamp Unix
                $excelDate = (int)$row['Date de mise en circulation'];
                if ($excelDate > 0) {
                    // Excel commence à compter à partir du 1er janvier 1900
                    $unixTimestamp = ($excelDate - 25569) * 86400;
                    $date = new \DateTime();
                    $date->setTimestamp($unixTimestamp);
                    $vehicule->setDateMiseCirculation($date);
                }
            } catch (\Exception $e) {
                // Ignorer les erreurs de date
            }
        }
        
        $this->entityManager->persist($vehicule);
        
        return $vehicule;
    }
    
    private function createEvenement(array $row, Vehicule $vehicule, ?OrigineEvenement $origineEvenement): void
    {
        $evenement = new Evenement();
        $evenement->setVehicule($vehicule);
        $evenement->setCompteEvenement($row['Compte évènement (Veh)'] ?? null);
        $evenement->setCompteDernierEvenement($row['Compte dernier évènement (Veh)'] ?? null);
        $evenement->setOrigine($origineEvenement);
        $evenement->setCommentaire($row['Commentaire de facturation (Veh)'] ?? null);
        
        if (!empty($row['Kilométrage'])) {
            $evenement->setKilometrage((int) $row['Kilométrage']);
        }
        
        // Convertir la date d'événement depuis le format Excel
        if (!empty($row['Date évènement (Veh)'])) {
            try {
                $excelDate = (int)$row['Date évènement (Veh)'];
                if ($excelDate > 0) {
                    $unixTimestamp = ($excelDate - 25569) * 86400;
                    $date = new \DateTime();
                    $date->setTimestamp($unixTimestamp);
                    $evenement->setDateEvenement($date);
                }
            } catch (\Exception $e) {
                // Ignorer les erreurs de date
            }
        }
        
        $vehicule->addEvenement($evenement);
        $this->entityManager->persist($evenement);
    }
    
    private function createVente(array $row, Vehicule $vehicule, Client $client, ?TypeVehicule $typeVehicule): void
    {
        $vente = new Vente();
        $vente->setVehicule($vehicule);
        $vente->setClient($client);
        $vente->setTypeVnVo($row['Type VN VO'] ?? null);
        $vente->setNumeroDossier($row['Numéro de dossier VN VO'] ?? null);
        $vente->setIntermediaireVente($row['Intermediaire de vente VN'] ?? null);
        
        // Traiter les vendeurs
        if (!empty($row['Vendeur VN'])) {
            $nomPrenom = explode(' ', $row['Vendeur VN'], 2);
            if (count($nomPrenom) === 2) {
                $vendeurVn = $this->vendeurRepository->findOrCreateByNomPrenom($nomPrenom[0], $nomPrenom[1]);
                $vendeurVn->setEstVn(true);
                $this->entityManager->persist($vendeurVn);
                $vente->setVendeurVn($vendeurVn);
            }
        }
        
        if (!empty($row['Vendeur VO'])) {
            $nomPrenom = explode(' ', $row['Vendeur VO'], 2);
            if (count($nomPrenom) === 2) {
                $vendeurVo = $this->vendeurRepository->findOrCreateByNomPrenom($nomPrenom[0], $nomPrenom[1]);
                $vendeurVo->setEstVo(true);
                $this->entityManager->persist($vendeurVo);
                $vente->setVendeurVo($vendeurVo);
            }
        }
        
        // Convertir la date d'achat depuis le format Excel
        if (!empty($row['Date achat (date de livraison)'])) {
            try {
                $excelDate = (int)$row['Date achat (date de livraison)'];
                if ($excelDate > 0) {
                    $unixTimestamp = ($excelDate - 25569) * 86400;
                    $date = new \DateTime();
                    $date->setTimestamp($unixTimestamp);
                    $vente->setDateAchat($date);
                    $vente->setDateLivraison($date);
                }
            } catch (\Exception $e) {
                // Ignorer les erreurs de date
            }
        }
        
        $vehicule->addVente($vente);
        $client->addVente($vente);
        $this->entityManager->persist($vente);
    }
} 