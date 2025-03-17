import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Grow,
  Fade,
  LinearProgress,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventIcon from '@mui/icons-material/Event';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import CategoryIcon from '@mui/icons-material/Category';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import SettingsIcon from '@mui/icons-material/Settings';
import vehiculeService from '../services/vehiculeService';
import clientService from '../services/clientService';
import venteService from '../services/venteService';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalVehicules: 0,
    totalClients: 0,
    totalVentes: 0,
    ventesRecentes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Actions rapides pour le SpeedDial
  const actions = [
    { icon: <DirectionsCarIcon />, name: 'Ajouter un véhicule', path: '/vehicules/new' },
    { icon: <PersonAddIcon />, name: 'Ajouter un client', path: '/clients/new' },
    { icon: <ReceiptIcon />, name: 'Créer une vente', path: '/ventes/new' },
    { icon: <SearchIcon />, name: 'Rechercher', path: '/vehicules' },
    { icon: <SettingsIcon />, name: 'Références', path: '/energies' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les données des véhicules
        const vehiculesResponse = await vehiculeService.getVehicules(1, 1);
        const totalVehicules = vehiculesResponse.total || 0;
        
        // Récupérer les données des clients
        const clientsResponse = await clientService.getClients(1, 1);
        const totalClients = clientsResponse.total || 0;
        
        // Récupérer les données des ventes
        const ventesResponse = await venteService.getVentes(1, 5);
        const totalVentes = ventesResponse.total || 0;
        
        // Formater les ventes récentes
        const ventesRecentes = ventesResponse.items.map(vente => {
          // Générer une valeur de progression aléatoire pour l'affichage
          const progression = Math.floor(Math.random() * 100) + 1;
          
          // Formater la date
          const date = new Date(vente.date || Date.now());
          const dateFormatee = date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          // Formater le montant
          const montant = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          }).format(vente.montant || 0);
          
          return {
            id: vente.id,
            date: dateFormatee,
            montant: montant,
            progression: progression,
            type: vente.type || 'VO'
          };
        });
        
        setStats({
          totalVehicules,
          totalClients,
          totalVentes,
          ventesRecentes
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Fade in={true} timeout={1000}>
        <Box sx={{ position: 'relative' }}>
          {/* En-tête avec effet de glassmorphisme */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              mb: 6,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.05), rgba(0, 0, 0, 0.3))',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, rgba(63, 81, 181, 0), rgba(63, 81, 181, 0.5), rgba(63, 81, 181, 0))',
              }
            }}
          >
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #3f51b5, #757de8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Gestion de Parc Automobile
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '800px', 
                  mx: 'auto',
                  mb: 3,
                  opacity: 0.8
                }}
              >
                Plateforme complète pour la gestion de votre parc automobile, vos clients et vos ventes
              </Typography>
            </Box>
          </Paper>

          {/* Affichage de l'erreur si présente */}
          {error && (
            <Paper 
              sx={{ 
                p: 3, 
                mb: 4, 
                bgcolor: 'rgba(244, 67, 54, 0.1)', 
                color: 'error.main',
                border: '1px solid',
                borderColor: 'error.main',
                borderRadius: 2
              }}
            >
              <Typography variant="body1">{error}</Typography>
              <Button 
                variant="outlined" 
                color="error" 
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
            </Paper>
          )}

          {/* Indicateur de chargement */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Chargement des données...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Actions rapides */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 6, 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(245, 0, 87, 0.05), rgba(0, 0, 0, 0.3))',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'hidden',
                  bgcolor: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  Actions rapides
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={2}>
                    <Card 
                      className="card-hover" 
                      component={Link} 
                      to="/vehicules/new"
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                          }}
                        >
                          <DirectionsCarIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="body1" align="center" sx={{ fontWeight: 'medium', mt: 1 }}>
                          Ajouter un véhicule
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={2}>
                    <Card 
                      className="card-hover" 
                      component={Link} 
                      to="/clients/new"
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        <Box
                          sx={{
                            bgcolor: 'secondary.main',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            boxShadow: '0 4px 12px rgba(245, 0, 87, 0.2)',
                          }}
                        >
                          <PersonAddIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="body1" align="center" sx={{ fontWeight: 'medium', mt: 1 }}>
                          Ajouter un client
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={2}>
                    <Card 
                      className="card-hover" 
                      component={Link} 
                      to="/ventes/new"
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        <Box
                          sx={{
                            bgcolor: 'success.main',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                          }}
                        >
                          <ReceiptIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="body1" align="center" sx={{ fontWeight: 'medium', mt: 1 }}>
                          Créer une vente
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={2}>
                    <Card 
                      className="card-hover" 
                      component={Link} 
                      to="/vehicules"
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        <Box
                          sx={{
                            bgcolor: 'info.main',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                          }}
                        >
                          <SearchIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="body1" align="center" sx={{ fontWeight: 'medium', mt: 1 }}>
                          Rechercher
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={2}>
                    <Card 
                      className="card-hover" 
                      component={Link} 
                      to="/energies"
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        <Box
                          sx={{
                            bgcolor: 'warning.main',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.2)',
                          }}
                        >
                          <LocalGasStationIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="body1" align="center" sx={{ fontWeight: 'medium', mt: 1 }}>
                          Énergies
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={6} sm={4} md={2}>
                    <Card 
                      className="card-hover" 
                      component={Link} 
                      to="/marques"
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                        <Box
                          sx={{
                            bgcolor: 'error.main',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
                          }}
                        >
                          <BrandingWatermarkIcon sx={{ color: 'white', fontSize: 30 }} />
                        </Box>
                        <Typography variant="body1" align="center" sx={{ fontWeight: 'medium', mt: 1 }}>
                          Marques
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>

              {/* Statistiques principales */}
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <Grow in={true} timeout={1000}>
                    <Card className="card-hover" sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              bgcolor: 'primary.main',
                              borderRadius: '50%',
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                            }}
                          >
                            <DirectionsCarIcon sx={{ color: 'white', fontSize: 28 }} />
                          </Box>
                          <Typography variant="h5" component="div">
                            {stats.totalVehicules}
                          </Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Véhicules
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nombre total de véhicules dans votre parc automobile
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                        <Button 
                          component={Link} 
                          to="/vehicules" 
                          size="small" 
                          endIcon={<ArrowForwardIcon />}
                        >
                          Voir tous les véhicules
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Grow in={true} timeout={1500}>
                    <Card className="card-hover" sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              bgcolor: 'secondary.main',
                              borderRadius: '50%',
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              boxShadow: '0 4px 12px rgba(245, 0, 87, 0.2)',
                            }}
                          >
                            <PeopleIcon sx={{ color: 'white', fontSize: 28 }} />
                          </Box>
                          <Typography variant="h5" component="div">
                            {stats.totalClients}
                          </Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Clients
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nombre total de clients enregistrés dans le système
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                        <Button 
                          component={Link} 
                          to="/clients" 
                          size="small" 
                          endIcon={<ArrowForwardIcon />}
                        >
                          Voir tous les clients
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Grow in={true} timeout={2000}>
                    <Card className="card-hover" sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              bgcolor: 'success.main',
                              borderRadius: '50%',
                              width: 48,
                              height: 48,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 2,
                              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                            }}
                          >
                            <ReceiptIcon sx={{ color: 'white', fontSize: 28 }} />
                          </Box>
                          <Typography variant="h5" component="div">
                            {stats.totalVentes}
                          </Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                          Ventes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Nombre total de ventes réalisées
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                        <Button 
                          component={Link} 
                          to="/ventes" 
                          size="small" 
                          endIcon={<ArrowForwardIcon />}
                        >
                          Voir toutes les ventes
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              </Grid>

              {/* Ventes récentes */}
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Ventes récentes
              </Typography>
              <Grid container spacing={3} sx={{ mb: 6 }}>
                {stats.ventesRecentes.length > 0 ? (
                  stats.ventesRecentes.map((vente, index) => (
                    <Grid item xs={12} sm={6} md={4} key={vente.id}>
                      <Grow in={true} timeout={1000 + (index * 500)}>
                        <Card className="card-hover">
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" component="div">
                                Vente #{vente.id}
                              </Typography>
                              <Chip 
                                label={vente.type} 
                                color={vente.type === 'VN' ? 'primary' : 'secondary'} 
                                size="small" 
                              />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Date: {vente.date}
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                                {vente.montant}
                              </Typography>
                            </Box>
                            <Box sx={{ width: '100%', mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Progression
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {vente.progression}%
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={vente.progression} 
                                sx={{ 
                                  height: 6, 
                                  borderRadius: 3,
                                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 3,
                                  }
                                }} 
                              />
                            </Box>
                          </CardContent>
                          <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                            <Button 
                              component={Link} 
                              to={`/ventes/${vente.id}`} 
                              size="small" 
                              endIcon={<ArrowForwardIcon />}
                            >
                              Voir les détails
                            </Button>
                          </CardActions>
                        </Card>
                      </Grow>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body1">
                        Aucune vente récente à afficher
                      </Typography>
                      <Button 
                        component={Link} 
                        to="/ventes/new" 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 2 }}
                        startIcon={<AddIcon />}
                      >
                        Créer une vente
                      </Button>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </>
          )}
          
          {/* SpeedDial pour actions rapides */}
          <SpeedDial
            ariaLabel="Actions rapides"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                component={Link}
                to={action.path}
              />
            ))}
          </SpeedDial>
        </Box>
      </Fade>
    </Container>
  );
};

export default HomePage; 