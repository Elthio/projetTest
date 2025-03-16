import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Navigation structure organized by functionality with path mappings
  const navStructure = [
    {
      title: 'Propriétaires',
      items: [
        { name: 'Propriétaires', path: '/proprietaires' },
        { name: 'Libelle Civilite', path: '/libelle-civilite' },
        { name: 'Type Prospect', path: '/type-prospect' }
      ]
    },
    {
      title: 'Voitures',
      items: [
        { name: 'Voiture', path: '/voiture' },
        { name: 'Type Vehicule', path: '/type-vehicule' },
        { name: 'Energie', path: '/energie' }
      ]
    },
    {
      title: 'Fiche Vente',
      items: [
        { name: 'Fiche Vente', path: '/fiche-vente' },
        { name: 'Type Ventes', path: '/type-ventes' }
      ]
    },
    {
      title: 'Fiche Technique',
      items: [
        { name: 'Fiche Technique Voiture', path: '/fiche-technique-voiture' },
        { name: 'Compte Affaire', path: '/compte-affaire' },
        { name: 'Compte Evenement', path: '/compte-evenement' },
        { name: 'Origine Evenement', path: '/origine-evenement' }
      ]
    }
  ];

  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>Gestion Voitures</h1>
          </Link>
        </div>
        <ul className="navbar-menu">
          {navStructure.map((category, index) => (
            <li key={index} className={`navbar-item ${activeDropdown === index ? 'active' : ''}`}>
              <button 
                className="navbar-link dropdown-toggle"
                onClick={() => toggleDropdown(index)}
              >
                {category.title} ▼
              </button>
              <ul className={`dropdown-menu ${activeDropdown === index ? 'show' : ''}`}>
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="dropdown-item">
                    <Link 
                      to={item.path} 
                      className="dropdown-link"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
