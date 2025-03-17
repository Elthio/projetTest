<?php

namespace App\Entity;

use App\Repository\MarqueRepository;
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

#[ORM\Entity(repositoryClass: MarqueRepository::class)]
#[ORM\Table(name: 'marques')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['marque:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['marque:read', 'marque:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['marque:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['marque:write']]
        ),
        new Delete()
    ],
    order: ['libelle' => 'ASC'],
    paginationItemsPerPage: 50
)]
#[ApiFilter(SearchFilter::class, properties: ['libelle' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'libelle'])]
class Marque
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['marque:read', 'vehicule:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['marque:read', 'marque:write', 'vehicule:read', 'modele:read'])]
    private ?string $libelle = null;

    #[ORM\OneToMany(mappedBy: 'marque', targetEntity: Modele::class, cascade: ['persist', 'remove'])]
    #[Groups(['marque:item'])]
    private Collection $modeles;

    #[ORM\OneToMany(mappedBy: 'marque', targetEntity: Vehicule::class)]
    private Collection $vehicules;

    public function __construct()
    {
        $this->modeles = new ArrayCollection();
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
     * @return Collection<int, Modele>
     */
    public function getModeles(): Collection
    {
        return $this->modeles;
    }

    public function addModele(Modele $modele): static
    {
        if (!$this->modeles->contains($modele)) {
            $this->modeles->add($modele);
            $modele->setMarque($this);
        }

        return $this;
    }

    public function removeModele(Modele $modele): static
    {
        if ($this->modeles->removeElement($modele)) {
            // set the owning side to null (unless already changed)
            if ($modele->getMarque() === $this) {
                $modele->setMarque(null);
            }
        }

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
            $vehicule->setMarque($this);
        }

        return $this;
    }

    public function removeVehicule(Vehicule $vehicule): static
    {
        if ($this->vehicules->removeElement($vehicule)) {
            // set the owning side to null (unless already changed)
            if ($vehicule->getMarque() === $this) {
                $vehicule->setMarque(null);
            }
        }

        return $this;
    }
} 