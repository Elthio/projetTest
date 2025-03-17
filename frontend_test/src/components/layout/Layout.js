import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, useMediaQuery, useTheme, Fab, Zoom, Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Gérer l'affichage du bouton de retour en haut
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
        backgroundImage: 'radial-gradient(circle at 50% 14em, #1e1e1e 0%, #121212 100%)',
        backgroundAttachment: 'fixed',
      }}
    >
      <CssBaseline />
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 3, md: 5 },
          px: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 2, md: 3 },
          transition: 'all 0.3s ease',
          maxWidth: '1400px',
          width: '100%',
          mx: 'auto',
        }}
        className="fade-in"
      >
        <Box
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            bgcolor: 'background.paper',
            p: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />

      {/* Bouton de retour en haut */}
      <Zoom in={showScrollTop}>
        <Tooltip title="Retour en haut" placement="left">
          <Fab
            color="primary"
            size={isMobile ? "small" : "medium"}
            aria-label="retour en haut"
            onClick={scrollToTop}
            sx={{
              position: 'fixed',
              bottom: { xs: 16, md: 30 },
              right: { xs: 16, md: 30 },
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </Tooltip>
      </Zoom>
    </Box>
  );
};

export default Layout; 