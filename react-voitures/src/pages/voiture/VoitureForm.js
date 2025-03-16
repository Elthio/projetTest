import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const VoitureForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Données statiques pour les listes déroulantes
  const [energies] = useState([
    { idEnergie: 1, nomEnergie: 'Essence' },
    { idEnergie: 2, nomEnergie: 'Diesel' },
    { idEnergie: 3, nomEnergie: 'Électrique' },
    { idEnergie: 4, nomEnergie: 'Hybride' },
    { idEnergie: 5, nomEnergie: 'GPL' },
  ]);

  const [typeVehicules] = useState([
    { idTypeVehicule: 1, nomTypeVehicule: 'Berline' },
    { idTypeVehicule: 2, nomTypeVehicule: 'SUV' },
    { idTypeVehicule: 3, nomTypeVehicule: 'Break' },
    { idTypeVehicule: 4, nomTypeVehicule: 'Citadine' },
  ]);

  const [proprios] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean' },
    { id: 2, nom: 'Martin', prenom: 'Marie' },
  ]);

  const initialData = id ? {
    // TODO: Charger les données de la voiture si on est en mode édition
    immatriculation: '',
    vin: '',
    marque: '',
    modele: '',
    versions: '',
    dateMiseEnCirculation: '',
    dateAchatEtLivraison: '',
    idEnergie: '',
    idTypeVehicule: '',
    idProprio: '',
  } : {
    immatriculation: '',
    vin: '',
    marque: '',
    modele: '',
    versions: '',
    dateMiseEnCirculation: '',
    dateAchatEtLivraison: '',
    idEnergie: '',
    idTypeVehicule: '',
    idProprio: '',
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'immatriculation',
      label: 'Immatriculation',
      type: 'text',
      required: true,
      placeholder: 'Entrez l\'immatriculation (ex: AB-123-CD)'
    },
    {
      name: 'vin',
      label: 'Numéro VIN',
      type: 'text',
      required: true,
      placeholder: 'Entrez le numéro VIN (17 caractères)'
    },
    {
      name: 'marque',
      label: 'Marque',
      type: 'text',
      required: true,
      placeholder: 'Entrez la marque'
    },
    {
      name: 'modele',
      label: 'Modèle',
      type: 'text',
      required: true,
      placeholder: 'Entrez le modèle'
    },
    {
      name: 'versions',
      label: 'Version',
      type: 'text',
      required: true,
      placeholder: 'Entrez la version'
    },
    {
      name: 'dateMiseEnCirculation',
      label: 'Date de mise en circulation',
      type: 'date',
      required: true
    },
    {
      name: 'dateAchatEtLivraison',
      label: 'Date d\'achat et livraison',
      type: 'date',
      required: true
    },
    {
      name: 'idEnergie',
      label: 'Type d\'énergie',
      type: 'select',
      required: true,
      options: energies.map(energie => ({
        value: energie.idEnergie,
        label: energie.nomEnergie
      }))
    },
    {
      name: 'idTypeVehicule',
      label: 'Type de véhicule',
      type: 'select',
      required: true,
      options: typeVehicules.map(type => ({
        value: type.idTypeVehicule,
        label: type.nomTypeVehicule
      }))
    },
    {
      name: 'idProprio',
      label: 'Propriétaire',
      type: 'select',
      required: true,
      options: proprios.map(proprio => ({
        value: proprio.id,
        label: `${proprio.nom} ${proprio.prenom}`
      }))
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/voitures');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/voitures');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} une Voiture</h2>
      <FormComponent 
        initialData={initialData}
        fields={fields}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={id ? 'Mettre à jour' : 'Ajouter'}
      />
    </Container>
  );
};

export default VoitureForm;
