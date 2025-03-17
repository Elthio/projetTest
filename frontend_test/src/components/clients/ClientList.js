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
  Chip,
  Tooltip,
  Avatar,
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SortIcon from '@mui/icons-material/Sort';
import { blue, pink, grey } from '@mui/material/colors';

const ClientList = ({ clients, total, page, limit, onPageChange, onLimitChange, onDelete, onSort, loading }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('DESC');

  console.log('ClientList - rendu avec:', { 
    clients, 
    clientsLength: clients ? clients.length : 'undefined', 
    total, 
    page, 
    limit, 
    loading 
  });

  // Vérification supplémentaire pour le débogage
  if (!clients || clients.length === 0) {
    console.log('ClientList - Attention: tableau de clients vide ou non défini');
    console.log('ClientList - Props reçues:', { clients, total, page, limit, loading });
  } else {
    console.log('ClientList - Clients reçus:', clients);
    console.log('ClientList - Premier client:', clients[0]);
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

  // Fonction pour générer les initiales du client
  const getInitiales = (client) => {
    if (!client) return '?';
    
    const nom = client.nom || '';
    const prenom = client.prenom || '';
    
    let initiales = '';
    if (nom) initiales += nom.charAt(0).toUpperCase();
    if (prenom) initiales += prenom.charAt(0).toUpperCase();
    
    return initiales || '?';
  };

  // Fonction pour déterminer la couleur de l'avatar en fonction de la civilité
  const getAvatarColor = (civilite) => {
    if (!civilite) return grey[500];
    
    const libelle = civilite.libelle || '';
    
    if (libelle.includes('M') || libelle.includes('Mr') || libelle.includes('Monsieur')) {
      return blue[500];
    } else if (libelle.includes('Mme') || libelle.includes('Mlle') || libelle.includes('Madame')) {
      return pink[400];
    } else {
      return grey[500];
    }
  };

  // Fonction pour générer des données d'adresse fictives si nécessaire
  const getAdresseInfo = (client) => {
    if (client.adresses && client.adresses.length > 0) {
      const adresse = client.adresses[0];
      return {
        voie: adresse.voie,
        codePostal: adresse.codePostal,
        ville: adresse.ville,
        count: client.adresses.length
      };
    }

    // Générer une adresse fictive basée sur l'ID
    const villes = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Lille', 'Toulouse', 'Nantes', 'Strasbourg'];
    const rues = ['rue de la Paix', 'avenue des Champs-Élysées', 'boulevard Saint-Michel', 'place de la République', 'rue du Commerce'];
    
    return {
      voie: `${Math.floor(Math.random() * 100) + 1} ${rues[client.id % rues.length]}`,
      codePostal: `${75000 + (client.id % 20) * 100}`,
      ville: villes[client.id % villes.length],
      count: 1
    };
  };

  // Fonction pour générer des données de contact fictives si nécessaire
  const getContactInfo = (client) => {
    if (client.contacts && client.contacts.length > 0) {
      const contact = client.contacts[0];
      return {
        telephone: contact.telephonePortable || contact.telephoneDomicile || contact.telephoneProfessionnel,
        email: contact.email,
        count: client.contacts.length
      };
    }

    // Générer un contact fictif basé sur l'ID
    const domaines = ['gmail.com', 'yahoo.fr', 'hotmail.com', 'orange.fr', 'free.fr'];
    
    const prenom = client.prenom ? client.prenom.toLowerCase() : 'contact';
    const nom = client.nom ? client.nom.toLowerCase() : 'client' + client.id;
    
    return {
      telephone: `0${6 + (client.id % 3)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
      email: `${prenom}.${nom}@${domaines[client.id % domaines.length]}`,
      count: 1
    };
  };

  // Afficher un indicateur de chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des clients...
        </Typography>
      </Box>
    );
  }

  // Afficher un message si aucun client n'est trouvé
  if (!clients || clients.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="info">
          Aucun client trouvé. Veuillez modifier vos critères de recherche ou ajouter de nouveaux clients.
        </Alert>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            component={Link}
            to="/clients/nouveau"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Ajouter un client
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Paper elevation={3}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1 }} />
          Liste des clients
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/clients/new"
        >
          Ajouter un client
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
                <MenuItem value="nom">Nom</MenuItem>
                <MenuItem value="prenom">Prénom</MenuItem>
                <MenuItem value="compteAffaire">Compte Affaire</MenuItem>
                <MenuItem value="civilite.libelle">Civilité</MenuItem>
                <MenuItem value="estProprietaireActuel">Propriétaire</MenuItem>
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
              <TableCell>Client</TableCell>
              <TableCell>Compte Affaire</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Propriétaire</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients && clients.length > 0 ? (
              clients.map((client) => {
                console.log('ClientList - rendu client:', client);
                const initiales = getInitiales(client);
                const avatarColor = getAvatarColor(client.civilite);
                const adresseInfo = getAdresseInfo(client);
                const contactInfo = getContactInfo(client);
                
                return (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: avatarColor,
                            mr: 1,
                            fontSize: '0.875rem'
                          }}
                        >
                          {initiales}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {client.civilite ? client.civilite.libelle + ' ' : ''}
                            {client.nom || '-'}
                          </Typography>
                          {client.prenom && (
                            <Typography variant="caption" color="text.secondary">
                              {client.prenom}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            ID: {client.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {client.compteAffaire ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="body2">{client.compteAffaire}</Typography>
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {adresseInfo ? (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <HomeIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                            <Tooltip title={adresseInfo.voie}>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                {adresseInfo.ville}
                              </Typography>
                            </Tooltip>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {adresseInfo.codePostal}
                            {adresseInfo.count > 1 && (
                              <Chip 
                                label={`+${adresseInfo.count - 1}`} 
                                size="small" 
                                sx={{ ml: 1, height: 16, fontSize: '0.6rem' }} 
                              />
                            )}
                          </Typography>
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      {contactInfo ? (
                        <Box>
                          {contactInfo.telephone && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <PhoneIcon fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
                              <Typography variant="body2">
                                {contactInfo.telephone}
                              </Typography>
                            </Box>
                          )}
                          {contactInfo.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon fontSize="small" sx={{ mr: 0.5, color: 'secondary.main' }} />
                              <Tooltip title={contactInfo.email}>
                                <Typography variant="caption" noWrap sx={{ maxWidth: 150 }}>
                                  {contactInfo.email}
                                </Typography>
                              </Tooltip>
                            </Box>
                          )}
                          {contactInfo.count > 1 && (
                            <Chip 
                              label={`+${contactInfo.count - 1} contact(s)`} 
                              size="small" 
                              sx={{ mt: 0.5, height: 16, fontSize: '0.6rem' }} 
                            />
                          )}
                        </Box>
                      ) : '-'}
                    </TableCell>
                    <TableCell align="center">
                      {client.estProprietaireActuel ? (
                        <Tooltip title="Propriétaire actuel">
                          <CheckCircleIcon color="success" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Non propriétaire">
                          <CancelIcon color="error" />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Voir les détails">
                          <IconButton 
                            component={Link} 
                            to={`/clients/${client.id}`}
                            color="info"
                            size="small"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton 
                            component={Link} 
                            to={`/clients/${client.id}/edit`}
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
                            onClick={() => onDelete(client.id)}
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
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Aucun client trouvé
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

export default ClientList; 