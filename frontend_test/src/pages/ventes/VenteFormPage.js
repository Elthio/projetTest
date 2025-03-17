import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Autocomplete
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from 'date-fns/locale/fr';
import venteService from '../../services/venteService';
import clientService from '../../services/clientService';
import vehiculeService from '../../services/vehiculeService';

const VenteFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  
  // Récupérer les paramètres de l'URL
  const queryParams = new URLSearchParams(location.search);
  const preselectedClientId = queryParams.get('clientId');
  const preselectedVehiculeId = queryParams.get('vehiculeId');
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    reference: '',
    dateVente: new Date(),
    prixVente: '',
    commentaire: '',
    clientId: preselectedClientId || '',
    vehiculeId: preselectedVehiculeId || ''
  });
  
  // États pour les options des listes déroulantes
  const [clients, setClients] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [vehiculesFiltered, setVehiculesFiltered] = useState([]);
  
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Chargement des options pour les listes déroulantes
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        console.log('Début du chargement des options...');
        
        // Chargement des clients avec une limite plus élevée
        console.log('Chargement des clients...');
        const clientsResponse = await clientService.getClients(1, 1000, {
          sortBy: 'nom',
          sortOrder: 'ASC'
        });
        console.log('Clients chargés:', clientsResponse.data.content.length);
        setClients(clientsResponse.data.content);
        
        // Chargement des véhicules disponibles avec une limite plus élevée
        console.log('Chargement des véhicules...');
        const vehiculesResponse = await vehiculeService.getVehicules(1, 1000, {
          sortBy: 'marque.libelle',
          sortOrder: 'ASC'
        });
        console.log('Véhicules chargés:', vehiculesResponse.data.content.length);
        setVehicules(vehiculesResponse.data.content);
        
        setLoadingOptions(false);
        console.log('Chargement des options terminé avec succès');
      } catch (err) {
        console.error('Erreur détaillée lors du chargement des options:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
        setError(`Impossible de charger les options du formulaire: ${errorMessage}`);
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  // Filtrer les véhicules en fonction du client sélectionné
  useEffect(() => {
    if (formData.clientId) {
      // Si un client est sélectionné, filtrer les véhicules qui lui appartiennent
      const filtered = vehicules.filter(vehicule => 
        vehicule.client && vehicule.client.id === parseInt(formData.clientId)
      );
      setVehiculesFiltered(filtered);
    } else {
      // Si aucun client n'est sélectionné, afficher tous les véhicules
      setVehiculesFiltered(vehicules);
    }
  }, [formData.clientId, vehicules]);
  
  // Chargement des données de la vente en mode édition
  useEffect(() => {
    if (isEditMode) {
      const fetchVente = async () => {
        try {
          setLoading(true);
          const response = await venteService.getVenteById(id);
          const vente = response.data;
          
          setFormData({
            reference: vente.reference || '',
            dateVente: vente.dateVente ? new Date(vente.dateVente) : new Date(),
            prixVente: vente.prixVente || '',
            commentaire: vente.commentaire || '',
            clientId: vente.client?.id || '',
            vehiculeId: vente.vehicule?.id || ''
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement de la vente:', err);
          setError('Impossible de charger les données de la vente.');
          setLoading(false);
        }
      };
      
      fetchVente();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dateVente: date }));
  };
  
  const handleClientChange = (event) => {
    const clientId = event.target.value;
    setFormData(prev => ({ 
      ...prev, 
      clientId,
      // Réinitialiser le véhicule si le client change
      vehiculeId: ''
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Préparer les données pour l'API
      const venteData = {
        ...formData,
        client: formData.clientId ? { id: formData.clientId } : null,
        vehicule: formData.vehiculeId ? { id: formData.vehiculeId } : null
      };
      
      // Supprimer les propriétés qui ne sont pas nécessaires pour l'API
      delete venteData.clientId;
      delete venteData.vehiculeId;
      
      if (isEditMode) {
        await venteService.updateVente(id, venteData);
      } else {
        await venteService.createVente(venteData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Rediriger après un court délai
      setTimeout(() => {
        navigate('/ventes');
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la vente:', err);
      setError('Impossible d\'enregistrer la vente. Veuillez vérifier les données saisies.');
      setLoading(false);
    }
  };
  
  if (loading || loadingOptions) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {loadingOptions ? 'Chargement des options...' : 'Chargement des données...'}
        </Typography>
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
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Modifier la vente' : 'Ajouter une vente'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Vente {isEditMode ? 'modifiée' : 'ajoutée'} avec succès!
        </Alert>
      )}
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Informations générales
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="reference"
                name="reference"
                label="Référence"
                value={formData.reference}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date de vente"
                  value={formData.dateVente}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                id="prixVente"
                name="prixVente"
                label="Prix de vente (€)"
                type="number"
                value={formData.prixVente}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Client et véhicule
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="client-label">Client</InputLabel>
                <Select
                  labelId="client-label"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleClientChange}
                  label="Client"
                >
                  <MenuItem value="">
                    <em>Sélectionner un client</em>
                  </MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.civilite?.libelle || ''} {client.nom || ''} {client.prenom || ''} {client.compteAffaire ? `(${client.compteAffaire})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="vehicule-label">Véhicule</InputLabel>
                <Select
                  labelId="vehicule-label"
                  id="vehiculeId"
                  name="vehiculeId"
                  value={formData.vehiculeId}
                  onChange={handleChange}
                  label="Véhicule"
                  disabled={!formData.clientId}
                >
                  <MenuItem value="">
                    <em>Sélectionner un véhicule</em>
                  </MenuItem>
                  {vehiculesFiltered.map(vehicule => (
                    <MenuItem key={vehicule.id} value={vehicule.id}>
                      {vehicule.marque?.libelle || ''} {vehicule.modele?.libelle || ''} {vehicule.version || ''} - {vehicule.immatriculation || 'Sans immatriculation'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formData.clientId && vehiculesFiltered.length === 0 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Ce client n'a pas de véhicule associé.{' '}
                  <Link to={`/vehicules/new?clientId=${formData.clientId}`}>
                    Ajouter un véhicule
                  </Link>
                </Alert>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="commentaire"
                name="commentaire"
                label="Commentaire"
                multiline
                rows={4}
                value={formData.commentaire}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                component={Link}
                to="/ventes"
                sx={{ mr: 2 }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default VenteFormPage; 