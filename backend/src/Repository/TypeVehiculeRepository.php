<?php

namespace App\Repository;

use App\Entity\TypeVehicule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TypeVehicule>
 *
 * @method TypeVehicule|null find($id, $lockMode = null, $lockVersion = null)
 * @method TypeVehicule|null findOneBy(array $criteria, array $orderBy = null)
 * @method TypeVehicule[]    findAll()
 * @method TypeVehicule[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TypeVehiculeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TypeVehicule::class);
    }

    public function findOrCreateByLibelle(string $libelle): TypeVehicule
    {
        $typeVehicule = $this->findOneBy(['libelle' => $libelle]);
        
        if (!$typeVehicule) {
            $typeVehicule = new TypeVehicule();
            $typeVehicule->setLibelle($libelle);
        }
        
        return $typeVehicule;
    }
} 