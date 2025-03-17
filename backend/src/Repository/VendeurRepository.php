<?php

namespace App\Repository;

use App\Entity\Vendeur;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Vendeur>
 *
 * @method Vendeur|null find($id, $lockMode = null, $lockVersion = null)
 * @method Vendeur|null findOneBy(array $criteria, array $orderBy = null)
 * @method Vendeur[]    findAll()
 * @method Vendeur[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VendeurRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Vendeur::class);
    }

    public function findOrCreateByNomPrenom(string $nom, string $prenom): Vendeur
    {
        $vendeur = $this->findOneBy([
            'nom' => $nom,
            'prenom' => $prenom
        ]);
        
        if (!$vendeur) {
            $vendeur = new Vendeur();
            $vendeur->setNom($nom);
            $vendeur->setPrenom($prenom);
        }
        
        return $vendeur;
    }
} 