import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css';

// Import des composants
import SubNavbar from './components/SubNavbar';
import ProprioList from './pages/proprio/ProprioList';
import ProprioForm from './pages/proprio/ProprioForm';
import LibelleCiviliteList from './pages/LibelleCivilite/LibelleCiviliteList';
import LibelleCiviliteForm from './pages/LibelleCivilite/LibelleCiviliteForm';
import TypeProspectList from './pages/TypeProspect/TypeProspectList';
import TypeProspectForm from './pages/TypeProspect/TypeProspectForm';
import VoitureList from './pages/voiture/VoitureList';
import VoitureForm from './pages/voiture/VoitureForm';
import TypeVehiculeList from './pages/TypeVehicule/TypeVehiculeList';
import TypeVehiculeForm from './pages/TypeVehicule/TypeVehiculeForm';
import EnergieList from './pages/energie/EnergieList';
import EnergieForm from './pages/energie/EnergieForm';
import FicheVenteList from './pages/vente/FicheVenteList';
import FicheVenteForm from './pages/vente/FicheVenteForm';
import TypeVenteList from './pages/TypeVente/TypeVenteList';
import TypeVenteForm from './pages/TypeVente/TypeVenteForm';
import FicheTechniqueVoitureList from './pages/ficheTechniqueVoiture/FicheTechniqueVoitureList';
import FicheTechniqueVoitureForm from './pages/ficheTechniqueVoiture/FicheTechniqueVoitureForm';
import CompteAffaireList from './pages/compteAffaire/CompteAffaireList';
import CompteEvenementList from './pages/compteEvenement/CompteEvenementList';
import OrigineEvenementList from './pages/OrigineEvenement/OrigineEvenementList';

function App() {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
        <Container>
          <Navbar.Brand as={Link} to="/">Gestion Voitures</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown 
                title={<span className="nav-dropdown-title">Propriétaires</span>} 
                id="proprietaires-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/proprietaires">Liste Propriétaires</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/libelle-civilite">Libellé Civilité</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/type-prospect">Type Prospect</NavDropdown.Item>
              </NavDropdown>
              
              <NavDropdown 
                title={<span className="nav-dropdown-title">Voitures</span>} 
                id="voitures-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/voitures">Liste Voitures</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/type-vehicule">Type Véhicule</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/energie">Énergie</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown 
                title={<span className="nav-dropdown-title">Ventes</span>} 
                id="ventes-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/fiche-vente">Liste Fiches Vente</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/type-vente">Types de Vente</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown 
                title={<span className="nav-dropdown-title">Événements</span>} 
                id="evenements-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/fiche-technique-voiture">Fiche Technique Voiture</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/compte-affaire">Compte Affaire</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/compte-evenement">Compte Événement</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/origine-evenement">Origine Événement</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <SubNavbar />

      <main className="content">
        <Routes>
          <Route path="/" element={
            <div className="welcome-page">
              <h1>Gestion de Parc Automobile</h1>
              <p>Bienvenue dans votre application de gestion de véhicules</p>
            </div>
          } />
          
          {/* Routes Propriétaires */}
          <Route path="/proprietaires" element={<ProprioList />} />
          <Route path="/proprietaires/new" element={<ProprioForm />} />
          <Route path="/proprietaires/edit/:id" element={<ProprioForm />} />
          
          <Route path="/libelle-civilite" element={<LibelleCiviliteList />} />
          <Route path="/libelle-civilite/new" element={<LibelleCiviliteForm />} />
          <Route path="/libelle-civilite/edit/:id" element={<LibelleCiviliteForm />} />
          
          <Route path="/type-prospect" element={<TypeProspectList />} />
          <Route path="/type-prospect/new" element={<TypeProspectForm />} />
          <Route path="/type-prospect/edit/:id" element={<TypeProspectForm />} />

          {/* Routes Voitures */}
          <Route path="/voitures" element={<VoitureList />} />
          <Route path="/voitures/new" element={<VoitureForm />} />
          <Route path="/voitures/edit/:id" element={<VoitureForm />} />

          <Route path="/type-vehicule" element={<TypeVehiculeList />} />
          <Route path="/type-vehicule/new" element={<TypeVehiculeForm />} />
          <Route path="/type-vehicule/edit/:id" element={<TypeVehiculeForm />} />

          <Route path="/energie" element={<EnergieList />} />
          <Route path="/energie/new" element={<EnergieForm />} />
          <Route path="/energie/edit/:id" element={<EnergieForm />} />

          {/* Routes Ventes */}
          <Route path="/fiche-vente" element={<FicheVenteList />} />
          <Route path="/fiche-vente/new" element={<FicheVenteForm />} />
          <Route path="/fiche-vente/edit/:id" element={<FicheVenteForm />} />

          <Route path="/type-vente" element={<TypeVenteList />} />
          <Route path="/type-vente/new" element={<TypeVenteForm />} />
          <Route path="/type-vente/edit/:id" element={<TypeVenteForm />} />

          {/* Routes Événements */}
          <Route path="/fiche-technique-voiture" element={<FicheTechniqueVoitureList />} />
          <Route path="/fiche-technique-voiture/new" element={<FicheTechniqueVoitureForm />} />
          <Route path="/fiche-technique-voiture/edit/:id" element={<FicheTechniqueVoitureForm />} />

          <Route path="/compte-affaire" element={<CompteAffaireList />} />
          <Route path="/compte-evenement" element={<CompteEvenementList />} />
          <Route path="/origine-evenement" element={<OrigineEvenementList />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
