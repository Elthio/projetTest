import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const TypeVehiculeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialData = id ? {
    // TODO: Charger les données du type de véhicule si on est en mode édition
    idTypeVehicule: '',
    nomTypeVehicule: ''
  } : {
    nomTypeVehicule: ''
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'nomTypeVehicule',
      label: 'Type de Véhicule',
      type: 'text',
      required: true,
      placeholder: 'Entrez le type de véhicule'
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/type-vehicule');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/type-vehicule');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} un Type de Véhicule</h2>
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

export default TypeVehiculeForm;
