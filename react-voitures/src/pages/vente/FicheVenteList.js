import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function FicheVenteList() {
  const navigate = useNavigate();
  const [ventes] = useState([
    { 
      idVente: 1, 
      dateVente: '2024-03-15',
      montant: 25000,
      typeVente: 'Vente directe',
      voiture: 'Peugeot 208',
      client: 'Jean Dupont'
    },
    { 
      idVente: 2, 
      dateVente: '2024-03-14',
      montant: 35000,
      typeVente: 'Leasing',
      voiture: 'Renault Clio',
      client: 'Marie Martin'
    },
  ]);

  const handleAdd = () => {
    navigate('/fiche-vente/new');
  };

  const handleEdit = (id) => {
    navigate(`/fiche-vente/edit/${id}`);
  };

  const handleDelete = (id) => {
    // TODO: Implémenter la suppression
    console.log('Suppression de la fiche de vente:', id);
  };

  return (
    <Container className="mt-4">
      <h2>Liste des Fiches de Vente</h2>
      <Button variant="success" className="mb-3" onClick={handleAdd}>
        Ajouter une fiche de vente
      </Button>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Montant</th>
            <th>Type de Vente</th>
            <th>Voiture</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ventes.map(vente => (
            <tr key={vente.idVente}>
              <td>{vente.idVente}</td>
              <td>{vente.dateVente}</td>
              <td>{vente.montant.toLocaleString()} €</td>
              <td>{vente.typeVente}</td>
              <td>{vente.voiture}</td>
              <td>{vente.client}</td>
              <td>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEdit(vente.idVente)}
                >
                  Modifier
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleDelete(vente.idVente)}
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

export default FicheVenteList;
