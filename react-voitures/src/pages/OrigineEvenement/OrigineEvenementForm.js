import React from 'react';
import FormComponent from '../../components/common/FormComponent';

const OrigineEvenementForm = ({ initialData, onSubmit, onCancel }) => {
  // Field definitions for the form component
  const fields = [
    {
      name: 'nomOrigineEvenement',
      label: 'Origine de l\'événement',
      type: 'text',
      required: true,
      placeholder: 'Entrez l\'origine de l\'événement'
    }
  ];

  return (
    <div className="origine-evenement-form">
      <h2>{initialData.idOrigineEvenement ? 'Modifier' : 'Ajouter'} une Origine d'Événement</h2>
      <FormComponent 
        initialData={initialData}
        fields={fields}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel={initialData.idOrigineEvenement ? 'Mettre à jour' : 'Ajouter'}
      />
    </div>
  );
};

export default OrigineEvenementForm;
