import React from 'react';
import FormComponent from '../../components/common/FormComponent';

const CompteAffaireForm = ({ initialData, onSubmit, onCancel }) => {
  // Field definitions for the form component
  const fields = [
    {
      name: 'nomCompteAffaire',
      label: 'Nom',
      type: 'text',
      required: true,
      placeholder: 'Entrez le nom du compte affaire'
    }
  ];

  return (
    <div className="compte-affaire-form">
      <h2>{initialData.idCompteAffaire ? 'Modifier' : 'Ajouter'} un Compte Affaire</h2>
      <FormComponent 
        initialData={initialData}
        fields={fields}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitLabel={initialData.idCompteAffaire ? 'Mettre à jour' : 'Ajouter'}
      />
    </div>
  );
};

export default CompteAffaireForm;
