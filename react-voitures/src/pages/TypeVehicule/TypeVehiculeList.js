import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TypeVehiculeList() {
  const [typeVehicules] = useState([
    { idTypeVehicule: 1, nomTypeVehicule: 'Berline' },
    { idTypeVehicule: 2, nomTypeVehicule: 'SUV' },
    { idTypeVehicule: 3, nomTypeVehicule: 'Break' },
    { idTypeVehicule: 4, nomTypeVehicule: 'Citadine' },
  ]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Types de Véhicule</h2>
        <Link to="/type-vehicule/new">
          <Button variant="primary">Nouveau Type de Véhicule</Button>
        </Link>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type de Véhicule</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {typeVehicules.map(typeVehicule => (
            <tr key={typeVehicule.idTypeVehicule}>
              <td>{typeVehicule.idTypeVehicule}</td>
              <td>{typeVehicule.nomTypeVehicule}</td>
              <td>
                <Link to={`/type-vehicule/edit/${typeVehicule.idTypeVehicule}`}>
                  <Button variant="info" size="sm" className="me-2">Modifier</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de véhicule ?')) {
                      // TODO: Implémenter la suppression
                      console.log('Suppression du type de véhicule', typeVehicule.idTypeVehicule);
                    }
                  }}
                >
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default TypeVehiculeList;
