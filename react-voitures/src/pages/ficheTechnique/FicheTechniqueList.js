import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';

function FicheTechniqueList() {
  const [fichesTechniques] = useState([
    { 
      idFiche: 1,
      voiture: 'Peugeot 208',
      puissance: '100ch',
      cylindree: '1199cc',
      nombrePortes: 5,
      dateMiseAJour: '2024-03-15'
    },
    { 
      idFiche: 2,
      voiture: 'Renault Clio',
      puissance: '90ch',
      cylindree: '999cc',
      nombrePortes: 5,
      dateMiseAJour: '2024-03-14'
    },
  ]);

  return (
    <Container className="mt-4">
      <h2>Liste des Fiches Techniques</h2>
      <Button variant="success" className="mb-3">Ajouter une fiche technique</Button>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Voiture</th>
            <th>Puissance</th>
            <th>Cylindrée</th>
            <th>Nombre de portes</th>
            <th>Dernière mise à jour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fichesTechniques.map(fiche => (
            <tr key={fiche.idFiche}>
              <td>{fiche.idFiche}</td>
              <td>{fiche.voiture}</td>
              <td>{fiche.puissance}</td>
              <td>{fiche.cylindree}</td>
              <td>{fiche.nombrePortes}</td>
              <td>{fiche.dateMiseAJour}</td>
              <td>
                <Button variant="primary" size="sm" className="me-2">Modifier</Button>
                <Button variant="danger" size="sm">Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default FicheTechniqueList;
