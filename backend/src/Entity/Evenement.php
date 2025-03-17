<?php

namespace App\Entity;

use App\Repository\EvenementRepository;
use Doctrine\DBAL\Types\Types;
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
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: EvenementRepository::class)]
#[ORM\Table(name: 'evenements')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['evenement:read', 'evenement:collection']]
        ),
        new Get(
            normalizationContext: ['groups' => ['evenement:read', 'evenement:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['evenement:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['evenement:write']]
        ),
        new Delete()
    ],
    order: ['dateEvenement' => 'DESC'],
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: [
    'compteEvenement' => 'partial',
    'vehicule.vin' => 'partial',
    'vehicule.immatriculation' => 'partial',
    'origine.libelle' => 'exact',
    'commentaire' => 'partial'
])]
#[ApiFilter(OrderFilter::class, properties: [
    'id', 'dateEvenement', 'kilometrage'
])]
#[ApiFilter(DateFilter::class, properties: ['dateEvenement'])]
#[ApiFilter(ExistsFilter::class, properties: ['origine'])]
class Evenement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['evenement:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['evenement:read', 'evenement:write'])]
    private ?string $compteEvenement = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['evenement:read', 'evenement:write'])]
    private ?string $compteDernierEvenement = null;

    #[ORM\ManyToOne(inversedBy: 'evenements')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['evenement:read', 'evenement:write'])]
    private ?Vehicule $vehicule = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['evenement:read', 'evenement:write'])]
    private ?\DateTimeInterface $dateEvenement = null;

    #[ORM\ManyToOne(inversedBy: 'evenements')]
    #[Groups(['evenement:read', 'evenement:write'])]
    private ?OrigineEvenement $origine = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['evenement:read', 'evenement:write'])]
    private ?string $commentaire = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['evenement:read', 'evenement:write'])]
    private ?int $kilometrage = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCompteEvenement(): ?string
    {
        return $this->compteEvenement;
    }

    public function setCompteEvenement(?string $compteEvenement): static
    {
        $this->compteEvenement = $compteEvenement;

        return $this;
    }

    public function getCompteDernierEvenement(): ?string
    {
        return $this->compteDernierEvenement;
    }

    public function setCompteDernierEvenement(?string $compteDernierEvenement): static
    {
        $this->compteDernierEvenement = $compteDernierEvenement;

        return $this;
    }

    public function getVehicule(): ?Vehicule
    {
        return $this->vehicule;
    }

    public function setVehicule(?Vehicule $vehicule): static
    {
        $this->vehicule = $vehicule;

        return $this;
    }

    public function getDateEvenement(): ?\DateTimeInterface
    {
        return $this->dateEvenement;
    }

    public function setDateEvenement(?\DateTimeInterface $dateEvenement): static
    {
        $this->dateEvenement = $dateEvenement;

        return $this;
    }

    public function getOrigine(): ?OrigineEvenement
    {
        return $this->origine;
    }

    public function setOrigine(?OrigineEvenement $origine): static
    {
        $this->origine = $origine;

        return $this;
    }

    public function getCommentaire(): ?string
    {
        return $this->commentaire;
    }

    public function setCommentaire(?string $commentaire): static
    {
        $this->commentaire = $commentaire;

        return $this;
    }

    public function getKilometrage(): ?int
    {
        return $this->kilometrage;
    }

    public function setKilometrage(?int $kilometrage): static
    {
        $this->kilometrage = $kilometrage;

        return $this;
    }
} 