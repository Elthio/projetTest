import React, { useState } from 'react';
import ListComponent from '../../components/common/ListComponent';
import OrigineEvenementForm from './OrigineEvenementForm';

const OrigineEvenementList = () => {
  // State for managing data
  const [originesEvenement, setOriginesEvenement] = useState([
    { idOrigineEvenement: 1, nomOrigineEvenement: 'Salon Automobile' },
    { idOrigineEvenement: 2, nomOrigineEvenement: 'Site Web' },
    { idOrigineEvenement: 3, nomOrigineEvenement: 'Recommandation' },
    { idOrigineEvenement: 4, nomOrigineEvenement: 'Publicité' },
    { idOrigineEvenement: 5, nomOrigineEvenement: 'Réseaux Sociaux' }
  ]);
  
  // State for form visibility
  const [showForm, setShowForm] = useState(false);
  
  // State for editing
  const [currentOrigineEvenement, setCurrentOrigineEvenement] = useState(null);

  // Column definitions for the list component
  const columns = [
    { key: 'idOrigineEvenement', label: 'ID' },
    { key: 'nomOrigineEvenement', label: 'Origine de l\'événement' }
  ];

  // Handle adding a new origine evenement
  const handleAdd = () => {
    setCurrentOrigineEvenement(null);
    setShowForm(true);
  };

  // Handle editing an origine evenement
  const handleEdit = (origineEvenement) => {
    setCurrentOrigineEvenement(origineEvenement);
    setShowForm(true);
  };

  // Handle deleting an origine evenement
  const handleDelete = (origineEvenement) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'origine d'événement "${origineEvenement.nomOrigineEvenement}" ?`)) {
      setOriginesEvenement(originesEvenement.filter(oe => oe.idOrigineEvenement !== origineEvenement.idOrigineEvenement));
    }
  };

  // Handle form submission
  const handleSubmit = (formData) => {
    if (currentOrigineEvenement) {
      // Update existing origine evenement
      setOriginesEvenement(
        originesEvenement.map(oe => 
          oe.idOrigineEvenement === currentOrigineEvenement.idOrigineEvenement 
            ? { ...formData } 
            : oe
        )
      );
    } else {
      // Add new origine evenement with a generated ID
      const newId = Math.max(0, ...originesEvenement.map(oe => oe.idOrigineEvenement)) + 1;
      setOriginesEvenement([...originesEvenement, { ...formData, idOrigineEvenement: newId }]);
    }
    
    setShowForm(false);
  };

  // Handle canceling the form
  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="origine-evenement-container">
      {showForm ? (
        <OrigineEvenementForm 
          initialData={currentOrigineEvenement || {}} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
        />
      ) : (
        <ListComponent 
          data={originesEvenement} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          onAdd={handleAdd}
          title="Liste des Origines d'Événement"
        />
      )}
    </div>
  );
};

export default OrigineEvenementList;
