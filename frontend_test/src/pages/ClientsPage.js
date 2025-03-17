import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import ClientList from '../components/clients/ClientList';
import ClientSearch from '../components/clients/ClientSearch';
import clientService from '../services/clientService';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
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
    fetchClients();
  }, [page, limit, sortBy, sortOrder]);

  const fetchClients = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await clientService.getClients(page, limit, {
        ...filters,
        sortBy,
        sortOrder
      });
      
      if (response) {
        setClients(response.items || []);
        setTotal(response.total || 0);
      } else {
        setClients([]);
        setTotal(0);
      }
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des clients:', err);
      setError('Impossible de charger les clients. Veuillez réessayer.');
      setClients([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchFilters) => {
    setPage(0);
    fetchClients(searchFilters);
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
      await clientService.deleteClient(id);
      
      setSnackbar({
        open: true,
        message: 'Client supprimé avec succès',
        severity: 'success'
      });
      
      // Rafraîchir la liste
      fetchClients();
    } catch (err) {
      console.error('Erreur lors de la suppression du client:', err);
      
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du client',
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
          Gestion des Clients
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Consultez, recherchez et gérez tous les clients
        </Typography>
      </Box>

      <ClientSearch onSearch={handleSearch} />

      <ClientList
        clients={clients}
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

export default ClientsPage; 