import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import VehiculeList from '../components/vehicules/VehiculeList';
import VehiculeSearch from '../components/vehicules/VehiculeSearch';
import vehiculeService from '../services/vehiculeService';

const VehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    console.log('VehiculesPage - useEffect déclenché avec:', { page, limit, sortBy, sortOrder });
    fetchVehicules();
  }, [page, limit, sortBy, sortOrder]);

  const fetchVehicules = async (filters = {}) => {
    try {
      console.log('VehiculesPage - fetchVehicules appelé avec filters:', filters);
      setLoading(true);
      const response = await vehiculeService.getVehicules(page, limit, {
        ...filters,
        sortBy,
        sortOrder
      });
      
      console.log('VehiculesPage - réponse reçue:', response);
      
      if (response) {
        console.log('VehiculesPage - mise à jour des véhicules:', response.items);
        console.log('VehiculesPage - mise à jour du total:', response.total);
        setVehicules(response.items || []);
        setTotal(response.total || 0);
      } else {
        console.warn('VehiculesPage - réponse vide, réinitialisation des données');
        setVehicules([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error('VehiculesPage - Erreur lors du chargement des véhicules:', err);
      setError('Impossible de charger les véhicules. Veuillez réessayer.');
      setVehicules([]);
      setTotal(0);
    } finally {
      setLoading(false);
      console.log('VehiculesPage - chargement terminé');
    }
  };

  const handleSearch = (searchFilters) => {
    console.log('VehiculesPage - handleSearch appelé avec:', searchFilters);
    setPage(0);
    fetchVehicules(searchFilters);
  };

  const handlePageChange = (newPage) => {
    console.log('VehiculesPage - handlePageChange appelé avec:', newPage);
    setPage(newPage - 1); // Ajustement pour la pagination basée sur 1 dans l'UI
  };

  const handleLimitChange = (newLimit) => {
    console.log('VehiculesPage - handleLimitChange appelé avec:', newLimit);
    setLimit(newLimit);
    setPage(0);
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
      fetchVehicules();
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

  console.log('VehiculesPage - rendu avec:', { vehicules, total, page, limit, loading, error });

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
        page={page + 1} // Ajustement pour la pagination basée sur 1 dans l'UI
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