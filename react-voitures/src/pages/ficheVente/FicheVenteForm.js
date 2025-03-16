import React from 'react';
import FormComponent from '../../components/common/FormComponent';

const FicheVenteForm = ({ initialData, onSubmit, onCancel, typeVentes, typeVehicules, voitures }) => {
  // Field definitions for the form component
  const fields = [
    {
      name: 'dateVente',
      label: 'Date de Vente',
      type: 'date',
      required: true
    },
    {
      name: 'prixVente',
      label: 'Prix de Vente (€)',
      type: 'number',
      required: true,
      placeholder: 'Entrez le prix de vente'
    },
    {
      name: 'idTypeVente',
      label: 'Type de Vente',
      type: 'select',
      required: true,
      options: typeVentes.map(typeVente => ({
        value: typeVente.idTypesVentes,
        label: typeVente.nomTypeVente
      }))
    },
    {
      name: 'immatriculation',
      label: 'Véhicule',
      type: 'select',
      required: true,
      options: voitures.map(voiture => ({
        value: voiture.immatriculation,
        label: `${voiture.marque} ${voiture.modele} (${voiture.immatriculation})`
      }))
    },
    {
      name: 'idTypeVehicule',
      label: 'Type de Véhicule',
      type: 'select',
      required: true,
      options: typeVehicules.map(typeVehicule => ({
        value: typeVehicule.idTypeVehicule,
        label: typeVehicule.nomTypeVehicule
      }))
    },
    {
      name: 'numeroDossierVente',
      label: 'Numéro de Dossier',
      type: 'text',
      required: true,
      placeholder: 'Entrez le numéro de dossier'
    },
    {
      name: 'intermediaireVente',
      label: 'Intermédiaire de Vente',
      type: 'text',
      required: false,
      placeholder: 'Entrez l\'intermédiaire de vente'
    },
    {
      name: 'VendeurVN',
      label: 'Vendeur VN',
      type: 'text',
      required: false,
      placeholder: 'Entrez le vendeur VN'
    },
    {
      name: 'VendeurVO',
      label: 'Vendeur VO',
      type: 'text',
      required: false,
      placeholder: 'Entrez le vendeur VO'
    }
  ];

  return (
    <div className="fiche-vente-form">
      <h2>{initialData.idficheVente ? 'Modifier' : 'Ajouter'} une Fiche de Vente</h2>
      <FormComponent 
        initialData={initialData}
        fields={fields}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel={initialData.idficheVente ? 'Mettre à jour' : 'Ajouter'}
      />
    </div>
  );
};

export default FicheVenteForm;
