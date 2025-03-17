<?php

namespace App\Repository;

use App\Entity\Energie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Energie>
 *
 * @method Energie|null find($id, $lockMode = null, $lockVersion = null)
 * @method Energie|null findOneBy(array $criteria, array $orderBy = null)
 * @method Energie[]    findAll()
 * @method Energie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EnergieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Energie::class);
    }

    public function findOrCreateByLibelle(string $libelle): Energie
    {
        $energie = $this->findOneBy(['libelle' => $libelle]);
        
        if (!$energie) {
            $energie = new Energie();
            $energie->setLibelle($libelle);
        }
        
        return $energie;
    }
} 