<?php

namespace App\Entity;

use App\Repository\VendeurRepository;
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
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: VendeurRepository::class)]
#[ORM\Table(name: 'vendeurs')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['vendeur:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['vendeur:read', 'vendeur:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['vendeur:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['vendeur:write']]
        ),
        new Delete()
    ],
    order: ['nom' => 'ASC'],
    paginationItemsPerPage: 50
)]
#[ApiFilter(SearchFilter::class, properties: ['nom' => 'partial', 'prenom' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'nom', 'prenom'])]
#[ApiFilter(BooleanFilter::class, properties: ['estVn', 'estVo'])]
class Vendeur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['vendeur:read', 'vente:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['vendeur:read', 'vendeur:write', 'vente:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 100)]
    #[Groups(['vendeur:read', 'vendeur:write', 'vente:read'])]
    private ?string $prenom = null;

    #[ORM\Column]
    #[Groups(['vendeur:read', 'vendeur:write'])]
    private ?bool $estVn = true;

    #[ORM\Column]
    #[Groups(['vendeur:read', 'vendeur:write'])]
    private ?bool $estVo = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function isEstVn(): ?bool
    {
        return $this->estVn;
    }

    public function setEstVn(bool $estVn): static
    {
        $this->estVn = $estVn;

        return $this;
    }

    public function isEstVo(): ?bool
    {
        return $this->estVo;
    }

    public function setEstVo(bool $estVo): static
    {
        $this->estVo = $estVo;

        return $this;
    }
} 