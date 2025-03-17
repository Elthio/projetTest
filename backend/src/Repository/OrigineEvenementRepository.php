<?php

namespace App\Repository;

use App\Entity\OrigineEvenement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<OrigineEvenement>
 *
 * @method OrigineEvenement|null find($id, $lockMode = null, $lockVersion = null)
 * @method OrigineEvenement|null findOneBy(array $criteria, array $orderBy = null)
 * @method OrigineEvenement[]    findAll()
 * @method OrigineEvenement[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrigineEvenementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, OrigineEvenement::class);
    }

    public function findOrCreateByLibelle(string $libelle): OrigineEvenement
    {
        $origineEvenement = $this->findOneBy(['libelle' => $libelle]);
        
        if (!$origineEvenement) {
            $origineEvenement = new OrigineEvenement();
            $origineEvenement->setLibelle($libelle);
        }
        
        return $origineEvenement;
    }
} 