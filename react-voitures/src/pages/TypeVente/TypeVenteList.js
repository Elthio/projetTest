import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function TypeVenteList() {
  const navigate = useNavigate();
  const [typesVente] = useState([
    { idTypeVente: 1, nomTypeVente: 'Vente directe' },
    { idTypeVente: 2, nomTypeVente: 'Leasing' },
    { idTypeVente: 3, nomTypeVente: 'LOA' },
    { idTypeVente: 4, nomTypeVente: 'LLD' },
  ]);

  const handleAdd = () => {
    navigate('/type-vente/new');
  };

  const handleEdit = (id) => {
    navigate(`/type-vente/edit/${id}`);
  };

  const handleDelete = (id) => {
    // TODO: Implémenter la suppression
    console.log('Suppression du type de vente:', id);
  };

  return (
    <Container className="mt-4">
      <h2>Liste des Types de Vente</h2>
      <Button variant="success" className="mb-3" onClick={handleAdd}>
        Ajouter un type de vente
      </Button>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type de Vente</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {typesVente.map(type => (
            <tr key={type.idTypeVente}>
              <td>{type.idTypeVente}</td>
              <td>{type.nomTypeVente}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(type.idTypeVente)}
                >
                  Modifier
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(type.idTypeVente)}
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

export default TypeVenteList;
