import React, { useState, useRef } from 'react';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import VehiculeList from '../components/vehicules/VehiculeList';
import VehiculeSearch from '../components/vehicules/VehiculeSearch';
import vehiculeService from '../services/vehiculeService';
import useApi from '../utils/useApi';

const VehiculesPage = () => {
  // États pour la pagination et le tri
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [filters, setFilters] = useState({});
  
  // État pour les notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Référence pour stocker directement les données
  const dataRef = useRef({ items: [], total: 0 });
  
  // Fonction pour effectuer l'appel API
  const fetchVehicules = async () => {
    console.log('VehiculesPage - fetchVehicules appelé avec:', { page, limit, sortBy, sortOrder, filters });
    const response = await vehiculeService.getVehicules(page, limit, {
      ...filters,
      sortBy,
      sortOrder
    });
    
    // Stocker les données dans la référence
    if (response) {
      dataRef.current = response;
    }
    
    return response;
  };
  
  // Utiliser notre hook personnalisé
  const { data, loading, error, refetch } = useApi(
    fetchVehicules,
    [page, limit, sortBy, sortOrder, JSON.stringify(filters)],
    {
      initialData: { items: [], total: 0 },
      onSuccess: (result) => {
        console.log('VehiculesPage - Données chargées avec succès:', result);
      },
      onError: (err) => {
        console.error('VehiculesPage - Erreur lors du chargement des données:', err);
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des véhicules',
          severity: 'error'
        });
      }
    }
  );
  
  // Extraire les données
  const vehicules = data?.items || [];
  const total = data?.total || 0;

  const handleSearch = (searchFilters) => {
    console.log('VehiculesPage - handleSearch appelé avec:', searchFilters);
    setFilters(searchFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    console.log('VehiculesPage - handlePageChange appelé avec:', newPage);
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    console.log('VehiculesPage - handleLimitChange appelé avec:', newLimit);
    setLimit(newLimit);
    setPage(1);
  };

  const handleSort = (field, direction) => {
    console.log('VehiculesPage - handleSort appelé avec:', { field, direction });
    setSortBy(field);
    setSortOrder(direction);
  };

  const handleDelete = async (id) => {
    try {
      console.log('VehiculesPage - handleDelete appelé pour l\'ID:', id);
      await vehiculeService.deleteVehicule(id);
      
      setSnackbar({
        open: true,
        message: 'Véhicule supprimé avec succès',
        severity: 'success'
      });
      
      // Rafraîchir la liste
      refetch();
    } catch (err) {
      console.error('VehiculesPage - Erreur lors de la suppression du véhicule:', err);
      
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du véhicule',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  console.log('VehiculesPage - rendu avec:', { 
    vehicules, 
    vehiculesLength: vehicules.length,
    total, 
    page, 
    limit, 
    loading, 
    error 
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des Véhicules
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Consultez, recherchez et gérez tous les véhicules
        </Typography>
      </Box>

      <VehiculeSearch onSearch={handleSearch} />

      <VehiculeList
        vehicules={vehicules}
        total={total}
        page={page}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onDelete={handleDelete}
        onSort={handleSort}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehiculesPage; 