<?php

namespace App\Repository;

use App\Entity\TypeClient;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TypeClient>
 *
 * @method TypeClient|null find($id, $lockMode = null, $lockVersion = null)
 * @method TypeClient|null findOneBy(array $criteria, array $orderBy = null)
 * @method TypeClient[]    findAll()
 * @method TypeClient[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TypeClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TypeClient::class);
    }

    public function findOrCreateByLibelle(string $libelle): TypeClient
    {
        $typeClient = $this->findOneBy(['libelle' => $libelle]);
        
        if (!$typeClient) {
            $typeClient = new TypeClient();
            $typeClient->setLibelle($libelle);
        }
        
        return $typeClient;
    }
} 