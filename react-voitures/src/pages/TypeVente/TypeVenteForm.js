import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const TypeVenteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialData = id ? {
    // TODO: Charger les données du type de vente si on est en mode édition
    idTypeVente: '',
    nomTypeVente: ''
  } : {
    nomTypeVente: ''
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'nomTypeVente',
      label: 'Type de Vente',
      type: 'text',
      required: true,
      placeholder: 'Entrez le type de vente'
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/type-vente');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/type-vente');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} un Type de Vente</h2>
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

export default TypeVenteForm;
