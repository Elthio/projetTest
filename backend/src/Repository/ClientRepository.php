<?php

namespace App\Repository;

use App\Entity\Client;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Client>
 *
 * @method Client|null find($id, $lockMode = null, $lockVersion = null)
 * @method Client|null findOneBy(array $criteria, array $orderBy = null)
 * @method Client[]    findAll()
 * @method Client[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    public function findOrCreateByNomPrenom(string $nom, ?string $prenom = null): Client
    {
        $criteria = ['nom' => $nom];
        if ($prenom) {
            $criteria['prenom'] = $prenom;
        }
        
        $client = $this->findOneBy($criteria);
        
        if (!$client) {
            $client = new Client();
            $client->setNom($nom);
            if ($prenom) {
                $client->setPrenom($prenom);
            }
        }
        
        return $client;
    }

    /**
     * Recherche avancée de clients avec filtres multiples
     */
    public function searchClients(
        ?string $nom = null,
        ?string $civilite = null,
        ?string $codePostal = null,
        ?string $ville = null,
        ?string $email = null,
        ?string $telephone = null,
        ?bool $estProprietaire = null,
        int $page = 1,
        int $limit = 10,
        string $sortBy = 'id',
        string $sortOrder = 'DESC'
    ): array {
        $qb = $this->createQueryBuilder('c')
            ->leftJoin('c.civilite', 'civ')
            ->leftJoin('c.adresses', 'a')
            ->leftJoin('c.contacts', 'cont');
            
        // Appliquer les filtres
        if ($nom) {
            $qb->andWhere('c.nom LIKE :nom')
               ->setParameter('nom', '%' . $nom . '%');
        }
        
        if ($civilite) {
            $qb->andWhere('civ.libelle = :civilite')
               ->setParameter('civilite', $civilite);
        }
        
        if ($codePostal) {
            $qb->andWhere('a.codePostal LIKE :codePostal')
               ->setParameter('codePostal', '%' . $codePostal . '%');
        }
        
        if ($ville) {
            $qb->andWhere('a.ville LIKE :ville')
               ->setParameter('ville', '%' . $ville . '%');
        }
        
        if ($email) {
            $qb->andWhere('cont.email LIKE :email')
               ->setParameter('email', '%' . $email . '%');
        }
        
        if ($telephone) {
            $qb->andWhere('cont.telephonePortable LIKE :telephone OR cont.telephoneFixe LIKE :telephone')
               ->setParameter('telephone', '%' . $telephone . '%');
        }
        
        if ($estProprietaire !== null) {
            $qb->andWhere('c.estProprietaireActuel = :estProprietaire')
               ->setParameter('estProprietaire', $estProprietaire);
        }
        
        // Éviter les doublons dus aux jointures
        $qb->groupBy('c.id');
        
        // Compter le nombre total de résultats de manière optimisée
        $countQb = clone $qb;
        $countQb->select('COUNT(DISTINCT c.id)');
        $total = $countQb->getQuery()->getSingleScalarResult();
        
        // Appliquer le tri
        $allowedSortFields = [
            'id' => 'c.id',
            'nom' => 'c.nom',
            'civilite' => 'civ.libelle',
            'ville' => 'a.ville',
            'codePostal' => 'a.codePostal',
            'email' => 'cont.email'
        ];
        
        $sortField = $allowedSortFields[$sortBy] ?? 'c.id';
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