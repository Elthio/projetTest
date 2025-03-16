import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const FicheTechniqueVoitureForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        immatriculation: '',
        idenergie: '',
        idTypeVehicule: '',
        idTypeVente: '',
        idFicheVente: '',
        idcompteAffaire: '',
        idcompteEvenement: '',
        dateEvenement: '',
        idOrigineEvenement: '',
        commentaireFacturation: ''
    });

    // Données statiques pour les listes déroulantes
    const energies = [
        { id: 1, nomEnergie: 'Essence' },
        { id: 2, nomEnergie: 'Diesel' },
        { id: 3, nomEnergie: 'Électrique' }
    ];

    const typeVehicules = [
        { id: 1, nomTypeVehicule: 'Berline' },
        { id: 2, nomTypeVehicule: 'SUV' },
        { id: 3, nomTypeVehicule: '4x4' }
    ];

    const typeVentes = [
        { id: 1, nomTypeVente: 'Vente directe' },
        { id: 2, nomTypeVente: 'Leasing' }
    ];

    const compteAffaires = [
        { id: 1, nomCompteAffaire: 'Compte 1' },
        { id: 2, nomCompteAffaire: 'Compte 2' }
    ];

    const compteEvenements = [
        { id: 1, nomCompteEvenement: 'Maintenance' },
        { id: 2, nomCompteEvenement: 'Révision' }
    ];

    const origineEvenements = [
        { id: 1, nomOrigineEvenement: 'Origine 1' },
        { id: 2, nomOrigineEvenement: 'Origine 2' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Données du formulaire:', formData);
        // Simuler un succès
        alert('Fiche technique enregistrée avec succès!');
        navigate('/fiche-technique-voiture');
    };

    return (
        <Container className="mt-4 mb-4 p-4 bg-white shadow rounded">
            <h2 className="mb-4 text-primary">Nouvelle Fiche Technique Voiture</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Immatriculation</Form.Label>
                            <Form.Control
                                type="text"
                                name="immatriculation"
                                value={formData.immatriculation}
                                onChange={handleChange}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Énergie</Form.Label>
                            <Form.Select
                                name="idenergie"
                                value={formData.idenergie}
                                onChange={handleChange}
                                required
                                className="form-control-lg"
                            >
                                <option value="">Sélectionner une énergie</option>
                                {energies.map(energie => (
                                    <option key={energie.id} value={energie.id}>
                                        {energie.nomEnergie}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Type de Véhicule</Form.Label>
                            <Form.Select
                                name="idTypeVehicule"
                                value={formData.idTypeVehicule}
                                onChange={handleChange}
                                required
                                className="form-control-lg"
                            >
                                <option value="">Sélectionner un type</option>
                                {typeVehicules.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.nomTypeVehicule}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Type de Vente</Form.Label>
                            <Form.Select
                                name="idTypeVente"
                                value={formData.idTypeVente}
                                onChange={handleChange}
                                className="form-control-lg"
                            >
                                <option value="">Sélectionner un type</option>
                                {typeVentes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.nomTypeVente}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Compte Affaire</Form.Label>
                            <Form.Select
                                name="idcompteAffaire"
                                value={formData.idcompteAffaire}
                                onChange={handleChange}
                                className="form-control-lg"
                            >
                                <option value="">Sélectionner un compte</option>
                                {compteAffaires.map(compte => (
                                    <option key={compte.id} value={compte.id}>
                                        {compte.nomCompteAffaire}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Compte Événement</Form.Label>
                            <Form.Select
                                name="idcompteEvenement"
                                value={formData.idcompteEvenement}
                                onChange={handleChange}
                                required
                                className="form-control-lg"
                            >
                                <option value="">Sélectionner un compte</option>
                                {compteEvenements.map(compte => (
                                    <option key={compte.id} value={compte.id}>
                                        {compte.nomCompteEvenement}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date Événement</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateEvenement"
                                value={formData.dateEvenement}
                                onChange={handleChange}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Origine Événement</Form.Label>
                            <Form.Select
                                name="idOrigineEvenement"
                                value={formData.idOrigineEvenement}
                                onChange={handleChange}
                                className="form-control-lg"
                            >
                                <option value="">Sélectionner une origine</option>
                                {origineEvenements.map(origine => (
                                    <option key={origine.id} value={origine.id}>
                                        {origine.nomOrigineEvenement}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-4">
                    <Form.Label>Commentaire Facturation</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="commentaireFacturation"
                        value={formData.commentaireFacturation}
                        onChange={handleChange}
                        className="form-control-lg"
                    />
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" size="lg" onClick={() => navigate('/fiche-technique-voiture')}>
                        Annuler
                    </Button>
                    <Button variant="primary" size="lg" type="submit">
                        Enregistrer
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default FicheTechniqueVoitureForm;
