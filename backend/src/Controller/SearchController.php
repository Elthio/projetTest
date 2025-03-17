<?php

namespace App\Controller;

use App\Repository\VehiculeRepository;
use App\Repository\ClientRepository;
use App\Repository\VenteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/search')]
class SearchController extends AbstractController
{
    private VehiculeRepository $vehiculeRepository;
    private ClientRepository $clientRepository;
    private VenteRepository $venteRepository;
    private SerializerInterface $serializer;

    public function __construct(
        VehiculeRepository $vehiculeRepository,
        ClientRepository $clientRepository,
        VenteRepository $venteRepository,
        SerializerInterface $serializer
    ) {
        $this->vehiculeRepository = $vehiculeRepository;
        $this->clientRepository = $clientRepository;
        $this->venteRepository = $venteRepository;
        $this->serializer = $serializer;
    }

    #[Route('/vehicules', name: 'search_vehicules', methods: ['GET'])]
    public function searchVehicules(Request $request): JsonResponse
    {
        // Récupérer les paramètres de recherche
        $marque = $request->query->get('marque');
        $modele = $request->query->get('modele');
        $energie = $request->query->get('energie');
        $immatriculation = $request->query->get('immatriculation');
        $vin = $request->query->get('vin');
        $clientNom = $request->query->get('clientNom');
        
        // Paramètres de date
        $dateMin = $request->query->get('dateMin');
        $dateMax = $request->query->get('dateMax');
        
        // Convertir les dates si elles sont fournies
        $dateMinObj = null;
        $dateMaxObj = null;
        
        if ($dateMin) {
            $dateMinObj = new \DateTime($dateMin);
        }
        
        if ($dateMax) {
            $dateMaxObj = new \DateTime($dateMax);
        }
        
        // Paramètres de pagination
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, min(50, (int) $request->query->get('limit', 10)));
        
        // Paramètres de tri
        $sortBy = $request->query->get('sortBy', 'id');
        $sortOrder = $request->query->get('sortOrder', 'DESC');
        
        // Effectuer la recherche
        $result = $this->vehiculeRepository->searchVehicules(
            $marque, $modele, $energie, $dateMinObj, $dateMaxObj,
            $immatriculation, $vin, $clientNom,
            $page, $limit, $sortBy, $sortOrder
        );
        
        // Sérialiser les résultats
        $json = $this->serializer->serialize(
            $result['items'],
            'json',
            ['groups' => ['vehicule:read']]
        );
        
        // Construire la réponse
        $items = json_decode($json, true);
        
        return new JsonResponse([
            'items' => $items,
            'total' => $result['total'],
            'page' => $page,
            'limit' => $limit,
            'totalPages' => ceil($result['total'] / $limit)
        ]);
    }

    #[Route('/clients', name: 'search_clients', methods: ['GET'])]
    public function searchClients(Request $request): JsonResponse
    {
        // Récupérer les paramètres de recherche
        $nom = $request->query->get('nom');
        $civilite = $request->query->get('civilite');
        $codePostal = $request->query->get('codePostal');
        $ville = $request->query->get('ville');
        $email = $request->query->get('email');
        $telephone = $request->query->get('telephone');
        $estProprietaire = $request->query->get('estProprietaireActuel');
        
        // Paramètres de pagination
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, min(50, (int) $request->query->get('limit', 10)));
        
        // Paramètres de tri
        $sortBy = $request->query->get('sortBy', 'id');
        $sortOrder = $request->query->get('sortOrder', 'DESC');
        
        // Effectuer la recherche
        $result = $this->clientRepository->searchClients(
            $nom, $civilite, $codePostal, $ville, $email, $telephone,
            $estProprietaire === 'true' ? true : ($estProprietaire === 'false' ? false : null),
            $page, $limit, $sortBy, $sortOrder
        );
        
        // Sérialiser les résultats
        $json = $this->serializer->serialize(
            $result['items'],
            'json',
            ['groups' => ['client:read']]
        );
        
        // Construire la réponse
        $items = json_decode($json, true);
        
        return new JsonResponse([
            'items' => $items,
            'total' => $result['total'],
            'page' => $page,
            'limit' => $limit,
            'totalPages' => ceil($result['total'] / $limit)
        ]);
    }

    #[Route('/ventes', name: 'search_ventes', methods: ['GET'])]
    public function searchVentes(Request $request): JsonResponse
    {
        // Récupérer les paramètres de recherche
        $numeroDossier = $request->query->get('numeroDossier');
        $typeVnVo = $request->query->get('typeVnVo');
        $clientNom = $request->query->get('clientNom');
        $vehiculeVin = $request->query->get('vehiculeVin');
        $vehiculeImmatriculation = $request->query->get('vehiculeImmatriculation');
        $vendeurNom = $request->query->get('vendeurNom');
        
        // Paramètres de date
        $dateAchatMin = $request->query->get('dateAchatMin');
        $dateAchatMax = $request->query->get('dateAchatMax');
        $dateLivraisonMin = $request->query->get('dateLivraisonMin');
        $dateLivraisonMax = $request->query->get('dateLivraisonMax');
        
        // Convertir les dates si elles sont fournies
        $dateAchatMinObj = $dateAchatMin ? new \DateTime($dateAchatMin) : null;
        $dateAchatMaxObj = $dateAchatMax ? new \DateTime($dateAchatMax) : null;
        $dateLivraisonMinObj = $dateLivraisonMin ? new \DateTime($dateLivraisonMin) : null;
        $dateLivraisonMaxObj = $dateLivraisonMax ? new \DateTime($dateLivraisonMax) : null;
        
        // Paramètres de pagination
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = max(1, min(50, (int) $request->query->get('limit', 10)));
        
        // Paramètres de tri
        $sortBy = $request->query->get('sortBy', 'id');
        $sortOrder = $request->query->get('sortOrder', 'DESC');
        
        // Effectuer la recherche
        $result = $this->venteRepository->searchVentes(
            $numeroDossier, $typeVnVo, $clientNom, $vehiculeVin, $vehiculeImmatriculation, $vendeurNom,
            $dateAchatMinObj, $dateAchatMaxObj, $dateLivraisonMinObj, $dateLivraisonMaxObj,
            $page, $limit, $sortBy, $sortOrder
        );
        
        // Sérialiser les résultats
        $json = $this->serializer->serialize(
            $result['items'],
            'json',
            ['groups' => ['vente:read']]
        );
        
        // Construire la réponse
        $items = json_decode($json, true);
        
        return new JsonResponse([
            'items' => $items,
            'total' => $result['total'],
            'page' => $page,
            'limit' => $limit,
            'totalPages' => ceil($result['total'] / $limit)
        ]);
    }
} 