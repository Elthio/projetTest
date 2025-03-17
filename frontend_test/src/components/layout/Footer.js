import React from 'react';
import { Box, Typography, Container, Grid, Link, Divider, IconButton, useTheme, Paper } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';
import GavelIcon from '@mui/icons-material/Gavel';
import InfoIcon from '@mui/icons-material/Info';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 5,
        backgroundColor: 'rgba(18, 18, 18, 0.95)',
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundImage: 'linear-gradient(rgba(30, 30, 30, 0.3), rgba(18, 18, 18, 0.95))',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, rgba(63, 81, 181, 0), rgba(63, 81, 181, 0.5), rgba(63, 81, 181, 0))',
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                  boxShadow: '0 2px 10px rgba(63, 81, 181, 0.3)',
                }}
              >
                <DirectionsCarIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
                Gestion Auto
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
              Solution complète pour la gestion de votre parc automobile. Simplifiez vos opérations et optimisez votre flotte.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex' }}>
              <IconButton 
                size="small" 
                sx={{ 
                  mr: 1, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(63, 81, 181, 0.15)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  }
                }}
                aria-label="facebook"
              >
                <FacebookIcon fontSize="small" color="primary" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  mr: 1, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(63, 81, 181, 0.15)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  }
                }}
                aria-label="twitter"
              >
                <TwitterIcon fontSize="small" color="primary" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  mr: 1, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(63, 81, 181, 0.15)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  }
                }}
                aria-label="linkedin"
              >
                <LinkedInIcon fontSize="small" color="primary" />
              </IconButton>
              <IconButton 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(63, 81, 181, 0.15)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                  }
                }}
                aria-label="instagram"
              >
                <InstagramIcon fontSize="small" color="primary" />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Liens rapides
            </Typography>
            <Link 
              href="/" 
              color="text.secondary" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                mb: 1.5, 
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateX(5px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mr: 1.5,
                  transition: 'all 0.2s ease',
                }}
              />
              Accueil
            </Link>
            <Link 
              href="/vehicules" 
              color="text.secondary" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                mb: 1.5, 
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateX(5px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mr: 1.5,
                  transition: 'all 0.2s ease',
                }}
              />
              Véhicules
            </Link>
            <Link 
              href="/clients" 
              color="text.secondary" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                mb: 1.5, 
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateX(5px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mr: 1.5,
                  transition: 'all 0.2s ease',
                }}
              />
              Clients
            </Link>
            <Link 
              href="/ventes" 
              color="text.secondary" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                mb: 1.5, 
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  transform: 'translateX(5px)',
                }
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mr: 1.5,
                  transition: 'all 0.2s ease',
                }}
              />
              Ventes
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <EmailIcon fontSize="small" color="primary" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                contact@gestionauto.fr
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <PhoneIcon fontSize="small" color="primary" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                +33 (0)1 23 45 67 89
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <LocationOnIcon fontSize="small" color="primary" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                123 Avenue des Champs-Élysées, 75008 Paris
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Informations légales
            </Typography>
            <Link 
              href="#" 
              color="text.secondary" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                mb: 1.5, 
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <InfoIcon fontSize="small" color="primary" />
              </Box>
              À propos
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                mb: 1.5, 
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <GavelIcon fontSize="small" color="primary" />
              </Box>
              Conditions d'utilisation
            </Link>
            <Link 
              href="#" 
              color="text.secondary" 
              display="flex" 
              alignItems="center" 
              sx={{ 
                mb: 1.5, 
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                }
              }}
            >
              <Box
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 1.5,
                }}
              >
                <SecurityIcon fontSize="small" color="primary" />
              </Box>
              Politique de confidentialité
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.05)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Gestion Auto. Tous droits réservés.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 