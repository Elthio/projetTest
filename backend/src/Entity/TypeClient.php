<?php

namespace App\Entity;

use App\Repository\TypeClientRepository;
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

#[ORM\Entity(repositoryClass: TypeClientRepository::class)]
#[ORM\Table(name: 'types_clients')]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['type_client:read']]
        ),
        new Get(
            normalizationContext: ['groups' => ['type_client:read', 'type_client:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['type_client:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['type_client:write']]
        ),
        new Delete()
    ],
    order: ['libelle' => 'ASC'],
    paginationItemsPerPage: 50
)]
#[ApiFilter(SearchFilter::class, properties: ['libelle' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'libelle'])]
class TypeClient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['type_client:read', 'vehicule:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['type_client:read', 'type_client:write', 'vehicule:read'])]
    private ?string $libelle = null;

    #[ORM\OneToMany(mappedBy: 'typeClient', targetEntity: Vehicule::class)]
    #[Groups(['type_client:item'])]
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
            $vehicule->setTypeClient($this);
        }

        return $this;
    }

    public function removeVehicule(Vehicule $vehicule): static
    {
        if ($this->vehicules->removeElement($vehicule)) {
            // set the owning side to null (unless already changed)
            if ($vehicule->getTypeClient() === $this) {
                $vehicule->setTypeClient(null);
            }
        }

        return $this;
    }
} 