<?php

namespace App\Repository;

use App\Entity\Vente;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Vente>
 *
 * @method Vente|null find($id, $lockMode = null, $lockVersion = null)
 * @method Vente|null findOneBy(array $criteria, array $orderBy = null)
 * @method Vente[]    findAll()
 * @method Vente[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VenteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Vente::class);
    }

    /**
     * Compte le nombre de ventes par mois sur les 12 derniers mois
     * @return array
     */
    public function countByMonth(): array
    {
        $conn = $this->getEntityManager()->getConnection();
        
        $sql = '
            SELECT 
                DATE_FORMAT(date_achat, "%Y-%m") as mois,
                COUNT(id) as count
            FROM ventes
            WHERE date_achat >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
            GROUP BY mois
            ORDER BY mois ASC
        ';
        
        $stmt = $conn->prepare($sql);
        $result = $stmt->executeQuery();
        
        return $result->fetchAllAssociative();
    }

    /**
     * Recherche avancée de ventes avec filtres multiples
     */
    public function searchVentes(
        ?string $numeroDossier = null,
        ?string $typeVnVo = null,
        ?string $clientNom = null,
        ?string $vehiculeVin = null,
        ?string $vehiculeImmatriculation = null,
        ?string $vendeurNom = null,
        ?\DateTime $dateAchatMin = null,
        ?\DateTime $dateAchatMax = null,
        ?\DateTime $dateLivraisonMin = null,
        ?\DateTime $dateLivraisonMax = null,
        int $page = 1,
        int $limit = 10,
        string $sortBy = 'id',
        string $sortOrder = 'DESC'
    ): array {
        $qb = $this->createQueryBuilder('v')
            ->leftJoin('v.client', 'c')
            ->leftJoin('v.vehicule', 'veh')
            ->leftJoin('v.vendeurVn', 'vendVn')
            ->leftJoin('v.vendeurVo', 'vendVo');
            
        // Appliquer les filtres
        if ($numeroDossier) {
            $qb->andWhere('v.numeroDossier LIKE :numeroDossier')
               ->setParameter('numeroDossier', '%' . $numeroDossier . '%');
        }
        
        if ($typeVnVo) {
            $qb->andWhere('v.typeVnVo = :typeVnVo')
               ->setParameter('typeVnVo', $typeVnVo);
        }
        
        if ($clientNom) {
            $qb->andWhere('c.nom LIKE :clientNom')
               ->setParameter('clientNom', '%' . $clientNom . '%');
        }
        
        if ($vehiculeVin) {
            $qb->andWhere('veh.vin LIKE :vehiculeVin')
               ->setParameter('vehiculeVin', '%' . $vehiculeVin . '%');
        }
        
        if ($vehiculeImmatriculation) {
            $qb->andWhere('veh.immatriculation LIKE :vehiculeImmatriculation')
               ->setParameter('vehiculeImmatriculation', '%' . $vehiculeImmatriculation . '%');
        }
        
        if ($vendeurNom) {
            $qb->andWhere('vendVn.nom LIKE :vendeurNom OR vendVo.nom LIKE :vendeurNom')
               ->setParameter('vendeurNom', '%' . $vendeurNom . '%');
        }
        
        // Filtres de date
        if ($dateAchatMin) {
            $qb->andWhere('v.dateAchat >= :dateAchatMin')
               ->setParameter('dateAchatMin', $dateAchatMin);
        }
        
        if ($dateAchatMax) {
            $qb->andWhere('v.dateAchat <= :dateAchatMax')
               ->setParameter('dateAchatMax', $dateAchatMax);
        }
        
        if ($dateLivraisonMin) {
            $qb->andWhere('v.dateLivraison >= :dateLivraisonMin')
               ->setParameter('dateLivraisonMin', $dateLivraisonMin);
        }
        
        if ($dateLivraisonMax) {
            $qb->andWhere('v.dateLivraison <= :dateLivraisonMax')
               ->setParameter('dateLivraisonMax', $dateLivraisonMax);
        }
        
        // Compter le nombre total de résultats de manière optimisée
        $countQb = clone $qb;
        $countQb->select('COUNT(DISTINCT v.id)');
        $total = $countQb->getQuery()->getSingleScalarResult();
        
        // Appliquer le tri
        $allowedSortFields = [
            'id' => 'v.id',
            'numeroDossier' => 'v.numeroDossier',
            'typeVnVo' => 'v.typeVnVo',
            'dateAchat' => 'v.dateAchat',
            'dateLivraison' => 'v.dateLivraison',
            'clientNom' => 'c.nom',
            'vehiculeVin' => 'veh.vin',
            'vehiculeImmatriculation' => 'veh.immatriculation',
            'vendeurVnNom' => 'vendVn.nom',
            'vendeurVoNom' => 'vendVo.nom'
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