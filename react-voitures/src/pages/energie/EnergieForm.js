import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const EnergieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialData = id ? {
    // TODO: Charger les données de l'énergie si on est en mode édition
    idEnergie: '',
    nomEnergie: ''
  } : {
    nomEnergie: ''
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'nomEnergie',
      label: 'Type d\'énergie',
      type: 'text',
      required: true,
      placeholder: 'Entrez le type d\'énergie'
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/energie');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/energie');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} un Type d\'énergie</h2>
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

export default EnergieForm;
