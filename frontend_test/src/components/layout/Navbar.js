import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Menu, 
  MenuItem, 
  IconButton,
  ListItemIcon,
  ListItemText,
  Box,
  Drawer,
  List,
  ListItem,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventIcon from '@mui/icons-material/Event';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import CategoryIcon from '@mui/icons-material/Category';
import BadgeIcon from '@mui/icons-material/Badge';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const referenceItems = [
    { text: 'Civilités', icon: <PersonIcon />, path: '/civilites' },
    { text: 'Énergies', icon: <LocalGasStationIcon />, path: '/energies' },
    { text: 'Événements', icon: <EventIcon />, path: '/evenements' },
    { text: 'Marques', icon: <BrandingWatermarkIcon />, path: '/marques' },
    { text: 'Modèles', icon: <CategoryIcon />, path: '/modeles' },
    { text: 'Vendeurs', icon: <BadgeIcon />, path: '/vendeurs' },
  ];

  const mainItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Véhicules', icon: <DirectionsCarIcon />, path: '/vehicules' },
    { text: 'Clients', icon: <PeopleIcon />, path: '/clients' },
    { text: 'Ventes', icon: <ReceiptIcon />, path: '/ventes' },
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <DirectionsCarIcon />
        </Avatar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Gestion Parc Auto
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 1 }} />
      <List>
        {mainItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{ 
              bgcolor: isActive(item.path) ? 'rgba(63, 140, 255, 0.12)' : 'transparent',
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              borderLeft: isActive(item.path) ? '4px solid' : '4px solid transparent',
              borderColor: isActive(item.path) ? 'primary.main' : 'transparent',
              pl: isActive(item.path) ? 2 : 3,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <Typography variant="subtitle2" color="text.secondary" sx={{ px: 3, py: 1 }}>
        Références
      </Typography>
      <List>
        {referenceItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{ 
              bgcolor: isActive(item.path) ? 'rgba(63, 140, 255, 0.12)' : 'transparent',
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              borderLeft: isActive(item.path) ? '4px solid' : '4px solid transparent',
              borderColor: isActive(item.path) ? 'primary.main' : 'transparent',
              pl: isActive(item.path) ? 2 : 3,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5 }}>
            {/* Version mobile */}
            {isMobile ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 1.5,
                      width: 36,
                      height: 36,
                      boxShadow: '0 2px 10px rgba(63, 81, 181, 0.3)',
                    }}
                  >
                    <DirectionsCarIcon fontSize="small" />
                  </Avatar>
                  <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                      fontWeight: 700,
                      color: 'white',
                      textDecoration: 'none',
                      letterSpacing: '.1rem',
                    }}
                  >
                    GESTION AUTO
                  </Typography>
                </Box>
              </>
            ) : (
              /* Version desktop */
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      mr: 1.5,
                      width: 40,
                      height: 40,
                      boxShadow: '0 2px 10px rgba(63, 81, 181, 0.3)',
                    }}
                  >
                    <DirectionsCarIcon />
                  </Avatar>
                  <Typography
                    variant="h5"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                      fontWeight: 700,
                      color: 'white',
                      textDecoration: 'none',
                      letterSpacing: '.1rem',
                    }}
                  >
                    GESTION AUTO
                  </Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                  {mainItems.map((item) => (
                    <Button
                      key={item.text}
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        my: 2,
                        mx: 0.5,
                        color: 'white',
                        display: 'flex',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                  
                  <Button
                    id="reference-button"
                    aria-controls={open ? 'reference-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    endIcon={<ExpandMoreIcon />}
                    sx={{
                      my: 2,
                      mx: 0.5,
                      color: 'white',
                      display: 'flex',
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Références
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Menu déroulant pour les références */}
      <Menu
        id="reference-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'reference-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            minWidth: 220,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {referenceItems.map((item) => (
          <MenuItem 
            key={item.text} 
            onClick={handleClose}
            component={Link}
            to={item.path}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              my: 0.5,
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(63, 81, 181, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(63, 81, 181, 0.25)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Menu>

      {/* Drawer pour mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            backgroundColor: 'background.paper',
            backgroundImage: 'linear-gradient(rgba(30, 30, 30, 0.7), rgba(18, 18, 18, 0.95))',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 