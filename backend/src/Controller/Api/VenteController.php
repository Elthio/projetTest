<?php

namespace App\Controller\Api;

use App\Repository\VenteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/ventes')]
class VenteController extends AbstractController
{
    private VenteRepository $venteRepository;
    private SerializerInterface $serializer;

    public function __construct(
        VenteRepository $venteRepository,
        SerializerInterface $serializer
    ) {
        $this->venteRepository = $venteRepository;
        $this->serializer = $serializer;
    }

    #[Route('/search', name: 'api_ventes_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
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