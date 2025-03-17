<?php

namespace App\Entity;

use App\Repository\VenteRepository;
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

#[ORM\Entity(repositoryClass: VenteRepository::class)]
#[ORM\Table(name: 'ventes', indexes: [
    new ORM\Index(name: 'idx_vente_numero_dossier', columns: ['numero_dossier']),
    new ORM\Index(name: 'idx_vente_type_vn_vo', columns: ['type_vn_vo']),
    new ORM\Index(name: 'idx_vente_date_achat', columns: ['date_achat']),
    new ORM\Index(name: 'idx_vente_date_livraison', columns: ['date_livraison'])
])]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['vente:read', 'vente:collection']]
        ),
        new Get(
            normalizationContext: ['groups' => ['vente:read', 'vente:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['vente:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['vente:write']]
        ),
        new Delete()
    ],
    order: ['dateAchat' => 'DESC'],
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: [
    'numeroDossier' => 'partial',
    'typeVnVo' => 'exact',
    'client.nom' => 'partial',
    'vehicule.immatriculation' => 'partial',
    'vehicule.vin' => 'partial',
    'vehicule.marque.libelle' => 'exact',
    'vehicule.modele.libelle' => 'partial',
    'vendeurVn.nom' => 'partial',
    'vendeurVo.nom' => 'partial'
])]
#[ApiFilter(OrderFilter::class, properties: [
    'id', 'dateAchat', 'dateLivraison', 'numeroDossier', 
    'client.nom', 'vehicule.immatriculation'
])]
#[ApiFilter(DateFilter::class, properties: ['dateAchat', 'dateLivraison'])]
#[ApiFilter(ExistsFilter::class, properties: ['client', 'vehicule', 'vendeurVn', 'vendeurVo'])]
class Vente
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['vente:read', 'client:read', 'vehicule:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'ventes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vente:read', 'vente:write'])]
    private ?Vehicule $vehicule = null;

    #[ORM\ManyToOne(inversedBy: 'ventes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['vente:read', 'vente:write'])]
    private ?Client $client = null;

    #[ORM\ManyToOne]
    #[Groups(['vente:read', 'vente:write'])]
    private ?Vendeur $vendeurVn = null;

    #[ORM\ManyToOne]
    #[Groups(['vente:read', 'vente:write'])]
    private ?Vendeur $vendeurVo = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['vente:read', 'vente:write'])]
    private ?\DateTimeInterface $dateAchat = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['vente:read', 'vente:write'])]
    private ?\DateTimeInterface $dateLivraison = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['vente:read', 'vente:write'])]
    private ?string $typeVnVo = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['vente:read', 'vente:write'])]
    private ?string $numeroDossier = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['vente:read', 'vente:write'])]
    private ?string $intermediaireVente = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $commentaire = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;

        return $this;
    }

    public function getVendeurVn(): ?Vendeur
    {
        return $this->vendeurVn;
    }

    public function setVendeurVn(?Vendeur $vendeurVn): static
    {
        $this->vendeurVn = $vendeurVn;

        return $this;
    }

    public function getVendeurVo(): ?Vendeur
    {
        return $this->vendeurVo;
    }

    public function setVendeurVo(?Vendeur $vendeurVo): static
    {
        $this->vendeurVo = $vendeurVo;

        return $this;
    }

    public function getDateAchat(): ?\DateTimeInterface
    {
        return $this->dateAchat;
    }

    public function setDateAchat(?\DateTimeInterface $dateAchat): static
    {
        $this->dateAchat = $dateAchat;

        return $this;
    }

    public function getDateLivraison(): ?\DateTimeInterface
    {
        return $this->dateLivraison;
    }

    public function setDateLivraison(?\DateTimeInterface $dateLivraison): static
    {
        $this->dateLivraison = $dateLivraison;

        return $this;
    }

    public function getTypeVnVo(): ?string
    {
        return $this->typeVnVo;
    }

    public function setTypeVnVo(?string $typeVnVo): static
    {
        $this->typeVnVo = $typeVnVo;

        return $this;
    }

    public function getNumeroDossier(): ?string
    {
        return $this->numeroDossier;
    }

    public function setNumeroDossier(?string $numeroDossier): static
    {
        $this->numeroDossier = $numeroDossier;

        return $this;
    }

    public function getIntermediaireVente(): ?string
    {
        return $this->intermediaireVente;
    }

    public function setIntermediaireVente(?string $intermediaireVente): static
    {
        $this->intermediaireVente = $intermediaireVente;

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
} 