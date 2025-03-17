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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EventIcon from '@mui/icons-material/Event';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import referenceService from '../../services/referenceService';
import { format } from 'date-fns';

const EvenementsPage = () => {
  const [evenements, setEvenements] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEvenement, setCurrentEvenement] = useState({ 
    nom: '', 
    description: '', 
    dateDebut: null, 
    dateFin: null, 
    lieu: '' 
  });
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
    fetchEvenements();
  }, [page, limit]);

  const fetchEvenements = async () => {
    try {
      setLoading(true);
      const response = await referenceService.getEvenements(page, limit);
      setEvenements(response.items || []);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des événements',
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

  const handleOpenDialog = (evenement = null) => {
    if (evenement) {
      // Convertir les dates en objets Date si elles sont des chaînes
      const dateDebut = evenement.dateDebut ? new Date(evenement.dateDebut) : null;
      const dateFin = evenement.dateFin ? new Date(evenement.dateFin) : null;
      
      setCurrentEvenement({
        ...evenement,
        dateDebut,
        dateFin
      });
      setIsEditing(true);
    } else {
      setCurrentEvenement({ 
        nom: '', 
        description: '', 
        dateDebut: null, 
        dateFin: null, 
        lieu: '' 
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvenement(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setCurrentEvenement(prev => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentEvenement.nom.trim()) {
        setSnackbar({
          open: true,
          message: 'Le nom est requis',
          severity: 'error'
        });
        return;
      }

      // Vérifier que la date de fin est après la date de début
      if (currentEvenement.dateDebut && currentEvenement.dateFin && 
          new Date(currentEvenement.dateDebut) > new Date(currentEvenement.dateFin)) {
        setSnackbar({
          open: true,
          message: 'La date de fin doit être après la date de début',
          severity: 'error'
        });
        return;
      }

      if (isEditing) {
        await referenceService.updateEvenement(currentEvenement.id, currentEvenement);
        setSnackbar({
          open: true,
          message: 'Événement mis à jour avec succès',
          severity: 'success'
        });
      } else {
        await referenceService.createEvenement(currentEvenement);
        setSnackbar({
          open: true,
          message: 'Événement ajouté avec succès',
          severity: 'success'
        });
      }
      
      handleCloseDialog();
      fetchEvenements();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'événement:', error);
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
      await referenceService.deleteEvenement(deleteConfirmDialog.id);
      setSnackbar({
        open: true,
        message: 'Événement supprimé avec succès',
        severity: 'success'
      });
      fetchEvenements();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
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

  // Fonction pour formater les dates
  const formatDate = (date) => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return '-';
    }
  };

  // Fonction pour déterminer le statut de l'événement
  const getEventStatus = (evenement) => {
    if (!evenement.dateDebut || !evenement.dateFin) return 'inconnu';
    
    const now = new Date();
    const debut = new Date(evenement.dateDebut);
    const fin = new Date(evenement.dateFin);
    
    if (now < debut) return 'à venir';
    if (now > fin) return 'terminé';
    return 'en cours';
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'à venir': return 'info';
      case 'en cours': return 'success';
      case 'terminé': return 'default';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ mr: 1, fontSize: 35 }} />
          Gestion des Événements
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Ajoutez, modifiez ou supprimez les événements.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter un événement
          </Button>
        </Box>

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Lieu</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={40} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Chargement des événements...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : evenements.length > 0 ? (
                  evenements.map((evenement) => {
                    const status = getEventStatus(evenement);
                    return (
                      <TableRow key={evenement.id} hover>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            {evenement.nom}
                          </Typography>
                          {evenement.description && (
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                              {evenement.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{evenement.lieu || '-'}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              Début: {formatDate(evenement.dateDebut)}
                            </Typography>
                            <Typography variant="body2">
                              Fin: {formatDate(evenement.dateFin)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={status} 
                            size="small" 
                            color={getStatusColor(status)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleOpenDialog(evenement)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleOpenDeleteConfirm(evenement.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Aucun événement trouvé
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
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? 'Modifier l\'événement' : 'Ajouter un événement'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="nom"
              label="Nom de l'événement"
              type="text"
              fullWidth
              value={currentEvenement.nom}
              onChange={handleInputChange}
              variant="outlined"
              required
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={currentEvenement.description || ''}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <TextField
              margin="dense"
              name="lieu"
              label="Lieu"
              type="text"
              fullWidth
              value={currentEvenement.lieu || ''}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Date de début"
                value={currentEvenement.dateDebut}
                onChange={(date) => handleDateChange('dateDebut', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense"
                  }
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Date de fin"
                value={currentEvenement.dateFin}
                onChange={(date) => handleDateChange('dateFin', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense"
                  }
                }}
                minDate={currentEvenement.dateDebut}
              />
            </Box>
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
      </LocalizationProvider>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={deleteConfirmDialog.open} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.
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

export default EvenementsPage; 