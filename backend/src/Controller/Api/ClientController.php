<?php

namespace App\Controller\Api;

use App\Repository\ClientRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/clients')]
class ClientController extends AbstractController
{
    private ClientRepository $clientRepository;
    private SerializerInterface $serializer;

    public function __construct(
        ClientRepository $clientRepository,
        SerializerInterface $serializer
    ) {
        $this->clientRepository = $clientRepository;
        $this->serializer = $serializer;
    }

    #[Route('/search', name: 'api_clients_search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
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
} 