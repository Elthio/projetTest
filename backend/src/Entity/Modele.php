<?php

namespace App\Entity;

use App\Repository\ModeleRepository;
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

#[ORM\Entity(repositoryClass: ModeleRepository::class)]
#[ORM\Table(name: 'modeles')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['modele:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['modele:read', 'modele:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['modele:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['modele:write']]
        ),
        new Delete()
    ],
    order: ['libelle' => 'ASC'],
    paginationItemsPerPage: 50
)]
#[ApiFilter(SearchFilter::class, properties: [
    'libelle' => 'partial',
    'marque.libelle' => 'partial'
])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'libelle', 'marque.libelle'])]
class Modele
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['modele:read', 'vehicule:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['modele:read', 'modele:write', 'vehicule:read', 'marque:read'])]
    private ?string $libelle = null;

    #[ORM\ManyToOne(inversedBy: 'modeles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['modele:read', 'modele:write', 'vehicule:read'])]
    private ?Marque $marque = null;

    #[ORM\OneToMany(mappedBy: 'modele', targetEntity: Vehicule::class)]
    private Collection $vehicules;

    public function __construct()
    {
        $this->vehicules = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMarque(): ?Marque
    {
        return $this->marque;
    }

    public function setMarque(?Marque $marque): static
    {
        $this->marque = $marque;

        return $this;
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
            $vehicule->setModele($this);
        }

        return $this;
    }

    public function removeVehicule(Vehicule $vehicule): static
    {
        if ($this->vehicules->removeElement($vehicule)) {
            // set the owning side to null (unless already changed)
            if ($vehicule->getModele() === $this) {
                $vehicule->setModele(null);
            }
        }

        return $this;
    }
} 