<?php

namespace App\Entity;

use App\Repository\ClientRepository;
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
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ClientRepository::class)]
#[ORM\Table(name: 'clients', indexes: [
    new ORM\Index(name: 'idx_client_nom', columns: ['nom']),
    new ORM\Index(name: 'idx_client_proprietaire', columns: ['est_proprietaire_actuel'])
])]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['client:read', 'client:collection']]
        ),
        new Get(
            normalizationContext: ['groups' => ['client:read', 'client:item']]
        ),
        new Post(
            denormalizationContext: ['groups' => ['client:write']]
        ),
        new Put(
            denormalizationContext: ['groups' => ['client:write']]
        ),
        new Delete()
    ],
    order: ['id' => 'DESC'],
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: [
    'nom' => 'partial',
    'prenom' => 'partial',
    'compteAffaire' => 'partial',
    'civilite.libelle' => 'exact',
    'adresses.codePostal' => 'partial',
    'adresses.ville' => 'partial',
    'contacts.email' => 'partial',
    'contacts.telephonePortable' => 'partial'
])]
#[ApiFilter(OrderFilter::class, properties: [
    'id', 'nom', 'prenom', 'compteAffaire', 'adresses.ville'
])]
#[ApiFilter(BooleanFilter::class, properties: ['estProprietaireActuel'])]
#[ApiFilter(ExistsFilter::class, properties: ['civilite', 'adresses', 'contacts'])]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['client:read', 'vehicule:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['client:read', 'client:write', 'vehicule:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['client:read', 'client:write', 'vehicule:read'])]
    private ?string $prenom = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['client:read', 'client:write'])]
    private ?string $compteAffaire = null;

    #[ORM\ManyToOne(inversedBy: 'clients')]
    #[Groups(['client:read', 'client:write'])]
    private ?Civilite $civilite = null;

    #[ORM\Column]
    #[Groups(['client:read', 'client:write'])]
    private ?bool $estProprietaireActuel = false;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Adresse::class, cascade: ['persist', 'remove'])]
    #[Groups(['client:read', 'client:write', 'client:item'])]
    private Collection $adresses;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Contact::class, cascade: ['persist', 'remove'])]
    #[Groups(['client:read', 'client:write', 'client:item'])]
    private Collection $contacts;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Vehicule::class)]
    #[Groups(['client:item'])]
    private Collection $vehicules;

    #[ORM\OneToMany(mappedBy: 'client', targetEntity: Vente::class)]
    #[Groups(['client:item'])]
    private Collection $ventes;

    public function __construct()
    {
        $this->adresses = new ArrayCollection();
        $this->contacts = new ArrayCollection();
        $this->vehicules = new ArrayCollection();
        $this->ventes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCompteAffaire(): ?string
    {
        return $this->compteAffaire;
    }

    public function setCompteAffaire(?string $compteAffaire): static
    {
        $this->compteAffaire = $compteAffaire;

        return $this;
    }

    public function getCivilite(): ?Civilite
    {
        return $this->civilite;
    }

    public function setCivilite(?Civilite $civilite): static
    {
        $this->civilite = $civilite;

        return $this;
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

    public function setPrenom(?string $prenom): static
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function isEstProprietaireActuel(): ?bool
    {
        return $this->estProprietaireActuel;
    }

    public function setEstProprietaireActuel(bool $estProprietaireActuel): static
    {
        $this->estProprietaireActuel = $estProprietaireActuel;

        return $this;
    }

    /**
     * @return Collection<int, Adresse>
     */
    public function getAdresses(): Collection
    {
        return $this->adresses;
    }

    public function addAdresse(Adresse $adresse): static
    {
        if (!$this->adresses->contains($adresse)) {
            $this->adresses->add($adresse);
            $adresse->setClient($this);
        }

        return $this;
    }

    public function removeAdresse(Adresse $adresse): static
    {
        if ($this->adresses->removeElement($adresse)) {
            // set the owning side to null (unless already changed)
            if ($adresse->getClient() === $this) {
                $adresse->setClient(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Contact>
     */
    public function getContacts(): Collection
    {
        return $this->contacts;
    }

    public function addContact(Contact $contact): static
    {
        if (!$this->contacts->contains($contact)) {
            $this->contacts->add($contact);
            $contact->setClient($this);
        }

        return $this;
    }

    public function removeContact(Contact $contact): static
    {
        if ($this->contacts->removeElement($contact)) {
            // set the owning side to null (unless already changed)
            if ($contact->getClient() === $this) {
                $contact->setClient(null);
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
            $vehicule->setClient($this);
        }

        return $this;
    }

    public function removeVehicule(Vehicule $vehicule): static
    {
        if ($this->vehicules->removeElement($vehicule)) {
            // set the owning side to null (unless already changed)
            if ($vehicule->getClient() === $this) {
                $vehicule->setClient(null);
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
            $vente->setClient($this);
        }

        return $this;
    }

    public function removeVente(Vente $vente): static
    {
        if ($this->ventes->removeElement($vente)) {
            // set the owning side to null (unless already changed)
            if ($vente->getClient() === $this) {
                $vente->setClient(null);
            }
        }

        return $this;
    }
} 