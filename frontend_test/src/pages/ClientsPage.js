import React, { useState, useRef } from 'react';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import ClientList from '../components/clients/ClientList';
import ClientSearch from '../components/clients/ClientSearch';
import clientService from '../services/clientService';
import useApi from '../utils/useApi';

const ClientsPage = () => {
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
  
  // Fonction pour effectuer l'appel API
  const fetchClients = async () => {
    console.log('ClientsPage - fetchClients appelé avec:', { page, limit, sortBy, sortOrder, filters });
    const response = await clientService.getClients(page, limit, {
      ...filters,
      sortBy,
      sortOrder
    });
    
    console.log('ClientsPage - réponse reçue dans fetchClients:', response);
    return response;
  };
  
  // Utiliser notre hook personnalisé
  const { data, loading, error, refetch } = useApi(
    fetchClients,
    [page, limit, sortBy, sortOrder, JSON.stringify(filters)],
    {
      initialData: { items: [], total: 0 },
      onSuccess: (result) => {
        console.log('ClientsPage - Données chargées avec succès:', result);
      },
      onError: (err) => {
        console.error('ClientsPage - Erreur lors du chargement des données:', err);
        setSnackbar({
          open: true,
          message: 'Erreur lors du chargement des clients',
          severity: 'error'
        });
      }
    }
  );
  
  // Extraire les données
  const clients = data?.items || [];
  const total = data?.total || 0;

  const handleSearch = (searchFilters) => {
    console.log('ClientsPage - handleSearch appelé avec:', searchFilters);
    setFilters(searchFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    console.log('ClientsPage - handlePageChange appelé avec:', newPage);
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    console.log('ClientsPage - handleLimitChange appelé avec:', newLimit);
    setLimit(newLimit);
    setPage(1);
  };

  const handleSort = (field, direction) => {
    console.log('ClientsPage - handleSort appelé avec:', { field, direction });
    setSortBy(field);
    setSortOrder(direction);
  };

  const handleDelete = async (id) => {
    try {
      console.log('ClientsPage - handleDelete appelé pour l\'ID:', id);
      await clientService.deleteClient(id);
      
      setSnackbar({
        open: true,
        message: 'Client supprimé avec succès',
        severity: 'success'
      });
      
      // Rafraîchir la liste
      refetch();
    } catch (err) {
      console.error('ClientsPage - Erreur lors de la suppression du client:', err);
      
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

  // Log des données avant le rendu
  console.log('ClientsPage - rendu avec:', { 
    clients, 
    clientsLength: clients.length, 
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

export default ClientsPage; 