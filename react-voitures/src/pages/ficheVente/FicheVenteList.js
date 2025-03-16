import React, { useState } from 'react';
import ListComponent from '../../components/common/ListComponent';
import FicheVenteForm from './FicheVenteForm';

const FicheVenteList = () => {
  // Sample data for related tables (would come from API in real app)
  const typeVentes = [
    { idTypesVentes: 1, nomTypeVente: 'Vente Neuf' },
    { idTypesVentes: 2, nomTypeVente: 'Vente Occasion' },
    { idTypesVentes: 3, nomTypeVente: 'Leasing' },
    { idTypesVentes: 4, nomTypeVente: 'Location Longue Durée' }
  ];

  const typeVehicules = [
    { idTypeVehicule: 1, nomTypeVehicule: 'Berline' },
    { idTypeVehicule: 2, nomTypeVehicule: 'SUV' },
    { idTypeVehicule: 3, nomTypeVehicule: 'Break' },
    { idTypeVehicule: 4, nomTypeVehicule: 'Coupé' },
    { idTypeVehicule: 5, nomTypeVehicule: 'Cabriolet' }
  ];

  const voitures = [
    { 
      immatriculation: 'AB-123-CD', 
      marque: 'Renault',
      modele: 'Clio'
    },
    { 
      immatriculation: 'EF-456-GH', 
      marque: 'Peugeot',
      modele: '308'
    }
  ];

  // State for managing data
  const [ficheVentes, setFicheVentes] = useState([
    { 
      idficheVente: 1, 
      dateVente: '2023-03-15',
      prixVente: 15000.00,
      idTypeVente: 1,
      immatriculation: 'AB-123-CD',
      idTypeVehicule: 1,
      numeroDossierVente: 'VN-2023-001',
      intermediaireVente: 'Direct',
      VendeurVN: 'Dupont Jean',
      VendeurVO: ''
    },
    { 
      idficheVente: 2, 
      dateVente: '2023-04-20',
      prixVente: 12500.00,
      idTypeVente: 2,
      immatriculation: 'EF-456-GH',
      idTypeVehicule: 2,
      numeroDossierVente: 'VO-2023-001',
      intermediaireVente: 'Partenaire Auto',
      VendeurVN: '',
      VendeurVO: 'Martin Pierre'
    }
  ]);
  
  // State for form visibility
  const [showForm, setShowForm] = useState(false);
  
  // State for editing
  const [currentFicheVente, setCurrentFicheVente] = useState(null);

  // Column definitions for the list component
  const columns = [
    { key: 'idficheVente', label: 'ID' },
    { 
      key: 'dateVente', 
      label: 'Date de Vente',
      render: (item) => new Date(item.dateVente).toLocaleDateString('fr-FR')
    },
    { 
      key: 'prixVente', 
      label: 'Prix de Vente',
      render: (item) => `${item.prixVente.toLocaleString('fr-FR')} €`
    },
    { 
      key: 'idTypeVente', 
      label: 'Type de Vente',
      render: (item) => {
        const typeVente = typeVentes.find(tv => tv.idTypesVentes === item.idTypeVente);
        return typeVente ? typeVente.nomTypeVente : '';
      }
    },
    { 
      key: 'immatriculation', 
      label: 'Véhicule',
      render: (item) => {
        const voiture = voitures.find(v => v.immatriculation === item.immatriculation);
        return voiture ? `${voiture.marque} ${voiture.modele} (${item.immatriculation})` : item.immatriculation;
      }
    },
    { 
      key: 'idTypeVehicule', 
      label: 'Type de Véhicule',
      render: (item) => {
        const typeVehicule = typeVehicules.find(tv => tv.idTypeVehicule === item.idTypeVehicule);
        return typeVehicule ? typeVehicule.nomTypeVehicule : '';
      }
    },
    { key: 'numeroDossierVente', label: 'N° Dossier' }
  ];

  // Handle adding a new fiche vente
  const handleAdd = () => {
    setCurrentFicheVente(null);
    setShowForm(true);
  };

  // Handle editing a fiche vente
  const handleEdit = (ficheVente) => {
    setCurrentFicheVente(ficheVente);
    setShowForm(true);
  };

  // Handle deleting a fiche vente
  const handleDelete = (ficheVente) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la fiche de vente n°${ficheVente.idficheVente} ?`)) {
      setFicheVentes(ficheVentes.filter(fv => fv.idficheVente !== ficheVente.idficheVente));
    }
  };

  // Handle form submission
  const handleSubmit = (formData) => {
    if (currentFicheVente) {
      // Update existing fiche vente
      setFicheVentes(
        ficheVentes.map(fv => 
          fv.idficheVente === currentFicheVente.idficheVente 
            ? { ...formData } 
            : fv
        )
      );
    } else {
      // Add new fiche vente with a generated ID
      const newId = Math.max(0, ...ficheVentes.map(fv => fv.idficheVente)) + 1;
      setFicheVentes([...ficheVentes, { ...formData, idficheVente: newId }]);
    }
    
    setShowForm(false);
  };

  // Handle canceling the form
  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="fiche-vente-container">
      {showForm ? (
        <FicheVenteForm 
          initialData={currentFicheVente || {}} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          typeVentes={typeVentes}
          typeVehicules={typeVehicules}
          voitures={voitures}
        />
      ) : (
        <ListComponent 
          data={ficheVentes} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onAdd={handleAdd}
          title="Liste des Fiches de Vente"
        />
      )}
    </div>
  );
};

export default FicheVenteList;
