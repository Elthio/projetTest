import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../styles/SubNavbar.css';

const SubNavbar = () => {
  const location = useLocation();
  const path = location.pathname;

  // Configuration des sous-menus pour chaque section
  const subNavs = {
    proprietaires: [
      { path: '/proprietaires', label: 'Liste Propriétaires' },
      { path: '/libelle-civilite', label: 'Libellé Civilité' },
      { path: '/type-prospect', label: 'Type Prospect' }
    ],
    voitures: [
      { path: '/voitures', label: 'Liste Voitures' },
      { path: '/type-vehicule', label: 'Type Véhicule' },
      { path: '/energie', label: 'Énergie' }
    ],
    ventes: [
      { path: '/fiche-vente', label: 'Liste Fiches Vente' },
      { path: '/type-vente', label: 'Types de Vente' }
    ],
    evenements: [
      { path: '/fiche-technique-voiture', label: 'Fiche Technique Voiture' },
      { path: '/compte-affaire', label: 'Compte Affaire' },
      { path: '/compte-evenement', label: 'Compte Événement' },
      { path: '/origine-evenement', label: 'Origine Événement' }
    ]
  };

  // Détermine quelle section est active
  const getActiveSection = () => {
    if (path.includes('proprietaire') || path.includes('civilite') || path.includes('prospect')) {
      return 'proprietaires';
    } else if (path.includes('voiture') || path.includes('vehicule') || path.includes('energie')) {
      return 'voitures';
    } else if (path.includes('vente')) {
      return 'ventes';
    } else if (path.includes('fiche-technique') || path.includes('compte') || path.includes('evenement')) {
      return 'evenements';
    }
    return '';
  };

  const activeSection = getActiveSection();

  return (
    <div className="sub-navbar">
      {activeSection && subNavs[activeSection] && (
        <Nav className="justify-content-center">
          {subNavs[activeSection].map((item) => (
            <Nav.Item key={item.path}>
              <Nav.Link
                as={Link}
                to={item.path}
                className={path === item.path ? 'active' : ''}
              >
                {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      )}
    </div>
  );
};

export default SubNavbar;
