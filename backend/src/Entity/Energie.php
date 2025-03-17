<?php

namespace App\Entity;

use App\Repository\EnergieRepository;
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

#[ORM\Entity(repositoryClass: EnergieRepository::class)]
#[ORM\Table(name: 'energies')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['energie:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['energie:read']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['energie:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['energie:write']]
        ),
        new Delete()
    ],
    order: ['libelle' => 'ASC'],
    paginationItemsPerPage: 50
)]
#[ApiFilter(SearchFilter::class, properties: ['libelle' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'libelle'])]
class Energie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['energie:read', 'vehicule:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['energie:read', 'energie:write', 'vehicule:read'])]
    private ?string $libelle = null;

    #[ORM\OneToMany(mappedBy: 'energie', targetEntity: Vehicule::class)]
    private Collection $vehicules;

    public function __construct()
    {
        $this->vehicules = new ArrayCollection();
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
     * @return Collection<int, Vehicule>
     */
    public function getVehicules(): Collection
    {
        return $this->vehicules;
    }

    public function addVehicule(Vehicule $vehicule): static
    {
        if (!$this->vehicules->contains($vehicule)) {
            $this->vehicules->add($vehicule);
            $vehicule->setEnergie($this);
        }

        return $this;
    }

    public function removeVehicule(Vehicule $vehicule): static
    {
        if ($this->vehicules->removeElement($vehicule)) {
            // set the owning side to null (unless already changed)
            if ($vehicule->getEnergie() === $this) {
                $vehicule->setEnergie(null);
            }
        }

        return $this;
    }
} 