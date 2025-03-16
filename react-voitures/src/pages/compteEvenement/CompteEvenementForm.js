import React from 'react';
import FormComponent from '../../components/common/FormComponent';

const CompteEvenementForm = ({ initialData, onSubmit, onCancel }) => {
  // Field definitions for the form component
  const fields = [
    {
      name: 'nomCompteEvenement',
      label: 'Nom',
      type: 'text',
      required: true,
      placeholder: 'Entrez le nom de l\'événement'
    }
  ];

  return (
    <div className="compte-evenement-form">
      <h2>{initialData.idCompteEvenement ? 'Modifier' : 'Ajouter'} un Événement</h2>
      <FormComponent 
        initialData={initialData}
        fields={fields}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel={initialData.idCompteEvenement ? 'Mettre à jour' : 'Ajouter'}
      />
    </div>
  );
};

export default CompteEvenementForm;
