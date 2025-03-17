import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import VenteList from '../components/ventes/VenteList';
import VenteSearch from '../components/ventes/VenteSearch';
import venteService from '../services/venteService';

const VentesPage = () => {
  const [ventes, setVentes] = useState([]);
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
    fetchVentes();
  }, [page, limit, sortBy, sortOrder]);

  const fetchVentes = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await venteService.getVentes(page, limit, {
        ...filters,
        sortBy,
        sortOrder
      });
      
      if (response) {
        setVentes(response.items || []);
        setTotal(response.total || 0);
      } else {
        setVentes([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des ventes:', err);
      setError('Impossible de charger les ventes. Veuillez réessayer.');
      setVentes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchFilters) => {
    setPage(0);
    fetchVentes(searchFilters);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(0);
  };

  const handleSort = (field, direction) => {
    setSortBy(field);
    setSortOrder(direction);
  };

  const handleDelete = async (id) => {
    try {
      await venteService.deleteVente(id);
      
      setSnackbar({
        open: true,
        message: 'Vente supprimée avec succès',
        severity: 'success'
      });
      
      // Rafraîchir la liste
      fetchVentes();
    } catch (err) {
      console.error('Erreur lors de la suppression de la vente:', err);
      
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression de la vente',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des Ventes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Consultez, recherchez et gérez toutes les ventes
        </Typography>
      </Box>

      <VenteSearch onSearch={handleSearch} />

      <VenteList
        ventes={ventes}
        total={total}
        page={page + 1}
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

export default VentesPage; 