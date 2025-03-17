<?php

namespace App\Repository;

use App\Entity\Marque;
use App\Entity\Modele;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Modele>
 *
 * @method Modele|null find($id, $lockMode = null, $lockVersion = null)
 * @method Modele|null findOneBy(array $criteria, array $orderBy = null)
 * @method Modele[]    findAll()
 * @method Modele[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ModeleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Modele::class);
    }

    public function findOrCreateByLibelleAndMarque(string $libelle, Marque $marque): Modele
    {
        $modele = $this->findOneBy([
            'libelle' => $libelle,
            'marque' => $marque
        ]);
        
        if (!$modele) {
            $modele = new Modele();
            $modele->setLibelle($libelle);
            $modele->setMarque($marque);
        }
        
        return $modele;
    }
} 