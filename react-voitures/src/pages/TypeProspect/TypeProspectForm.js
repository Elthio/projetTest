import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const TypeProspectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialData = id ? {
    // TODO: Charger les données du type de prospect si on est en mode édition
    idTypeProspect: '',
    nomTypeProspect: ''
  } : {
    nomTypeProspect: ''
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'nomTypeProspect',
      label: 'Type de Prospect',
      type: 'text',
      required: true,
      placeholder: 'Entrez le type de prospect'
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/type-prospect');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/type-prospect');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} un Type de Prospect</h2>
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

export default TypeProspectForm;
