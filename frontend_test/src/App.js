import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import VehiculesPage from './pages/VehiculesPage';
import ClientsPage from './pages/ClientsPage';
import VentesPage from './pages/VentesPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages de détail, modification et création
import VehiculeDetailPage from './pages/vehicules/VehiculeDetailPage';
import VehiculeFormPage from './pages/vehicules/VehiculeFormPage';
import ClientDetailPage from './pages/clients/ClientDetailPage';
import ClientFormPage from './pages/clients/ClientFormPage';
import VenteDetailPage from './pages/ventes/VenteDetailPage';
import VenteFormPage from './pages/ventes/VenteFormPage';

// Pages de référence
import CivilitesPage from './pages/reference/CivilitesPage';
import EnergiesPage from './pages/reference/EnergiesPage';
import EvenementsPage from './pages/reference/EvenementsPage';
import MarquesPage from './pages/reference/MarquesPage';
import ModelesPage from './pages/reference/ModelesPage';
import VendeursPage from './pages/reference/VendeursPage';

// Création du thème sombre professionnel
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 500,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
          },
        },
        contained: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)',
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            color: '#ffffff',
          },
          '&.Mui-active': {
            color: '#3f51b5',
            '&:hover': {
              color: '#757de8',
            },
            '& .MuiTableSortLabel-icon': {
              color: '#3f51b5 !important',
            },
          },
        },
        icon: {
          color: 'rgba(255, 255, 255, 0.5) !important',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Routes Véhicules */}
            <Route path="/vehicules" element={<VehiculesPage />} />
            <Route path="/vehicules/new" element={<VehiculeFormPage />} />
            <Route path="/vehicules/:id" element={<VehiculeDetailPage />} />
            <Route path="/vehicules/:id/edit" element={<VehiculeFormPage />} />
            
            {/* Routes Clients */}
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<ClientFormPage />} />
            <Route path="/clients/:id" element={<ClientDetailPage />} />
            <Route path="/clients/:id/edit" element={<ClientFormPage />} />
            
            {/* Routes Ventes */}
            <Route path="/ventes" element={<VentesPage />} />
            <Route path="/ventes/new" element={<VenteFormPage />} />
            <Route path="/ventes/:id" element={<VenteDetailPage />} />
            <Route path="/ventes/:id/edit" element={<VenteFormPage />} />
            
            {/* Routes Références */}
            <Route path="/civilites" element={<CivilitesPage />} />
            <Route path="/energies" element={<EnergiesPage />} />
            <Route path="/evenements" element={<EvenementsPage />} />
            <Route path="/marques" element={<MarquesPage />} />
            <Route path="/modeles" element={<ModelesPage />} />
            <Route path="/vendeurs" element={<VendeursPage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
