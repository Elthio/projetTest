<?php

namespace App\Entity;

use App\Repository\TypeVehiculeRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TypeVehiculeRepository::class)]
#[ORM\Table(name: 'types_vehicules')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['type_vehicule:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['type_vehicule:read']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['type_vehicule:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['type_vehicule:write']]
        ),
        new Delete()
    ],
    order: ['libelle' => 'ASC'],
    paginationItemsPerPage: 50
)]
#[ApiFilter(SearchFilter::class, properties: ['libelle' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'libelle'])]
class TypeVehicule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['type_vehicule:read', 'vente:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 10, unique: true)]
    #[Groups(['type_vehicule:read', 'type_vehicule:write', 'vente:read'])]
    private ?string $libelle = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLibelle(): ?string
    {
        return $this->libelle;
    }

    public function setLibelle(string $libelle): static
    {
        $this->libelle = $libelle;

        return $this;
    }
} 