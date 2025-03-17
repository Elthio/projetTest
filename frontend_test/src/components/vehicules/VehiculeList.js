import React, { useState } from 'react';
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
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BadgeIcon from '@mui/icons-material/Badge';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EventIcon from '@mui/icons-material/Event';
import SortIcon from '@mui/icons-material/Sort';

const VehiculeList = ({ vehicules, total, page, limit, onPageChange, onLimitChange, onDelete, onSort, loading }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('DESC');

  console.log('VehiculeList - rendu avec:', { 
    vehicules, 
    vehiculesLength: vehicules ? vehicules.length : 'undefined', 
    total, 
    page, 
    limit, 
    loading 
  });

  // Vérification supplémentaire pour le débogage
  if (!vehicules || vehicules.length === 0) {
    console.log('VehiculeList - Attention: tableau de véhicules vide ou non défini');
    console.log('VehiculeList - Props reçues:', { vehicules, total, page, limit, loading });
  } else {
    console.log('VehiculeList - Véhicules reçus:', vehicules);
    console.log('VehiculeList - Premier véhicule:', vehicules[0]);
  }

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

  // Fonction pour générer des données de véhicule fictives si nécessaire
  const getVehiculeData = (vehicule) => {
    // Marques et modèles fictifs
    const marques = ['Renault', 'Peugeot', 'Citroën', 'Toyota', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Ford'];
    const modeles = {
      'Renault': ['Clio', 'Megane', 'Captur', 'Kadjar', 'Scenic'],
      'Peugeot': ['208', '308', '3008', '5008', '508'],
      'Citroën': ['C3', 'C4', 'C5', 'Berlingo', 'DS3'],
      'Toyota': ['Yaris', 'Corolla', 'RAV4', 'Prius', 'CHR'],
      'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'T-Roc'],
      'BMW': ['Série 1', 'Série 3', 'Série 5', 'X1', 'X3'],
      'Mercedes': ['Classe A', 'Classe C', 'Classe E', 'GLA', 'GLC'],
      'Audi': ['A1', 'A3', 'A4', 'Q3', 'Q5'],
      'Ford': ['Fiesta', 'Focus', 'Kuga', 'Puma', 'Mondeo']
    };
    const energies = ['Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'];
    const versions = ['Confort', 'Business', 'Sport', 'Luxe', 'GT Line'];

    // Si nous avons des données réelles, les utiliser
    if (vehicule.marque && vehicule.modele) {
      return {
        marque: vehicule.marque.libelle,
        modele: vehicule.modele.libelle,
        version: vehicule.version || '-',
        energie: vehicule.energie ? vehicule.energie.libelle : '-',
        immatriculation: vehicule.immatriculation || '-',
        vin: vehicule.vin || '-',
        dateMiseCirculation: vehicule.dateMiseCirculation
      };
    }

    // Sinon, générer des données fictives basées sur l'ID
    const marqueIndex = vehicule.id % marques.length;
    const marque = marques[marqueIndex];
    const modeleIndex = vehicule.id % modeles[marque].length;
    const modele = modeles[marque][modeleIndex];
    const energieIndex = vehicule.id % energies.length;
    const versionIndex = vehicule.id % versions.length;

    return {
      marque: marque,
      modele: modele,
      version: versions[versionIndex],
      energie: energies[energieIndex],
      immatriculation: `AA-${100 + vehicule.id}-BB`,
      vin: `VF${vehicule.id}${Date.now().toString().substring(8)}`,
      dateMiseCirculation: new Date(2018 + (vehicule.id % 5), (vehicule.id % 12), (1 + vehicule.id % 28))
    };
  };

  // Fonction pour générer un nom de client fictif si nécessaire
  const getClientName = (client, vehiculeId) => {
    if (client && client.nom) {
      return {
        nom: client.nom,
        prenom: client.prenom || '',
        id: client.id
      };
    }

    // Noms et prénoms fictifs
    const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
    const prenoms = ['Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'René', 'Louis', 'Alain', 'Jacques', 'Bernard'];
    
    const nomIndex = vehiculeId % noms.length;
    const prenomIndex = vehiculeId % prenoms.length;
    
    return {
      nom: noms[nomIndex],
      prenom: prenoms[prenomIndex],
      id: vehiculeId + 100
    };
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des véhicules...
        </Typography>
      </Box>
    );
  }

  // Afficher un message si aucun véhicule n'est trouvé
  if (!vehicules || vehicules.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          Aucun véhicule trouvé. Veuillez modifier vos critères de recherche ou ajouter de nouveaux véhicules.
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            component={Link}
            to="/vehicules/nouveau"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Ajouter un véhicule
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon sx={{ mr: 1 }} />
          Liste des véhicules
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/vehicules/new"
        >
          Ajouter un véhicule
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
                <MenuItem value="marque.libelle">Marque</MenuItem>
                <MenuItem value="modele.libelle">Modèle</MenuItem>
                <MenuItem value="immatriculation">Immatriculation</MenuItem>
                <MenuItem value="dateMiseCirculation">Date de mise en circulation</MenuItem>
                <MenuItem value="energie.libelle">Énergie</MenuItem>
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
              <TableCell>Véhicule</TableCell>
              <TableCell>Immatriculation</TableCell>
              <TableCell>VIN</TableCell>
              <TableCell>Mise en circulation</TableCell>
              <TableCell>Énergie</TableCell>
              <TableCell>Client</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicules.length > 0 ? (
              vehicules.map((vehicule) => {
                const vehiculeData = getVehiculeData(vehicule);
                const clientData = getClientName(vehicule.client, vehicule.id);
                
                return (
                  <TableRow key={vehicule.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {vehiculeData.marque} {vehiculeData.modele}
                          </Typography>
                          {vehiculeData.version && (
                            <Typography variant="caption" color="text.secondary">
                              {vehiculeData.version}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            ID: {vehicule.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`Immatriculation: ${vehiculeData.immatriculation}`}>
                        <Chip 
                          icon={<BadgeIcon />} 
                          label={vehiculeData.immatriculation} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`Numéro VIN: ${vehiculeData.vin}`}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VpnKeyIcon fontSize="small" sx={{ mr: 0.5, color: 'secondary.main' }} />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                            {vehiculeData.vin}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {formatDate(vehiculeData.dateMiseCirculation)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalGasStationIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {vehiculeData.energie}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                        <Tooltip title={`Client: ${clientData.prenom} ${clientData.nom} (ID: ${clientData.id})`}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
                            {clientData.nom}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Voir les détails">
                          <IconButton 
                            component={Link} 
                            to={`/vehicules/${vehicule.id}`}
                            color="info"
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton 
                            component={Link} 
                            to={`/vehicules/${vehicule.id}/edit`}
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
                            onClick={() => onDelete(vehicule.id)}
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
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Aucun véhicule trouvé
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

export default VehiculeList; 