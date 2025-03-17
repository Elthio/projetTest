<?php

namespace App\Repository;

use App\Entity\Civilite;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Civilite>
 *
 * @method Civilite|null find($id, $lockMode = null, $lockVersion = null)
 * @method Civilite|null findOneBy(array $criteria, array $orderBy = null)
 * @method Civilite[]    findAll()
 * @method Civilite[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CiviliteRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Civilite::class);
    }

    public function findOrCreateByLibelle(string $libelle): Civilite
    {
        // Normaliser le libellé pour éviter les doublons (Mr, M., M, etc.)
        $normalizedLibelle = $this->normalizeLibelle($libelle);
        
        // Rechercher d'abord par le libellé normalisé
        $civilite = $this->findOneBy(['libelle' => $normalizedLibelle]);
        
        // Si non trouvé, rechercher par le libellé original
        if (!$civilite && $normalizedLibelle !== $libelle) {
            $civilite = $this->findOneBy(['libelle' => $libelle]);
        }
        
        // Si toujours pas trouvé, créer une nouvelle entité
        if (!$civilite) {
            $civilite = new Civilite();
            $civilite->setLibelle($normalizedLibelle);
        }
        
        return $civilite;
    }
    
    /**
     * Normalise le libellé de civilité pour éviter les doublons
     */
    public function normalizeLibelle(string $libelle): string
    {
        // Supprimer les espaces et les points, mettre en majuscules
        $normalized = trim(strtoupper(str_replace('.', '', $libelle)));
        
        // Mappings connus
        $mappings = [
            'M' => 'MR',
            'MONSIEUR' => 'MR',
            'MME' => 'MME',
            'MADAME' => 'MME',
            'MLLE' => 'MLLE',
            'MADEMOISELLE' => 'MLLE',
        ];
        
        return $mappings[$normalized] ?? $normalized;
    }
} 