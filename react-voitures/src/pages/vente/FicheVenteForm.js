import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const FicheVenteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Données statiques pour les listes déroulantes
  const [typesVente] = useState([
    { idTypeVente: 1, nomTypeVente: 'Vente directe' },
    { idTypeVente: 2, nomTypeVente: 'Leasing' },
    { idTypeVente: 3, nomTypeVente: 'Location longue durée' }
  ]);

  const [voitures] = useState([
    { id: 1, immatriculation: 'AB-123-CD', marque: 'Peugeot', modele: '208' },
    { id: 2, immatriculation: 'EF-456-GH', marque: 'Renault', modele: 'Clio' }
  ]);

  const [clients] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean' },
    { id: 2, nom: 'Martin', prenom: 'Marie' }
  ]);

  const initialData = id ? {
    // TODO: Charger les données de la fiche de vente si on est en mode édition
    idVente: '',
    dateVente: '',
    montant: '',
    idTypeVente: '',
    idVoiture: '',
    idClient: ''
  } : {
    dateVente: '',
    montant: '',
    idTypeVente: '',
    idVoiture: '',
    idClient: ''
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'dateVente',
      label: 'Date de vente',
      type: 'date',
      required: true
    },
    {
      name: 'montant',
      label: 'Montant',
      type: 'number',
      required: true,
      placeholder: 'Entrez le montant de la vente'
    },
    {
      name: 'idTypeVente',
      label: 'Type de vente',
      type: 'select',
      required: true,
      options: typesVente.map(type => ({
        value: type.idTypeVente,
        label: type.nomTypeVente
      }))
    },
    {
      name: 'idVoiture',
      label: 'Voiture',
      type: 'select',
      required: true,
      options: voitures.map(voiture => ({
        value: voiture.id,
        label: `${voiture.marque} ${voiture.modele} (${voiture.immatriculation})`
      }))
    },
    {
      name: 'idClient',
      label: 'Client',
      type: 'select',
      required: true,
      options: clients.map(client => ({
        value: client.id,
        label: `${client.nom} ${client.prenom}`
      }))
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/fiche-vente');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/fiche-vente');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} une Fiche de Vente</h2>
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

export default FicheVenteForm;
