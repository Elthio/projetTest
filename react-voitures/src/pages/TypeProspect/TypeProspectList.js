import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TypeProspectList() {
  const [typeProspects] = useState([
    { idTypeProspect: 1, nomTypeProspect: 'Particulier' },
    { idTypeProspect: 2, nomTypeProspect: 'Professionnel' },
    { idTypeProspect: 3, nomTypeProspect: 'Association' },
  ]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des Types de Prospect</h2>
        <Link to="/type-prospect/new">
          <Button variant="primary">Nouveau Type de Prospect</Button>
        </Link>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type de Prospect</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {typeProspects.map(typeProspect => (
            <tr key={typeProspect.idTypeProspect}>
              <td>{typeProspect.idTypeProspect}</td>
              <td>{typeProspect.nomTypeProspect}</td>
              <td>
                <Link to={`/type-prospect/edit/${typeProspect.idTypeProspect}`}>
                  <Button variant="info" size="sm" className="me-2">Modifier</Button>
                </Link>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce type de prospect ?')) {
                      // TODO: Implémenter la suppression
                      console.log('Suppression du type de prospect', typeProspect.idTypeProspect);
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

export default TypeProspectList;
