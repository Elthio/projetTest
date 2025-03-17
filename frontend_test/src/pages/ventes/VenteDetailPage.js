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
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import EuroIcon from '@mui/icons-material/Euro';
import AssignmentIcon from '@mui/icons-material/Assignment';
import venteService from '../../services/venteService';

const VenteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vente, setVente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchVente = async () => {
      try {
        setLoading(true);
        const venteData = await venteService.getVenteById(id);
        setVente(venteData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement de la vente:', err);
        setError('Impossible de charger les détails de la vente.');
        setLoading(false);
      }
    };
    
    fetchVente();
  }, [id]);
  
  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    
    try {
      setLoading(true);
      await venteService.deleteVente(id);
      navigate('/ventes');
    } catch (err) {
      console.error('Erreur lors de la suppression de la vente:', err);
      setError('Impossible de supprimer la vente.');
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'Non spécifié';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };
  
  const getInitials = (client) => {
    if (!client) return '';
    if (client.compteAffaire) {
      return client.compteAffaire.substring(0, 2).toUpperCase();
    }
    return `${client.prenom?.charAt(0) || ''}${client.nom?.charAt(0) || ''}`.toUpperCase();
  };
  
  const getAvatarColor = (client) => {
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
            to="/ventes"
          >
            Retour à la liste
          </Button>
        </Box>
      </Container>
    );
  }
  
  if (!vente) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Vente non trouvée</Alert>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/ventes"
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
          to="/ventes"
        >
          Retour à la liste
        </Button>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/ventes/${id}/edit`}
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
          <ReceiptIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" component="h1">
              Vente #{vente.numeroDossier || id}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {formatDate(vente.dateAchat)}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {/* Informations générales */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2">
                    Informations générales
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Numéro de dossier
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {vente.numeroDossier || 'Non spécifié'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body1">
                      {vente.typeVnVo === 'VN' ? 'Véhicule Neuf' : 
                       vente.typeVnVo === 'VO' ? 'Véhicule Occasion' : 
                       vente.typeVnVo || 'Non spécifié'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Date d'achat
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(vente.dateAchat)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Date de livraison
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(vente.dateLivraison)}
                    </Typography>
                  </Grid>
                  
                  {vente.commentaire && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Commentaire
                      </Typography>
                      <Typography variant="body1">
                        {vente.commentaire}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Véhicule */}
          {vente.vehicule && (
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DirectionsCarIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                      Véhicule
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {vente.vehicule.marque?.libelle || ''} {vente.vehicule.modele?.libelle || ''} {vente.vehicule.version || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Immatriculation: {vente.vehicule.immatriculation || 'Non spécifiée'}
                    </Typography>
                    {vente.vehicule.vin && (
                      <Typography variant="body2" color="text.secondary">
                        VIN: {vente.vehicule.vin}
                      </Typography>
                    )}
                    {vente.vehicule.dateMiseCirculation && (
                      <Typography variant="body2" color="text.secondary">
                        Mise en circulation: {formatDate(vente.vehicule.dateMiseCirculation)}
                      </Typography>
                    )}
                  </Box>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    component={Link}
                    to={`/vehicules/${vente.vehicule.id}`}
                    startIcon={<DirectionsCarIcon />}
                  >
                    Voir le véhicule
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
          
          {/* Client */}
          {vente.client && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                      Client
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getAvatarColor(vente.client),
                        width: 60,
                        height: 60,
                        mr: 2
                      }}
                    >
                      {getInitials(vente.client)}
                    </Avatar>
                    
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {vente.client.civilite?.libelle || ''} {vente.client.nom || ''} {vente.client.prenom || ''}
                      </Typography>
                      
                      {vente.client.compteAffaire && (
                        <Typography variant="body2" color="text.secondary">
                          {vente.client.compteAffaire}
                        </Typography>
                      )}
                      
                      <Button
                        variant="text"
                        size="small"
                        component={Link}
                        to={`/clients/${vente.client.id}`}
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

export default VenteDetailPage; 