import React, { useState } from 'react';
import ListComponent from '../../components/common/ListComponent';
import CompteAffaireForm from './CompteAffaireForm';

const CompteAffaireList = () => {
  // State for managing data
  const [compteAffaires, setCompteAffaires] = useState([
    { 
      idCompteAffaire: '1', 
      nomCompteAffaire: 'Concession Auto Premium'
    },
    { 
      idCompteAffaire: '2', 
      nomCompteAffaire: 'Garage Central'
    }
  ]);
  
  // State for form visibility
  const [showForm, setShowForm] = useState(false);
  
  // State for editing
  const [currentCompteAffaire, setCurrentCompteAffaire] = useState(null);

  // Column definitions for the list component
  const columns = [
    { key: 'idCompteAffaire', label: 'ID' },
    { key: 'nomCompteAffaire', label: 'Nom' }
  ];

  // Handle adding a new compte affaire
  const handleAdd = () => {
    setCurrentCompteAffaire(null);
    setShowForm(true);
  };

  // Handle editing a compte affaire
  const handleEdit = (compteAffaire) => {
    setCurrentCompteAffaire(compteAffaire);
    setShowForm(true);
  };

  // Handle deleting a compte affaire
  const handleDelete = (compteAffaire) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le compte affaire "${compteAffaire.nomCompteAffaire}" ?`)) {
      setCompteAffaires(compteAffaires.filter(ca => ca.idCompteAffaire !== compteAffaire.idCompteAffaire));
    }
  };

  // Handle form submission
  const handleSubmit = (formData) => {
    if (currentCompteAffaire) {
      // Update existing compte affaire
      setCompteAffaires(
        compteAffaires.map(ca => 
          ca.idCompteAffaire === currentCompteAffaire.idCompteAffaire 
            ? { ...formData } 
            : ca
        )
      );
    } else {
      // Add new compte affaire with a generated ID
      const newId = (Math.max(0, ...compteAffaires.map(ca => parseInt(ca.idCompteAffaire))) + 1).toString();
      setCompteAffaires([...compteAffaires, { ...formData, idCompteAffaire: newId }]);
    }
    
    setShowForm(false);
  };

  // Handle canceling the form
  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="compte-affaire-container">
      {showForm ? (
        <CompteAffaireForm 
          initialData={currentCompteAffaire || {}} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
        />
      ) : (
        <ListComponent 
          data={compteAffaires} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onAdd={handleAdd}
          title="Liste des Comptes Affaires"
        />
      )}
    </div>
  );
};

export default CompteAffaireList;
