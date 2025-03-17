import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  Tooltip,
  Fade,
  useMediaQuery,
  useTheme,
  Divider,
  InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import referenceService from '../../services/referenceService';

const EnergiesPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [energies, setEnergies] = useState([]);
  const [filteredEnergies, setFilteredEnergies] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEnergie, setCurrentEnergie] = useState({ libelle: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    id: null
  });

  useEffect(() => {
    fetchEnergies();
  }, [page, limit]);
  
  useEffect(() => {
    if (energies.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredEnergies(energies);
      } else {
        const filtered = energies.filter(energie => 
          energie.libelle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEnergies(filtered);
      }
    } else {
      setFilteredEnergies([]);
    }
  }, [searchTerm, energies]);

  const fetchEnergies = async () => {
    try {
      setLoading(true);
      console.log('Début de la récupération des énergies...');
      const response = await referenceService.getEnergies(page, limit);
      console.log('Données reçues dans EnergiesPage:', response);
      
      if (response && response.items) {
        console.log('Nombre d\'énergies reçues:', response.items.length);
        setEnergies(response.items);
        setFilteredEnergies(response.items);
        setTotal(response.total || 0);
      } else {
        console.error('Réponse invalide:', response);
        setEnergies([]);
        setFilteredEnergies([]);
        setTotal(0);
        setSnackbar({
          open: true,
          message: 'Format de réponse invalide',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des énergies:', error);
      setEnergies([]);
      setFilteredEnergies([]);
      setTotal(0);
      setSnackbar({
        open: true,
        message: `Erreur lors du chargement des énergies: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (energie = null) => {
    if (energie) {
      setCurrentEnergie(energie);
      setIsEditing(true);
    } else {
      setCurrentEnergie({ libelle: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEnergie(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleSubmit = async () => {
    try {
      if (!currentEnergie.libelle.trim()) {
        setSnackbar({
          open: true,
          message: 'Le libellé est requis',
          severity: 'error'
        });
        return;
      }

      if (isEditing) {
        await referenceService.updateEnergie(currentEnergie.id, currentEnergie);
        setSnackbar({
          open: true,
          message: 'Énergie mise à jour avec succès',
          severity: 'success'
        });
      } else {
        await referenceService.createEnergie(currentEnergie);
        setSnackbar({
          open: true,
          message: 'Énergie ajoutée avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      fetchEnergies();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'énergie:', error);
      setSnackbar({
        open: true,
        message: `Erreur lors de l'enregistrement: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleOpenDeleteConfirm = (id) => {
    setDeleteConfirmDialog({
      open: true,
      id
    });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmDialog({
      open: false,
      id: null
    });
  };

  const handleDelete = async () => {
    try {
      await referenceService.deleteEnergie(deleteConfirmDialog.id);
      setSnackbar({
        open: true,
        message: 'Énergie supprimée avec succès',
        severity: 'success'
      });
      fetchEnergies();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'énergie:', error);
      setSnackbar({
        open: true,
        message: `Erreur lors de la suppression: ${error.message}`,
        severity: 'error'
      });
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Rendu des cartes pour la vue mobile
  const renderMobileCards = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Chargement des énergies...
          </Typography>
        </Box>
      );
    }
    
    if (filteredEnergies.length === 0) {
      return (
        <Card sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Aucune énergie trouvée
            </Typography>
          </CardContent>
        </Card>
      );
    }
    
    return filteredEnergies.map((energie) => (
      <Fade in={true} key={energie.id} timeout={300}>
        <Card sx={{ 
          mb: 2, 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transform: 'translateY(-2px)'
          }
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Chip 
                icon={<LocalGasStationIcon />} 
                label={energie.libelle} 
                color="primary" 
                variant="outlined" 
                sx={{ fontWeight: 'bold' }}
              />
              <Typography variant="caption" color="text.secondary">
                ID: {energie.id}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Tooltip title="Modifier">
                <IconButton 
                  color="primary" 
                  size="small" 
                  onClick={() => handleOpenDialog(energie)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer">
                <IconButton 
                  color="error" 
                  size="small" 
                  onClick={() => handleOpenDeleteConfirm(energie.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    ));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  bgcolor: 'rgba(63, 140, 255, 0.15)',
                  borderRadius: '50%',
                  p: 1.5,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(63, 140, 255, 0.2)'
                }}
              >
                <LocalGasStationIcon sx={{ 
                  fontSize: { xs: 32, md: 40 }, 
                  color: 'primary.main',
                }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="500">
                  Gestion des Énergies
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Ajoutez, modifiez ou supprimez les types d'énergie utilisés pour les véhicules.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 2, md: 0 } }}>
              <TextField
                placeholder="Rechercher une énergie..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{ 
                  mr: 2,
                  width: { xs: '100%', sm: '250px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '&.Mui-focused': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 12px rgba(63, 140, 255, 0.2)',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(63, 140, 255, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                {isMobile ? 'Ajouter' : 'Ajouter une énergie'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {isMobile ? (
          // Vue mobile avec des cartes
          <Box sx={{ mt: 2 }}>
            {renderMobileCards()}
            
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Par page:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
              sx={{ 
                mt: 2,
                '.MuiTablePagination-toolbar': {
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                },
                '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
                  margin: '8px 0',
                }
              }}
            />
          </Box>
        ) : (
          // Vue desktop avec tableau
          <Paper elevation={0} sx={{ 
            borderRadius: 2, 
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
            }
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="10%" sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell width="70%" sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', fontWeight: 'bold' }}>Libellé</TableCell>
                    <TableCell width="20%" align="right" sx={{ bgcolor: 'rgba(0, 0, 0, 0.2)', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={40} color="primary" />
                        <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                          Chargement des énergies...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredEnergies.length > 0 ? (
                    filteredEnergies.map((energie) => (
                      <TableRow 
                        key={energie.id} 
                        hover
                        sx={{
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: 'rgba(63, 140, 255, 0.05) !important',
                          }
                        }}
                      >
                        <TableCell>
                          <Chip 
                            label={energie.id} 
                            size="small" 
                            sx={{ 
                              bgcolor: 'rgba(63, 140, 255, 0.1)', 
                              color: 'primary.main',
                              fontWeight: 'bold',
                              minWidth: '36px'
                            }} 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                bgcolor: 'rgba(63, 140, 255, 0.1)',
                                borderRadius: '50%',
                                p: 0.8,
                                mr: 1.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <LocalGasStationIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {energie.libelle}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Modifier">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleOpenDialog(energie)}
                              sx={{ 
                                mr: 1,
                                bgcolor: 'rgba(63, 140, 255, 0.1)',
                                '&:hover': {
                                  bgcolor: 'rgba(63, 140, 255, 0.2)',
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleOpenDeleteConfirm(energie.id)}
                              sx={{ 
                                bgcolor: 'rgba(244, 67, 54, 0.1)',
                                '&:hover': {
                                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <LocalGasStationIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                          <Typography variant="body1" color="text.secondary">
                            Aucune énergie trouvée
                          </Typography>
                          <Button 
                            variant="outlined" 
                            color="primary" 
                            startIcon={<AddIcon />} 
                            onClick={() => handleOpenDialog()}
                            sx={{ mt: 2 }}
                          >
                            Ajouter une énergie
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              px: 2,
              py: 1,
              bgcolor: 'rgba(0, 0, 0, 0.1)'
            }}>
              <Typography variant="body2" color="text.secondary">
                {total} {total > 1 ? 'énergies trouvées' : 'énergie trouvée'}
              </Typography>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Lignes par page:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                sx={{
                  '.MuiTablePagination-toolbar': {
                    pl: 0,
                  },
                  '.MuiTablePagination-selectLabel': {
                    m: 0,
                  },
                  '.MuiTablePagination-displayedRows': {
                    m: 0,
                  }
                }}
              />
            </Box>
          </Paper>
        )}
      </Box>

      {/* Dialogue d'ajout/modification */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 1,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <Box
            sx={{
              bgcolor: 'rgba(63, 140, 255, 0.1)',
              borderRadius: '50%',
              p: 1,
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LocalGasStationIcon sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="h6">
            {isEditing ? 'Modifier l\'énergie' : 'Ajouter une énergie'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            name="libelle"
            label="Libellé"
            type="text"
            fullWidth
            value={currentEnergie.libelle}
            onChange={handleInputChange}
            variant="outlined"
            required
            sx={{ 
              mt: 1,
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
                '&.Mui-focused': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Le libellé doit être unique">
                    <InfoIcon fontSize="small" color="action" />
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
          {isEditing && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', p: 1, bgcolor: 'rgba(0, 0, 0, 0.1)', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                ID: 
              </Typography>
              <Chip 
                label={currentEnergie.id} 
                size="small" 
                sx={{ 
                  bgcolor: 'rgba(63, 140, 255, 0.1)', 
                  color: 'primary.main',
                  fontWeight: 'bold'
                }} 
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              boxShadow: '0 4px 12px rgba(63, 140, 255, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(63, 140, 255, 0.3)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            {isEditing ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog 
        open={deleteConfirmDialog.open} 
        onClose={handleCloseDeleteConfirm}
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 2,
            bgcolor: 'background.paper',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }
        }}
      >
        <DialogTitle sx={{ color: 'error.main', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Box
            sx={{
              bgcolor: 'rgba(244, 67, 54, 0.1)',
              borderRadius: '50%',
              p: 1,
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <DeleteIcon sx={{ color: 'error.main' }} />
          </Box>
          <Typography variant="h6">
            Confirmer la suppression
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer cette énergie ? Cette action est irréversible.
          </Typography>
          <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(244, 67, 54, 0.05)', borderRadius: 2, border: '1px solid rgba(244, 67, 54, 0.1)' }}>
            <Typography variant="body2" color="error.light" sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon fontSize="small" sx={{ mr: 1 }} />
              Les véhicules associés à cette énergie pourraient être affectés.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2 }}>
          <Button 
            onClick={handleCloseDeleteConfirm} 
            color="inherit"
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              }
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(244, 67, 54, 0.3)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 2 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%', 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            '& .MuiAlert-icon': {
              fontSize: '1.2rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EnergiesPage; 