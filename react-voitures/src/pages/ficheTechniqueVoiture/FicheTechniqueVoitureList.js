import React, { useState } from 'react';
import { Table, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const FicheTechniqueVoitureList = () => {
    const [ficheTechniques] = useState([
        {
            idFicheTechniqueVoiture: 1,
            immatriculation: "AA-123-BB",
            dateEvenement: "2024-03-16",
            compteEvenement: { nomCompteEvenement: "Maintenance" },
            typeVehicule: { nomTypeVehicule: "Berline" },
            energie: { nomEnergie: "Essence" }
        },
        {
            idFicheTechniqueVoiture: 2,
            immatriculation: "CC-456-DD",
            dateEvenement: "2024-03-15",
            compteEvenement: { nomCompteEvenement: "Révision" },
            typeVehicule: { nomTypeVehicule: "SUV" },
            energie: { nomEnergie: "Diesel" }
        }
    ]);

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Liste des Fiches Techniques</h2>
                <Link to="/fiche-technique-voiture/new">
                    <Button variant="primary">Nouvelle Fiche Technique</Button>
                </Link>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Immatriculation</th>
                        <th>Date Événement</th>
                        <th>Compte Événement</th>
                        <th>Type Véhicule</th>
                        <th>Énergie</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ficheTechniques.map((fiche) => (
                        <tr key={fiche.idFicheTechniqueVoiture}>
                            <td>{fiche.idFicheTechniqueVoiture}</td>
                            <td>{fiche.immatriculation}</td>
                            <td>{new Date(fiche.dateEvenement).toLocaleDateString()}</td>
                            <td>{fiche.compteEvenement?.nomCompteEvenement}</td>
                            <td>{fiche.typeVehicule?.nomTypeVehicule}</td>
                            <td>{fiche.energie?.nomEnergie}</td>
                            <td>
                                <Link to={`/fiche-technique-voiture/edit/${fiche.idFicheTechniqueVoiture}`}>
                                    <Button variant="info" size="sm" className="me-2">
                                        Modifier
                                    </Button>
                                </Link>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => {
                                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette fiche technique ?')) {
                                            // TODO: Implémenter la suppression
                                            console.log('Suppression de la fiche', fiche.idFicheTechniqueVoiture);
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
};

export default FicheTechniqueVoitureList;
