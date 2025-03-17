<?php

namespace App\Repository;

use App\Entity\Vehicule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Vehicule>
 *
 * @method Vehicule|null find($id, $lockMode = null, $lockVersion = null)
 * @method Vehicule|null findOneBy(array $criteria, array $orderBy = null)
 * @method Vehicule[]    findAll()
 * @method Vehicule[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VehiculeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Vehicule::class);
    }

    public function findOneByVin(string $vin): ?Vehicule
    {
        return $this->findOneBy(['vin' => $vin]);
    }

    public function findOneByImmatriculation(string $immatriculation): ?Vehicule
    {
        return $this->findOneBy(['immatriculation' => $immatriculation]);
    }

    /**
     * Compte le nombre de véhicules par marque
     * @return array
     */
    public function countByMarque(): array
    {
        $qb = $this->createQueryBuilder('v')
            ->select('m.libelle as marque, COUNT(v.id) as count')
            ->join('v.marque', 'm')
            ->groupBy('m.id')
            ->orderBy('count', 'DESC');
            
        return $qb->getQuery()->getResult();
    }
    
    /**
     * Compte le nombre de véhicules par énergie
     * @return array
     */
    public function countByEnergie(): array
    {
        $qb = $this->createQueryBuilder('v')
            ->select('e.libelle as energie, COUNT(v.id) as count')
            ->join('v.energie', 'e')
            ->groupBy('e.id')
            ->orderBy('count', 'DESC');
            
        return $qb->getQuery()->getResult();
    }

    /**
     * Recherche avancée de véhicules avec filtres multiples
     */
    public function searchVehicules(
        ?string $marque = null,
        ?string $modele = null,
        ?string $energie = null,
        ?\DateTime $dateMin = null,
        ?\DateTime $dateMax = null,
        ?string $immatriculation = null,
        ?string $vin = null,
        ?string $clientNom = null,
        int $page = 1,
        int $limit = 10,
        string $sortBy = 'id',
        string $sortOrder = 'DESC'
    ): array {
        $qb = $this->createQueryBuilder('v')
            ->leftJoin('v.marque', 'm')
            ->leftJoin('v.modele', 'mod')
            ->leftJoin('v.energie', 'e')
            ->leftJoin('v.client', 'c');
            
        // Appliquer les filtres
        if ($marque) {
            $qb->andWhere('m.libelle = :marque')
               ->setParameter('marque', $marque);
        }
        
        if ($modele) {
            $qb->andWhere('mod.libelle LIKE :modele')
               ->setParameter('modele', '%' . $modele . '%');
        }
        
        if ($energie) {
            $qb->andWhere('e.libelle = :energie')
               ->setParameter('energie', $energie);
        }
        
        if ($dateMin) {
            $qb->andWhere('v.dateMiseCirculation >= :dateMin')
               ->setParameter('dateMin', $dateMin);
        }
        
        if ($dateMax) {
            $qb->andWhere('v.dateMiseCirculation <= :dateMax')
               ->setParameter('dateMax', $dateMax);
        }
        
        if ($immatriculation) {
            $qb->andWhere('v.immatriculation LIKE :immatriculation')
               ->setParameter('immatriculation', '%' . $immatriculation . '%');
        }
        
        if ($vin) {
            $qb->andWhere('v.vin LIKE :vin')
               ->setParameter('vin', '%' . $vin . '%');
        }
        
        if ($clientNom) {
            $qb->andWhere('c.nom LIKE :clientNom')
               ->setParameter('clientNom', '%' . $clientNom . '%');
        }
        
        // Compter le nombre total de résultats de manière optimisée
        $countQb = clone $qb;
        $countQb->select('COUNT(DISTINCT v.id)');
        $total = $countQb->getQuery()->getSingleScalarResult();
        
        // Appliquer le tri
        $allowedSortFields = [
            'id' => 'v.id',
            'immatriculation' => 'v.immatriculation',
            'vin' => 'v.vin',
            'dateMiseCirculation' => 'v.dateMiseCirculation',
            'marque' => 'm.libelle',
            'modele' => 'mod.libelle',
            'energie' => 'e.libelle',
            'clientNom' => 'c.nom'
        ];
        
        $sortField = $allowedSortFields[$sortBy] ?? 'v.id';
        $qb->orderBy($sortField, $sortOrder === 'ASC' ? 'ASC' : 'DESC');
        
        // Appliquer la pagination
        $qb->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);
        
        // Exécuter la requête
        $items = $qb->getQuery()->getResult();
        
        return [
            'items' => $items,
            'total' => $total
        ];
    }
} 