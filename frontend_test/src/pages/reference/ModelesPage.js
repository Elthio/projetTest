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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CategoryIcon from '@mui/icons-material/Category';
import referenceService from '../../services/referenceService';

const ModelesPage = () => {
  const [modeles, setModeles] = useState([]);
  const [marques, setMarques] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMarques, setLoadingMarques] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentModele, setCurrentModele] = useState({ libelle: '', marque: '' });
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
    fetchModeles();
    fetchMarques();
  }, [page, limit]);

  const fetchModeles = async () => {
    try {
      setLoading(true);
      const response = await referenceService.getModeles(page, limit);
      setModeles(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des modèles:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des modèles',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMarques = async () => {
    try {
      setLoadingMarques(true);
      const response = await referenceService.getMarques(0, 100);
      setMarques(response.items || []);
    } catch (error) {
      console.error('Erreur lors du chargement des marques:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des marques',
        severity: 'error'
      });
    } finally {
      setLoadingMarques(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (modele = null) => {
    if (modele) {
      setCurrentModele({
        ...modele,
        marque: modele.marque ? modele.marque['@id'] || modele.marque.id : ''
      });
      setIsEditing(true);
    } else {
      setCurrentModele({ libelle: '', marque: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentModele(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentModele.libelle.trim()) {
        setSnackbar({
          open: true,
          message: 'Le libellé est requis',
          severity: 'error'
        });
        return;
      }

      if (!currentModele.marque) {
        setSnackbar({
          open: true,
          message: 'La marque est requise',
          severity: 'error'
        });
        return;
      }

      const modeleData = {
        ...currentModele,
        marque: currentModele.marque
      };

      if (isEditing) {
        await referenceService.updateModele(currentModele.id, modeleData);
        setSnackbar({
          open: true,
          message: 'Modèle mis à jour avec succès',
          severity: 'success'
        });
      } else {
        await referenceService.createModele(modeleData);
        setSnackbar({
          open: true,
          message: 'Modèle ajouté avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      fetchModeles();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du modèle:', error);
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
      await referenceService.deleteModele(deleteConfirmDialog.id);
      setSnackbar({
        open: true,
        message: 'Modèle supprimé avec succès',
        severity: 'success'
      });
      fetchModeles();
    } catch (error) {
      console.error('Erreur lors de la suppression du modèle:', error);
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

  // Fonction pour obtenir le libellé de la marque à partir de l'ID ou de l'IRI
  const getMarqueLibelle = (marqueId) => {
    if (!marqueId) return '-';
    
    // Si c'est un IRI (ex: /api/marques/1)
    if (typeof marqueId === 'string' && marqueId.startsWith('/api/marques/')) {
      const id = marqueId.split('/').pop();
      const marque = marques.find(m => m.id === parseInt(id));
      return marque ? marque.libelle : '-';
    }
    
    // Si c'est un objet avec un libellé
    if (marqueId.libelle) {
      return marqueId.libelle;
    }
    
    // Si c'est un ID numérique
    const marque = marques.find(m => m.id === marqueId);
    return marque ? marque.libelle : '-';
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CategoryIcon sx={{ mr: 1, fontSize: 35 }} />
          Gestion des Modèles
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Ajoutez, modifiez ou supprimez les modèles de véhicules.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={marques.length === 0}
          >
            Ajouter un modèle
          </Button>
        </Box>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Libellé</TableCell>
                  <TableCell>Marque</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Chargement des modèles...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : modeles.length > 0 ? (
                  modeles.map((modele) => (
                    <TableRow key={modele.id} hover>
                      <TableCell>{modele.id}</TableCell>
                      <TableCell>{modele.libelle}</TableCell>
                      <TableCell>{getMarqueLibelle(modele.marque)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDialog(modele)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteConfirm(modele.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Aucun modèle trouvé
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
        <DialogTitle>{isEditing ? 'Modifier le modèle' : 'Ajouter un modèle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="libelle"
            label="Libellé"
            type="text"
            fullWidth
            value={currentModele.libelle}
            onChange={handleInputChange}
            variant="outlined"
            required
            sx={{ mt: 2, mb: 2 }}
          />
          <FormControl fullWidth required>
            <InputLabel id="marque-label">Marque</InputLabel>
            <Select
              labelId="marque-label"
              id="marque"
              name="marque"
              value={currentModele.marque}
              onChange={handleInputChange}
              label="Marque"
            >
              {loadingMarques ? (
                <MenuItem disabled>Chargement des marques...</MenuItem>
              ) : marques.length > 0 ? (
                marques.map((marque) => (
                  <MenuItem key={marque.id} value={marque['@id'] || `/api/marques/${marque.id}`}>
                    {marque.libelle}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucune marque disponible</MenuItem>
              )}
            </Select>
          </FormControl>
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
            Êtes-vous sûr de vouloir supprimer ce modèle ? Cette action est irréversible.
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

export default ModelesPage; 