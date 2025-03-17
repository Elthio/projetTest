import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Typography,
  Box,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SortIcon from '@mui/icons-material/Sort';
import clientService from '../../services/clientService';
import vehiculeService from '../../services/vehiculeService';

const VenteList = ({ ventes, total, page, limit, onPageChange, onLimitChange, onDelete, onSort, loading }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [clientsData, setClientsData] = useState({});
  const [vehiculesData, setVehiculesData] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!ventes || ventes.length === 0) return;
      
      setLoadingDetails(true);
      
      // Extraire les IDs uniques des clients et véhicules
      const clientIds = [...new Set(ventes
        .filter(vente => vente.client && typeof vente.client === 'string')
        .map(vente => {
          // Extraire l'ID du client à partir de l'URL de l'API
          const matches = vente.client.match(/\/api\/clients\/(\d+)/);
          return matches ? matches[1] : null;
        })
        .filter(id => id !== null)
      )];
      
      const vehiculeIds = [...new Set(ventes
        .filter(vente => vente.vehicule && typeof vente.vehicule === 'string')
        .map(vente => {
          // Extraire l'ID du véhicule à partir de l'URL de l'API
          const matches = vente.vehicule.match(/\/api\/vehicules\/(\d+)/);
          return matches ? matches[1] : null;
        })
        .filter(id => id !== null)
      )];
      
      // Récupérer les données des clients
      const clientsPromises = clientIds.map(id => 
        clientService.getClientById(id)
          .then(data => ({ id, data }))
          .catch(err => {
            console.error(`Erreur lors de la récupération du client ${id}:`, err);
            return { id, data: null };
          })
      );
      
      // Récupérer les données des véhicules
      const vehiculesPromises = vehiculeIds.map(id => 
        vehiculeService.getVehiculeById(id)
          .then(data => ({ id, data }))
          .catch(err => {
            console.error(`Erreur lors de la récupération du véhicule ${id}:`, err);
            return { id, data: null };
          })
      );
      
      // Attendre toutes les requêtes
      const [clientsResults, vehiculesResults] = await Promise.all([
        Promise.all(clientsPromises),
        Promise.all(vehiculesPromises)
      ]);
      
      // Transformer les résultats en objets pour un accès facile
      const newClientsData = clientsResults.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {});
      
      const newVehiculesData = vehiculesResults.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {});
      
      setClientsData(newClientsData);
      setVehiculesData(newVehiculesData);
      setLoadingDetails(false);
    };
    
    fetchRelatedData();
  }, [ventes]);

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    onLimitChange(parseInt(event.target.value, 10));
    onPageChange(1);
  };

  const handleSortChange = (event) => {
    const newSortField = event.target.value;
    setSortField(newSortField);
    if (onSort) {
      onSort(newSortField, sortDirection);
    }
  };

  const handleSortDirectionChange = (event) => {
    const newSortDirection = event.target.value;
    setSortDirection(newSortDirection);
    if (onSort) {
      onSort(sortField, newSortDirection);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir les données du client à partir de l'URL de l'API
  const getClientData = (clientUrl) => {
    if (!clientUrl) return null;
    
    const matches = clientUrl.match(/\/api\/clients\/(\d+)/);
    if (!matches) return null;
    
    const clientId = matches[1];
    return clientsData[clientId] || null;
  };
  
  // Fonction pour obtenir les données du véhicule à partir de l'URL de l'API
  const getVehiculeData = (vehiculeUrl) => {
    if (!vehiculeUrl) return null;
    
    const matches = vehiculeUrl.match(/\/api\/vehicules\/(\d+)/);
    if (!matches) return null;
    
    const vehiculeId = matches[1];
    return vehiculesData[vehiculeId] || null;
  };

  // Fonction pour obtenir les initiales du client
  const getClientInitials = (clientUrl) => {
    const client = getClientData(clientUrl);
    if (!client) return '';
    
    if (client.compteAffaire) {
      return client.compteAffaire.substring(0, 2).toUpperCase();
    }
    return `${client.prenom?.charAt(0) || ''}${client.nom?.charAt(0) || ''}`.toUpperCase();
  };

  // Fonction pour obtenir la couleur de l'avatar du client
  const getClientAvatarColor = (clientUrl) => {
    const client = getClientData(clientUrl);
    if (!client) return '#f57c00';
    
    if (client.compteAffaire) {
      return '#388e3c'; // Vert pour les comptes affaires
    }
    if (client.civilite?.libelle === 'M.') {
      return '#1976d2'; // Bleu pour les hommes
    }
    if (client.civilite?.libelle === 'Mme') {
      return '#d32f2f'; // Rouge pour les femmes
    }
    return '#f57c00'; // Orange par défaut
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          Liste des ventes
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/ventes/new"
        >
          Ajouter une vente
        </Button>
      </Box>

      {/* Options de tri */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-field-label">Trier par</InputLabel>
              <Select
                labelId="sort-field-label"
                id="sort-field"
                value={sortField}
                label="Trier par"
                onChange={handleSortChange}
                startAdornment={<SortIcon sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="numeroDossier">Numéro de dossier</MenuItem>
                <MenuItem value="dateAchat">Date d'achat</MenuItem>
                <MenuItem value="dateLivraison">Date de livraison</MenuItem>
                <MenuItem value="typeVnVo">Type (VN/VO)</MenuItem>
                <MenuItem value="client.nom">Client</MenuItem>
                <MenuItem value="vehicule.immatriculation">Véhicule</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-direction-label">Ordre</InputLabel>
              <Select
                labelId="sort-direction-label"
                id="sort-direction"
                value={sortDirection}
                label="Ordre"
                onChange={handleSortDirectionChange}
              >
                <MenuItem value="ASC">Croissant</MenuItem>
                <MenuItem value="DESC">Décroissant</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Dossier</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Véhicule</TableCell>
              <TableCell>Dates</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading || loadingDetails ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Chargement des données...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : ventes && ventes.length > 0 ? (
              ventes.map((vente) => {
                const client = getClientData(vente.client);
                const vehicule = getVehiculeData(vente.vehicule);
                
                return (
                  <TableRow key={vente.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReceiptIcon sx={{ mr: 1, color: vente.typeVnVo === 'VN' ? 'primary.main' : 'secondary.main' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {vente.numeroDossier || `Dossier #${vente.id}`}
                          </Typography>
                          <Chip 
                            label={vente.typeVnVo === 'VN' ? 'Véhicule Neuf' : 'Véhicule Occasion'} 
                            size="small" 
                            color={vente.typeVnVo === 'VN' ? 'primary' : 'secondary'} 
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            mr: 1, 
                            fontSize: '0.75rem',
                            bgcolor: getClientAvatarColor(vente.client)
                          }}
                        >
                          {getClientInitials(vente.client)}
                        </Avatar>
                        <Tooltip title={client ? `${client.civilite?.libelle || ''} ${client.nom || ''} ${client.prenom || ''}` : 'Client non disponible'}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                            {client ? (client.compteAffaire || `${client.nom} ${client.prenom || ''}`) : 'Client non disponible'}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsCarIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                        <Box>
                          {vehicule ? (
                            <>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                                {vehicule.marque?.libelle || ''} {vehicule.modele?.libelle || ''} {vehicule.version || ''}
                              </Typography>
                              <Tooltip title={`VIN: ${vehicule.vin || 'Non spécifié'}`}>
                                <Typography variant="caption" color="text.secondary">
                                  {vehicule.immatriculation || vehicule.vin || 'Non immatriculé'}
                                </Typography>
                              </Tooltip>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Véhicule non disponible
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="caption">
                            Achat: {formatDate(vente.dateAchat)}
                          </Typography>
                        </Box>
                        {vente.dateLivraison && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'secondary.main' }} />
                            <Typography variant="caption">
                              Livraison: {formatDate(vente.dateLivraison)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Voir les détails">
                          <IconButton 
                            component={Link} 
                            to={`/ventes/${vente.id}`}
                            color="info"
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton 
                            component={Link} 
                            to={`/ventes/${vente.id}/edit`}
                            color="primary"
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            color="error"
                            size="small"
                            onClick={() => onDelete(vente.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Aucune vente trouvée
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
      />
    </Paper>
  );
};

export default VenteList; 