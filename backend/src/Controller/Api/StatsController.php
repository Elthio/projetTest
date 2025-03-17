<?php

namespace App\Controller\Api;

use App\Repository\VehiculeRepository;
use App\Repository\ClientRepository;
use App\Repository\VenteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/stats')]
class StatsController extends AbstractController
{
    private VehiculeRepository $vehiculeRepository;
    private ClientRepository $clientRepository;
    private VenteRepository $venteRepository;

    public function __construct(
        VehiculeRepository $vehiculeRepository,
        ClientRepository $clientRepository,
        VenteRepository $venteRepository
    ) {
        $this->vehiculeRepository = $vehiculeRepository;
        $this->clientRepository = $clientRepository;
        $this->venteRepository = $venteRepository;
    }

    #[Route('/dashboard', name: 'api_stats_dashboard', methods: ['GET'])]
    public function dashboard(): JsonResponse
    {
        $totalVehicules = $this->vehiculeRepository->count([]);
        $totalClients = $this->clientRepository->count([]);
        $totalVentes = $this->venteRepository->count([]);
        
        // Répartition des véhicules par marque
        $vehiculesParMarque = $this->vehiculeRepository->countByMarque();
        
        // Répartition des véhicules par énergie
        $vehiculesParEnergie = $this->vehiculeRepository->countByEnergie();
        
        // Ventes par mois (12 derniers mois)
        $ventesParMois = $this->venteRepository->countByMonth();
        
        return $this->json([
            'totalVehicules' => $totalVehicules,
            'totalClients' => $totalClients,
            'totalVentes' => $totalVentes,
            'vehiculesParMarque' => $vehiculesParMarque,
            'vehiculesParEnergie' => $vehiculesParEnergie,
            'ventesParMois' => $ventesParMois
        ]);
    }
} 