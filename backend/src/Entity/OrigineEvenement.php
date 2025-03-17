<?php

namespace App\Entity;

use App\Repository\OrigineEvenementRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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

#[ORM\Entity(repositoryClass: OrigineEvenementRepository::class)]
#[ORM\Table(name: 'origines_evenements')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['origine_evenement:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['origine_evenement:read', 'origine_evenement:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['origine_evenement:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['origine_evenement:write']]
        ),
        new Delete()
    ],
    order: ['libelle' => 'ASC'],
    paginationItemsPerPage: 50
)]
#[ApiFilter(SearchFilter::class, properties: ['libelle' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'libelle'])]
class OrigineEvenement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['origine_evenement:read', 'evenement:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['origine_evenement:read', 'origine_evenement:write', 'evenement:read'])]
    private ?string $libelle = null;

    #[ORM\OneToMany(mappedBy: 'origine', targetEntity: Evenement::class)]
    #[Groups(['origine_evenement:item'])]
    private Collection $evenements;

    public function __construct()
    {
        $this->evenements = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Evenement>
     */
    public function getEvenements(): Collection
    {
        return $this->evenements;
    }

    public function addEvenement(Evenement $evenement): static
    {
        if (!$this->evenements->contains($evenement)) {
            $this->evenements->add($evenement);
            $evenement->setOrigine($this);
        }

        return $this;
    }

    public function removeEvenement(Evenement $evenement): static
    {
        if ($this->evenements->removeElement($evenement)) {
            // set the owning side to null (unless already changed)
            if ($evenement->getOrigine() === $this) {
                $evenement->setOrigine(null);
            }
        }

        return $this;
    }
} 