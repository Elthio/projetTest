import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function EnergieList() {
  const [energies] = useState([
    { idEnergie: 1, nomEnergie: 'Essence' },
    { idEnergie: 2, nomEnergie: 'Diesel' },
    { idEnergie: 3, nomEnergie: 'Électrique' },
    { idEnergie: 4, nomEnergie: 'Hybride' },
    { idEnergie: 5, nomEnergie: 'GPL' },
  ]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Types d'Énergie</h2>
        <Link to="/energie/new">
          <Button variant="primary">Nouveau Type d'Énergie</Button>
        </Link>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type d'Énergie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {energies.map(energie => (
            <tr key={energie.idEnergie}>
              <td>{energie.idEnergie}</td>
              <td>{energie.nomEnergie}</td>
              <td>
                <Link to={`/energie/edit/${energie.idEnergie}`}>
                  <Button variant="info" size="sm" className="me-2">Modifier</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type d\'énergie ?')) {
                      // TODO: Implémenter la suppression
                      console.log('Suppression du type d\'énergie', energie.idEnergie);
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

export default EnergieList;
