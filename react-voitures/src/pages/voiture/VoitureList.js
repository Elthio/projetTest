import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function VoitureList() {
  const [voitures] = useState([
    { id: 1, marque: 'Peugeot', modele: '208', annee: 2020, immatriculation: 'AB-123-CD' },
    { id: 2, marque: 'Renault', modele: 'Clio', annee: 2019, immatriculation: 'EF-456-GH' },
  ]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Voitures</h2>
        <Link to="/voitures/new">
          <Button variant="primary">Nouvelle Voiture</Button>
        </Link>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Année</th>
            <th>Immatriculation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {voitures.map(voiture => (
            <tr key={voiture.id}>
              <td>{voiture.id}</td>
              <td>{voiture.marque}</td>
              <td>{voiture.modele}</td>
              <td>{voiture.annee}</td>
              <td>{voiture.immatriculation}</td>
              <td>
                <Link to={`/voitures/edit/${voiture.id}`}>
                  <Button variant="info" size="sm" className="me-2">Modifier</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette voiture ?')) {
                      // TODO: Implémenter la suppression
                      console.log('Suppression de la voiture', voiture.id);
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

export default VoitureList;
