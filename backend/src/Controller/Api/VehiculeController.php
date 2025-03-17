<?php

namespace App\Controller\Api;

use App\Repository\VehiculeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/vehicules')]
class VehiculeController extends AbstractController
{
    private VehiculeRepository $vehiculeRepository;
    private SerializerInterface $serializer;

    public function __construct(
        VehiculeRepository $vehiculeRepository,
        SerializerInterface $serializer
    ) {
        $this->vehiculeRepository = $vehiculeRepository;
        $this->serializer = $serializer;
    }

    #[Route('/advanced-search', name: 'api_vehicules_advanced_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
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
} 