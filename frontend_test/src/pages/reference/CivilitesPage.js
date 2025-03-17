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
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import referenceService from '../../services/referenceService';

const CivilitesPage = () => {
  const [civilites, setCivilites] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCivilite, setCurrentCivilite] = useState({ libelle: '' });
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
    fetchCivilites();
  }, [page, limit]);

  const fetchCivilites = async () => {
    try {
      setLoading(true);
      const response = await referenceService.getCivilites(page, limit);
      setCivilites(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des civilités:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des civilités',
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

  const handleOpenDialog = (civilite = null) => {
    if (civilite) {
      setCurrentCivilite(civilite);
      setIsEditing(true);
    } else {
      setCurrentCivilite({ libelle: '' });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCivilite(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentCivilite.libelle.trim()) {
        setSnackbar({
          open: true,
          message: 'Le libellé est requis',
          severity: 'error'
        });
        return;
      }

      if (isEditing) {
        await referenceService.updateCivilite(currentCivilite.id, currentCivilite);
        setSnackbar({
          open: true,
          message: 'Civilité mise à jour avec succès',
          severity: 'success'
        });
      } else {
        await referenceService.createCivilite(currentCivilite);
        setSnackbar({
          open: true,
          message: 'Civilité ajoutée avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      fetchCivilites();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la civilité:', error);
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
      await referenceService.deleteCivilite(deleteConfirmDialog.id);
      setSnackbar({
        open: true,
        message: 'Civilité supprimée avec succès',
        severity: 'success'
      });
      fetchCivilites();
    } catch (error) {
      console.error('Erreur lors de la suppression de la civilité:', error);
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

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des Civilités
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Ajoutez, modifiez ou supprimez les civilités utilisées dans l'application.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter une civilité
          </Button>
        </Box>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Libellé</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Chargement des civilités...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : civilites.length > 0 ? (
                  civilites.map((civilite) => (
                    <TableRow key={civilite.id} hover>
                      <TableCell>{civilite.id}</TableCell>
                      <TableCell>{civilite.libelle}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDialog(civilite)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleOpenDeleteConfirm(civilite.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Aucune civilité trouvée
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
        <DialogTitle>{isEditing ? 'Modifier la civilité' : 'Ajouter une civilité'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="libelle"
            label="Libellé"
            type="text"
            fullWidth
            value={currentCivilite.libelle}
            onChange={handleInputChange}
            variant="outlined"
            required
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
            Êtes-vous sûr de vouloir supprimer cette civilité ? Cette action est irréversible.
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

export default CivilitesPage; 