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
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BadgeIcon from '@mui/icons-material/Badge';
import referenceService from '../../services/referenceService';

const VendeursPage = () => {
  const [vendeurs, setVendeurs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentVendeur, setCurrentVendeur] = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [isEditing, setIsEditing] = useState(false);
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
    fetchVendeurs();
  }, [page, limit]);

  const fetchVendeurs = async () => {
    try {
      setLoading(true);
      const response = await referenceService.getVendeurs(page, limit);
      setVendeurs(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des vendeurs:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des vendeurs',
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

  const handleOpenDialog = (vendeur = null) => {
    if (vendeur) {
      setCurrentVendeur(vendeur);
      setIsEditing(true);
    } else {
      setCurrentVendeur({ nom: '', prenom: '', email: '', telephone: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentVendeur(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentVendeur.nom.trim()) {
        setSnackbar({
          open: true,
          message: 'Le nom est requis',
          severity: 'error'
        });
        return;
      }

      if (isEditing) {
        await referenceService.updateVendeur(currentVendeur.id, currentVendeur);
        setSnackbar({
          open: true,
          message: 'Vendeur mis à jour avec succès',
          severity: 'success'
        });
      } else {
        await referenceService.createVendeur(currentVendeur);
        setSnackbar({
          open: true,
          message: 'Vendeur ajouté avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      fetchVendeurs();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du vendeur:', error);
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
      await referenceService.deleteVendeur(deleteConfirmDialog.id);
      setSnackbar({
        open: true,
        message: 'Vendeur supprimé avec succès',
        severity: 'success'
      });
      fetchVendeurs();
    } catch (error) {
      console.error('Erreur lors de la suppression du vendeur:', error);
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

  // Fonction pour obtenir les initiales du vendeur
  const getInitials = (vendeur) => {
    if (!vendeur) return '';
    return `${vendeur.prenom?.charAt(0) || ''}${vendeur.nom?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <BadgeIcon sx={{ mr: 1, fontSize: 35 }} />
          Gestion des Vendeurs
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Ajoutez, modifiez ou supprimez les vendeurs.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un vendeur
          </Button>
        </Box>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Chargement des vendeurs...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : vendeurs.length > 0 ? (
                  vendeurs.map((vendeur) => (
                    <TableRow key={vendeur.id} hover>
                      <TableCell>{vendeur.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              width: 30, 
                              height: 30, 
                              mr: 1, 
                              bgcolor: '#1976d2',
                              fontSize: '0.875rem'
                            }}
                          >
                            {getInitials(vendeur)}
                          </Avatar>
                          {vendeur.nom}
                        </Box>
                      </TableCell>
                      <TableCell>{vendeur.prenom || '-'}</TableCell>
                      <TableCell>
                        <Box>
                          {vendeur.email && (
                            <Typography variant="body2" color="text.secondary">
                              {vendeur.email}
                            </Typography>
                          )}
                          {vendeur.telephone && (
                            <Typography variant="body2" color="text.secondary">
                              {vendeur.telephone}
                            </Typography>
                          )}
                          {!vendeur.email && !vendeur.telephone && '-'}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDialog(vendeur)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteConfirm(vendeur.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucun vendeur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
          />
        </Paper>
      </Box>

      {/* Dialogue d'ajout/modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Modifier le vendeur' : 'Ajouter un vendeur'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="nom"
            label="Nom"
            type="text"
            fullWidth
            value={currentVendeur.nom}
            onChange={handleInputChange}
            variant="outlined"
            required
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            name="prenom"
            label="Prénom"
            type="text"
            fullWidth
            value={currentVendeur.prenom || ''}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={currentVendeur.email || ''}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            name="telephone"
            label="Téléphone"
            type="tel"
            fullWidth
            value={currentVendeur.telephone || ''}
            onChange={handleInputChange}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {isEditing ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteConfirmDialog.open} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer ce vendeur ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
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
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VendeursPage; 