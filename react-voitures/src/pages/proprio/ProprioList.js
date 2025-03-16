import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ProprioList() {
  const [proprietaires] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', telephone: '0123456789' },
    { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie.martin@email.com', telephone: '0987654321' },
  ]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Propriétaires</h2>
        <Link to="/proprietaires/new">
          <Button variant="primary">Nouveau Propriétaire</Button>
        </Link>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proprietaires.map(proprio => (
            <tr key={proprio.id}>
              <td>{proprio.id}</td>
              <td>{proprio.nom}</td>
              <td>{proprio.prenom}</td>
              <td>{proprio.email}</td>
              <td>{proprio.telephone}</td>
              <td>
                <Link to={`/proprietaires/edit/${proprio.id}`}>
                  <Button variant="info" size="sm" className="me-2">Modifier</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) {
                      // TODO: Implémenter la suppression
                      console.log('Suppression du propriétaire', proprio.id);
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

export default ProprioList;
