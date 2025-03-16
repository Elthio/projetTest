import React, { useState } from 'react';
import ListComponent from '../../components/common/ListComponent';
import CompteEvenementForm from './CompteEvenementForm';

const CompteEvenementList = () => {
  // State for managing data
  const [compteEvenements, setCompteEvenements] = useState([
    { 
      idCompteEvenement: '1', 
      nomCompteEvenement: 'Salon Automobile'
    },
    { 
      idCompteEvenement: '2', 
      nomCompteEvenement: 'Site Web'
    }
  ]);
  
  // State for form visibility
  const [showForm, setShowForm] = useState(false);
  
  // State for editing
  const [currentCompteEvenement, setCurrentCompteEvenement] = useState(null);

  // Column definitions for the list component
  const columns = [
    { key: 'idCompteEvenement', label: 'ID' },
    { key: 'nomCompteEvenement', label: 'Nom' }
  ];

  // Handle adding a new compte evenement
  const handleAdd = () => {
    setCurrentCompteEvenement(null);
    setShowForm(true);
  };

  // Handle editing a compte evenement
  const handleEdit = (compteEvenement) => {
    setCurrentCompteEvenement(compteEvenement);
    setShowForm(true);
  };

  // Handle deleting a compte evenement
  const handleDelete = (compteEvenement) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'événement "${compteEvenement.nomCompteEvenement}" ?`)) {
      setCompteEvenements(compteEvenements.filter(ce => ce.idCompteEvenement !== compteEvenement.idCompteEvenement));
    }
  };

  // Handle form submission
  const handleSubmit = (formData) => {
    if (currentCompteEvenement) {
      // Update existing compte evenement
      setCompteEvenements(
        compteEvenements.map(ce => 
          ce.idCompteEvenement === currentCompteEvenement.idCompteEvenement 
            ? { ...formData } 
            : ce
        )
      );
    } else {
      // Add new compte evenement with a generated ID
      const newId = (Math.max(0, ...compteEvenements.map(ce => parseInt(ce.idCompteEvenement))) + 1).toString();
      setCompteEvenements([...compteEvenements, { ...formData, idCompteEvenement: newId }]);
    }
    
    setShowForm(false);
  };

  // Handle canceling the form
  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="compte-evenement-container">
      {showForm ? (
        <CompteEvenementForm 
          initialData={currentCompteEvenement || {}} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
        />
      ) : (
        <ListComponent 
          data={compteEvenements} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onAdd={handleAdd}
          title="Liste des Événements"
        />
      )}
    </div>
  );
};

export default CompteEvenementList;
