<?php

namespace App\Entity;

use App\Repository\VehiculeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: VehiculeRepository::class)]
#[ORM\Table(name: 'vehicules', indexes: [
    new ORM\Index(name: 'idx_vehicule_vin', columns: ['vin']),
    new ORM\Index(name: 'idx_vehicule_immatriculation', columns: ['immatriculation']),
    new ORM\Index(name: 'idx_vehicule_date_mise_circulation', columns: ['date_mise_circulation'])
])]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['vehicule:read', 'vehicule:collection']]
        ),
        new Get(
            normalizationContext: ['groups' => ['vehicule:read', 'vehicule:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['vehicule:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['vehicule:write']]
        ),
        new Delete()
    ],
    order: ['id' => 'DESC'],
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: [
    'vin' => 'partial',
    'immatriculation' => 'partial',
    'marque.libelle' => 'exact',
    'modele.libelle' => 'partial',
    'energie.libelle' => 'exact',
    'client.nom' => 'partial',
    'version' => 'partial'
])]
#[ApiFilter(OrderFilter::class, properties: [
    'id', 'vin', 'immatriculation', 'dateMiseCirculation', 
    'marque.libelle', 'modele.libelle', 'energie.libelle',
    'client.nom'
])]
#[ApiFilter(DateFilter::class, properties: ['dateMiseCirculation'])]
#[ApiFilter(ExistsFilter::class, properties: ['client', 'modele', 'energie'])]
class Vehicule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['vehicule:read', 'client:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['vehicule:read', 'vehicule:write', 'client:read'])]
    private ?string $vin = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['vehicule:read', 'vehicule:write', 'client:read'])]
    private ?string $immatriculation = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?\DateTimeInterface $dateMiseCirculation = null;

    #[ORM\ManyToOne(inversedBy: 'vehicules')]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?Marque $marque = null;

    #[ORM\ManyToOne(inversedBy: 'vehicules')]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?Modele $modele = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?string $version = null;

    #[ORM\ManyToOne(inversedBy: 'vehicules')]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?Energie $energie = null;

    #[ORM\ManyToOne(inversedBy: 'vehicules')]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?TypeClient $typeClient = null;

    #[ORM\ManyToOne(inversedBy: 'vehicules')]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?Client $client = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['vehicule:read', 'vehicule:write'])]
    private ?string $numeroFiche = null;

    #[ORM\OneToMany(mappedBy: 'vehicule', targetEntity: Evenement::class, cascade: ['persist', 'remove'])]
    #[Groups(['vehicule:item'])]
    private Collection $evenements;

    #[ORM\OneToMany(mappedBy: 'vehicule', targetEntity: Vente::class, cascade: ['persist', 'remove'])]
    #[Groups(['vehicule:item'])]
    private Collection $ventes;

    public function __construct()
    {
        $this->evenements = new ArrayCollection();
        $this->ventes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVin(): ?string
    {
        return $this->vin;
    }

    public function setVin(?string $vin): static
    {
        $this->vin = $vin;

        return $this;
    }

    public function getImmatriculation(): ?string
    {
        return $this->immatriculation;
    }

    public function setImmatriculation(?string $immatriculation): static
    {
        $this->immatriculation = $immatriculation;

        return $this;
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

    public function getModele(): ?Modele
    {
        return $this->modele;
    }

    public function setModele(?Modele $modele): static
    {
        $this->modele = $modele;

        return $this;
    }

    public function getVersion(): ?string
    {
        return $this->version;
    }

    public function setVersion(?string $version): static
    {
        $this->version = $version;

        return $this;
    }

    public function getEnergie(): ?Energie
    {
        return $this->energie;
    }

    public function setEnergie(?Energie $energie): static
    {
        $this->energie = $energie;

        return $this;
    }

    public function getDateMiseCirculation(): ?\DateTimeInterface
    {
        return $this->dateMiseCirculation;
    }

    public function setDateMiseCirculation(?\DateTimeInterface $dateMiseCirculation): static
    {
        $this->dateMiseCirculation = $dateMiseCirculation;

        return $this;
    }

    public function getTypeClient(): ?TypeClient
    {
        return $this->typeClient;
    }

    public function setTypeClient(?TypeClient $typeClient): static
    {
        $this->typeClient = $typeClient;

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

    public function getNumeroFiche(): ?string
    {
        return $this->numeroFiche;
    }

    public function setNumeroFiche(?string $numeroFiche): static
    {
        $this->numeroFiche = $numeroFiche;

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
            $evenement->setVehicule($this);
        }

        return $this;
    }

    public function removeEvenement(Evenement $evenement): static
    {
        if ($this->evenements->removeElement($evenement)) {
            // set the owning side to null (unless already changed)
            if ($evenement->getVehicule() === $this) {
                $evenement->setVehicule(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Vente>
     */
    public function getVentes(): Collection
    {
        return $this->ventes;
    }

    public function addVente(Vente $vente): static
    {
        if (!$this->ventes->contains($vente)) {
            $this->ventes->add($vente);
            $vente->setVehicule($this);
        }

        return $this;
    }

    public function removeVente(Vente $vente): static
    {
        if ($this->ventes->removeElement($vente)) {
            // set the owning side to null (unless already changed)
            if ($vente->getVehicule() === $this) {
                $vente->setVehicule(null);
            }
        }

        return $this;
    }
} 