import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import FormComponent from '../../components/common/FormComponent';

const ProprioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [civilites] = useState([
    { idLibelleCivilite: 1, nomLibelleCivilite: 'Monsieur' },
    { idLibelleCivilite: 2, nomLibelleCivilite: 'Madame' },
    { idLibelleCivilite: 3, nomLibelleCivilite: 'Mademoiselle' },
  ]);

  const [typeProspects] = useState([
    { idTypeProspect: 1, nomTypeProspect: 'Particulier' },
    { idTypeProspect: 2, nomTypeProspect: 'Professionnel' },
    { idTypeProspect: 3, nomTypeProspect: 'Association' },
  ]);

  const initialData = id ? {
    // TODO: Charger les données du propriétaire si on est en mode édition
    idLibelleCivilite: '',
    nom: '',
    prenom: '',
    email: '',
    NumEtNomVoie: '',
    complementAdresse: '',
    codePostal: '',
    ville: '',
    telephone: '',
    idTypeProspect: ''
  } : {
    idLibelleCivilite: '',
    nom: '',
    prenom: '',
    email: '',
    NumEtNomVoie: '',
    complementAdresse: '',
    codePostal: '',
    ville: '',
    telephone: '',
    idTypeProspect: ''
  };

  // Field definitions for the form component
  const fields = [
    {
      name: 'idLibelleCivilite',
      label: 'Civilité',
      type: 'select',
      required: true,
      options: civilites.map(civilite => ({
        value: civilite.idLibelleCivilite,
        label: civilite.nomLibelleCivilite
      }))
    },
    {
      name: 'nom',
      label: 'Nom',
      type: 'text',
      required: true,
      placeholder: 'Entrez le nom'
    },
    {
      name: 'prenom',
      label: 'Prénom',
      type: 'text',
      required: true,
      placeholder: 'Entrez le prénom'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Entrez l\'adresse email'
    },
    {
      name: 'NumEtNomVoie',
      label: 'Numéro et nom de voie',
      type: 'text',
      required: true,
      placeholder: 'Entrez le numéro et le nom de la voie'
    },
    {
      name: 'complementAdresse',
      label: 'Complément d\'adresse',
      type: 'text',
      required: false,
      placeholder: 'Entrez le complément d\'adresse'
    },
    {
      name: 'codePostal',
      label: 'Code postal',
      type: 'text',
      required: true,
      placeholder: 'Entrez le code postal'
    },
    {
      name: 'ville',
      label: 'Ville',
      type: 'text',
      required: true,
      placeholder: 'Entrez la ville'
    },
    {
      name: 'telephone',
      label: 'Téléphone',
      type: 'tel',
      required: true,
      placeholder: 'Entrez le numéro de téléphone'
    },
    {
      name: 'idTypeProspect',
      label: 'Type de prospect',
      type: 'select',
      required: true,
      options: typeProspects.map(type => ({
        value: type.idTypeProspect,
        label: type.nomTypeProspect
      }))
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      // TODO: Implémenter la sauvegarde
      console.log('Données du formulaire:', formData);
      navigate('/proprietaires');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    navigate('/proprietaires');
  };

  return (
    <Container className="mt-4">
      <h2>{id ? 'Modifier' : 'Ajouter'} un Propriétaire</h2>
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

export default ProprioForm;
