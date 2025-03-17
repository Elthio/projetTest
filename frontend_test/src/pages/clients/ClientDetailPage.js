import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import clientService from '../../services/clientService';
import vehiculeService from '../../services/vehiculeService';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState(null);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const clientData = await clientService.getClientById(id);
        setClient(clientData);
        
        // Récupérer les véhicules du client
        if (clientData && clientData.vehicules && clientData.vehicules.length > 0) {
          // Utiliser les véhicules déjà présents dans la réponse du client
          setVehicules(clientData.vehicules);
        } else {
          // Si aucun véhicule n'est présent dans la réponse, faire une requête séparée
          try {
            const vehiculesResponse = await vehiculeService.getVehicules(1, 10, { 'client.id': id });
            setVehicules(vehiculesResponse.items || []);
          } catch (vehiculeErr) {
            console.error('Erreur lors du chargement des véhicules:', vehiculeErr);
            // Ne pas bloquer l'affichage du client si les véhicules ne peuvent pas être chargés
            setVehicules([]);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement du client:', err);
        setError('Impossible de charger les détails du client.');
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [id]);
  
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      setLoading(true);
      await clientService.deleteClient(id);
      navigate('/clients');
    } catch (err) {
      console.error('Erreur lors de la suppression du client:', err);
      setError('Impossible de supprimer le client.');
      setLoading(false);
    }
  };
  
  const getInitials = (client) => {
    if (client.compteAffaire) {
      return client.compteAffaire.substring(0, 2).toUpperCase();
    }
    return `${client.prenom?.charAt(0) || ''}${client.nom?.charAt(0) || ''}`.toUpperCase();
  };
  
  const getAvatarColor = (client) => {
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
  
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des données...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/clients"
          >
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!client) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Client non trouvé</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/clients"
          >
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/clients"
        >
          Retour à la liste
        </Button>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/clients/${id}/edit`}
            sx={{ mr: 1 }}
          >
            Modifier
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            {deleteConfirm ? 'Confirmer la suppression' : 'Supprimer'}
          </Button>
        </Box>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: getAvatarColor(client),
              width: 60,
              height: 60,
              mr: 2
            }}
          >
            {getInitials(client)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              {client.civilite?.libelle || ''} {client.nom || ''} {client.prenom || ''}
            </Typography>
            {client.compteAffaire && (
              <Typography variant="h6" color="text.secondary">
                {client.compteAffaire}
              </Typography>
            )}
            {client.estProprietaireActuel && (
              <Chip
                label="Propriétaire actuel"
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {/* Adresses */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HomeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    Adresses
                  </Typography>
                </Box>
                
                {client.adresses && client.adresses.length > 0 ? (
                  <List disablePadding>
                    {client.adresses.map((adresse, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 2 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {adresse.type === 'FACTURATION' ? (
                            <BusinessIcon color="primary" fontSize="small" />
                          ) : (
                            <HomeIcon color="secondary" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2">
                              {adresse.type === 'FACTURATION' ? 'Adresse de facturation' : 'Adresse de livraison'}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="span" display="block">
                                {adresse.rue || ''}
                              </Typography>
                              <Typography variant="body2" component="span" display="block">
                                {adresse.codePostal || ''} {adresse.ville || ''}
                              </Typography>
                              {adresse.pays && (
                                <Typography variant="body2" component="span" display="block">
                                  {adresse.pays}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucune adresse enregistrée
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Contacts */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    Contacts
                  </Typography>
                </Box>
                
                <List disablePadding>
                  {client.contacts && client.contacts.length > 0 ? (
                    client.contacts.map((contact, index) => (
                      <React.Fragment key={index}>
                        {contact.email && (
                          <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <EmailIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={contact.email}
                              secondary="Email"
                            />
                          </ListItem>
                        )}
                        
                        {contact.telephoneFixe && (
                          <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <PhoneIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={contact.telephoneFixe}
                              secondary="Téléphone fixe"
                            />
                          </ListItem>
                        )}
                        
                        {contact.telephonePortable && (
                          <ListItem disablePadding>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <PhoneIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={contact.telephonePortable}
                              secondary="Mobile"
                            />
                          </ListItem>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aucun contact enregistré
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Véhicules */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    Véhicules
                  </Typography>
                </Box>
                
                {vehicules && vehicules.length > 0 ? (
                  <List disablePadding>
                    {vehicules.map((vehicule) => (
                      <ListItem
                        key={vehicule.id}
                        disablePadding
                        sx={{
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        component={Link}
                        to={`/vehicules/${vehicule.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItemIcon>
                          <DirectionsCarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {vehicule.marque?.libelle || ''} {vehicule.modele?.libelle || ''} {vehicule.version || ''}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {vehicule.immatriculation || 'Sans immatriculation'} - {vehicule.vin || 'VIN non renseigné'}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aucun véhicule associé
                  </Typography>
                )}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/vehicules/new?clientId=${id}`}
                    startIcon={<DirectionsCarIcon />}
                  >
                    Ajouter un véhicule
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ClientDetailPage; 