import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LibelleCiviliteList() {
  const [civilites] = useState([
    { idLibelleCivilite: 1, nomLibelleCivilite: 'Monsieur' },
    { idLibelleCivilite: 2, nomLibelleCivilite: 'Madame' },
    { idLibelleCivilite: 3, nomLibelleCivilite: 'Mademoiselle' },
  ]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Civilités</h2>
        <Link to="/libelle-civilite/new">
          <Button variant="primary">Nouvelle Civilité</Button>
        </Link>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Libellé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {civilites.map(civilite => (
            <tr key={civilite.idLibelleCivilite}>
              <td>{civilite.idLibelleCivilite}</td>
              <td>{civilite.nomLibelleCivilite}</td>
              <td>
                <Link to={`/libelle-civilite/edit/${civilite.idLibelleCivilite}`}>
                  <Button variant="info" size="sm" className="me-2">Modifier</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette civilité ?')) {
                      // TODO: Implémenter la suppression
                      console.log('Suppression de la civilité', civilite.idLibelleCivilite);
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

export default LibelleCiviliteList;
