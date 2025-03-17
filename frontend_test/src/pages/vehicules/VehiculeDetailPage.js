import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BadgeIcon from '@mui/icons-material/Badge';
import EventIcon from '@mui/icons-material/Event';
import vehiculeService from '../../services/vehiculeService';

const VehiculeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vehicule, setVehicule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchVehicule = async () => {
      try {
        setLoading(true);
        const vehiculeData = await vehiculeService.getVehiculeById(id);
        setVehicule(vehiculeData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement du véhicule:', err);
        setError('Impossible de charger les détails du véhicule.');
        setLoading(false);
      }
    };
    
    fetchVehicule();
  }, [id]);
  
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      setLoading(true);
      await vehiculeService.deleteVehicule(id);
      navigate('/vehicules');
    } catch (err) {
      console.error('Erreur lors de la suppression du véhicule:', err);
      setError('Impossible de supprimer le véhicule.');
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
            to="/vehicules"
          >
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!vehicule) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Véhicule non trouvé</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/vehicules"
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
          to="/vehicules"
        >
          Retour à la liste
        </Button>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/vehicules/${id}/edit`}
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
          <DirectionsCarIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            {vehicule.marque?.libelle || ''} {vehicule.modele?.libelle || ''} {vehicule.version || ''}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    Identification
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Immatriculation
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {vehicule.immatriculation || 'Non spécifiée'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Numéro VIN
                    </Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {vehicule.vin || 'Non spécifié'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Date de mise en circulation
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(vehicule.dateMiseCirculation)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocalGasStationIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    Caractéristiques
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Marque
                    </Typography>
                    <Typography variant="body1">
                      {vehicule.marque?.libelle || 'Non spécifiée'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Modèle
                    </Typography>
                    <Typography variant="body1">
                      {vehicule.modele?.libelle || 'Non spécifié'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Version
                    </Typography>
                    <Typography variant="body1">
                      {vehicule.version || 'Non spécifiée'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Énergie
                    </Typography>
                    <Typography variant="body1">
                      {vehicule.energie?.libelle || 'Non spécifiée'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {vehicule.client && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                      Propriétaire
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: vehicule.client.civilite?.libelle === 'M.' ? '#1976d2' : 
                                vehicule.client.civilite?.libelle === 'Mme' ? '#d32f2f' : 
                                vehicule.client.compteAffaire ? '#388e3c' : '#f57c00',
                        width: 60,
                        height: 60,
                        mr: 2
                      }}
                    >
                      {vehicule.client.compteAffaire 
                        ? vehicule.client.compteAffaire.substring(0, 2).toUpperCase()
                        : `${vehicule.client.prenom?.charAt(0) || ''}${vehicule.client.nom?.charAt(0) || ''}`.toUpperCase()}
                    </Avatar>
                    
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {vehicule.client.civilite?.libelle || ''} {vehicule.client.nom || ''} {vehicule.client.prenom || ''}
                      </Typography>
                      
                      {vehicule.client.compteAffaire && (
                        <Typography variant="body2" color="text.secondary">
                          {vehicule.client.compteAffaire}
                        </Typography>
                      )}
                      
                      <Button
                        variant="text"
                        size="small"
                        component={Link}
                        to={`/clients/${vehicule.client.id}`}
                        sx={{ mt: 1 }}
                      >
                        Voir la fiche client
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default VehiculeDetailPage; 