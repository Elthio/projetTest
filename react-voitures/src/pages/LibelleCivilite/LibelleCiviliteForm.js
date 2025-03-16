import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const LibelleCiviliteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialData = id ? {
    // TODO: Charger les données de la civilité si on est en mode édition
    idLibelleCivilite: '',
    nomLibelleCivilite: ''
  } : {
    nomLibelleCivilite: ''
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'nomLibelleCivilite',
      label: 'Libellé Civilité',
      type: 'text',
      required: true,
      placeholder: 'Entrez le libellé de civilité'
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/libelle-civilite');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/libelle-civilite');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} une Civilité</h2>
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

export default LibelleCiviliteForm;
