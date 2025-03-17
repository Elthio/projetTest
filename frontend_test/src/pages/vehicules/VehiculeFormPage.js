import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Divider
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import EventIcon from '@mui/icons-material/Event';
import vehiculeService from '../../services/vehiculeService';
import clientService from '../../services/clientService';

const VehiculeFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    marqueId: '',
    modeleId: '',
    version: '',
    immatriculation: '',
    vin: '',
    energieId: '',
    dateMiseCirculation: null,
    clientId: ''
  });
  
  // États pour les options des listes déroulantes
  const [marques, setMarques] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [energies, setEnergies] = useState([]);
  const [clients, setClients] = useState([]);
  
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
        
        // Chargement des marques
        const marquesResponse = await vehiculeService.getMarques();
        setMarques(marquesResponse['hydra:member'] || []);
        
        // Chargement des énergies
        const energiesResponse = await vehiculeService.getEnergies();
        setEnergies(energiesResponse['hydra:member'] || []);
        
        // Chargement des clients
        const clientsResponse = await clientService.getClients(0, 100);
        setClients(clientsResponse.items || []);
        
        setLoadingOptions(false);
      } catch (err) {
        console.error('Erreur lors du chargement des options:', err);
        setError('Impossible de charger les options du formulaire.');
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  // Chargement des données du véhicule en mode édition
  useEffect(() => {
    if (isEditMode) {
      const fetchVehicule = async () => {
        try {
          setLoading(true);
          const vehiculeData = await vehiculeService.getVehiculeById(id);
          
          setFormData({
            marqueId: vehiculeData.marque?.id || '',
            modeleId: vehiculeData.modele?.id || '',
            version: vehiculeData.version || '',
            immatriculation: vehiculeData.immatriculation || '',
            vin: vehiculeData.vin || '',
            energieId: vehiculeData.energie?.id || '',
            dateMiseCirculation: vehiculeData.dateMiseCirculation ? new Date(vehiculeData.dateMiseCirculation) : null,
            clientId: vehiculeData.client?.id || ''
          });
          
          // Si une marque est sélectionnée, charger les modèles correspondants
          if (vehiculeData.marque?.id) {
            const modelesResponse = await vehiculeService.getModeles(vehiculeData.marque.id);
            setModeles(modelesResponse['hydra:member'] || []);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement du véhicule:', err);
          setError('Impossible de charger les données du véhicule.');
          setLoading(false);
        }
      };
      
      fetchVehicule();
    }
  }, [id, isEditMode]);
  
  // Chargement des modèles lorsque la marque change
  useEffect(() => {
    if (formData.marqueId) {
      const fetchModeles = async () => {
        try {
          const response = await vehiculeService.getModeles(formData.marqueId);
          setModeles(response['hydra:member'] || []);
        } catch (err) {
          console.error('Erreur lors du chargement des modèles:', err);
          setError('Impossible de charger les modèles pour cette marque.');
        }
      };
      
      fetchModeles();
    } else {
      setModeles([]);
    }
  }, [formData.marqueId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Réinitialiser le modèle si la marque change
    if (name === 'marqueId') {
      setFormData(prev => ({ ...prev, modeleId: '' }));
    }
  };
  
  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, dateMiseCirculation: date }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Préparer les données pour l'API
      const vehiculeData = {
        ...formData,
        // Utiliser des IRIs au lieu d'objets imbriqués
        marque: formData.marqueId ? `/api/marques/${formData.marqueId}` : null,
        modele: formData.modeleId ? `/api/modeles/${formData.modeleId}` : null,
        energie: formData.energieId ? `/api/energies/${formData.energieId}` : null,
        client: formData.clientId ? `/api/clients/${formData.clientId}` : null
      };
      
      // Supprimer les propriétés qui ne sont pas nécessaires pour l'API
      delete vehiculeData.marqueId;
      delete vehiculeData.modeleId;
      delete vehiculeData.energieId;
      delete vehiculeData.clientId;
      
      if (isEditMode) {
        await vehiculeService.updateVehicule(id, vehiculeData);
      } else {
        await vehiculeService.createVehicule(vehiculeData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Rediriger après un court délai
      setTimeout(() => {
        navigate('/vehicules');
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du véhicule:', err);
      setError('Impossible d\'enregistrer le véhicule. Veuillez vérifier les données saisies.');
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
          to="/vehicules"
        >
          Retour à la liste
        </Button>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Véhicule {isEditMode ? 'modifié' : 'ajouté'} avec succès!
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
              <FormControl fullWidth required>
                <InputLabel id="marque-label">Marque</InputLabel>
                <Select
                  labelId="marque-label"
                  id="marqueId"
                  name="marqueId"
                  value={formData.marqueId}
                  onChange={handleChange}
                  label="Marque"
                >
                  {marques.map(marque => (
                    <MenuItem key={marque.id} value={marque.id}>
                      {marque.libelle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required disabled={!formData.marqueId}>
                <InputLabel id="modele-label">Modèle</InputLabel>
                <Select
                  labelId="modele-label"
                  id="modeleId"
                  name="modeleId"
                  value={formData.modeleId}
                  onChange={handleChange}
                  label="Modèle"
                >
                  {modeles.map(modele => (
                    <MenuItem key={modele.id} value={modele.id}>
                      {modele.libelle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="version"
                name="version"
                label="Version"
                value={formData.version}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="energie-label">Énergie</InputLabel>
                <Select
                  labelId="energie-label"
                  id="energieId"
                  name="energieId"
                  value={formData.energieId}
                  onChange={handleChange}
                  label="Énergie"
                >
                  {energies.map(energie => (
                    <MenuItem key={energie.id} value={energie.id}>
                      {energie.libelle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Identification
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                id="immatriculation"
                name="immatriculation"
                label="Immatriculation"
                value={formData.immatriculation}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="vin"
                name="vin"
                label="Numéro VIN"
                value={formData.vin}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                <DatePicker
                  label="Date de mise en circulation"
                  value={formData.dateMiseCirculation}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: 'outlined'
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Propriétaire
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="client-label">Client</InputLabel>
                <Select
                  labelId="client-label"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  label="Client"
                >
                  <MenuItem value="">
                    <em>Aucun</em>
                  </MenuItem>
                  {clients.map(client => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.civilite?.libelle || ''} {client.nom || ''} {client.prenom || ''} {client.compteAffaire ? `(${client.compteAffaire})` : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                component={Link}
                to="/vehicules"
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

export default VehiculeFormPage; 