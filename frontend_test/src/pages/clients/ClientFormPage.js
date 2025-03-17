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
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import clientService from '../../services/clientService';

const ClientFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    civiliteId: '',
    nom: '',
    prenom: '',
    compteAffaire: '',
    estProprietaireActuel: false,
    adresses: [
      {
        type: 'LIVRAISON',
        rue: '',
        codePostal: '',
        ville: '',
        pays: 'France'
      }
    ],
    contacts: [
      {
        type: 'PRINCIPAL',
        email: '',
        telephoneFixe: '',
        telephonePortable: ''
      }
    ]
  });
  
  // États pour les options des listes déroulantes
  const [civilites, setCivilites] = useState([]);
  
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
        
        // Chargement des civilités
        const civilitesResponse = await clientService.getCivilites();
        console.log('Civilités reçues:', civilitesResponse);
        
        // Vérifier la structure de la réponse et extraire les civilités
        if (civilitesResponse && civilitesResponse['hydra:member']) {
          setCivilites(civilitesResponse['hydra:member']);
        } else {
          // Utiliser des civilités par défaut si la réponse n'est pas dans le format attendu
          setCivilites([
            { id: 1, libelle: 'M.' },
            { id: 2, libelle: 'Mme' },
            { id: 3, libelle: 'Mlle' },
            { id: 4, libelle: 'Dr' },
            { id: 5, libelle: 'Société' }
          ]);
        }
        
        setLoadingOptions(false);
      } catch (err) {
        console.error('Erreur lors du chargement des options:', err);
        // Utiliser des civilités par défaut en cas d'erreur
        setCivilites([
          { id: 1, libelle: 'M.' },
          { id: 2, libelle: 'Mme' },
          { id: 3, libelle: 'Mlle' },
          { id: 4, libelle: 'Dr' },
          { id: 5, libelle: 'Société' }
        ]);
        setError('Impossible de charger les options du formulaire.');
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);
  
  // Chargement des données du client en mode édition
  useEffect(() => {
    if (isEditMode) {
      const fetchClient = async () => {
        try {
          setLoading(true);
          const client = await clientService.getClientById(id);
          
          // Si le client n'a pas d'adresses, en ajouter une par défaut
          const adresses = client.adresses && client.adresses.length > 0
            ? client.adresses
            : [{ type: 'LIVRAISON', rue: '', codePostal: '', ville: '', pays: 'France' }];
          
          // Si le client n'a pas de contacts, en ajouter un par défaut
          const contacts = client.contacts && client.contacts.length > 0
            ? client.contacts
            : [{ type: 'PRINCIPAL', email: '', telephoneFixe: '', telephonePortable: '' }];
          
          setFormData({
            civiliteId: client.civilite?.id || '',
            nom: client.nom || '',
            prenom: client.prenom || '',
            compteAffaire: client.compteAffaire || '',
            estProprietaireActuel: client.estProprietaireActuel || false,
            adresses: adresses,
            contacts: contacts
          });
          
          setLoading(false);
        } catch (err) {
          console.error('Erreur lors du chargement du client:', err);
          setError('Impossible de charger les données du client.');
          setLoading(false);
        }
      };
      
      fetchClient();
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Gérer les cases à cocher
    if (name === 'estProprietaireActuel') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAdresseChange = (index, field, value) => {
    const newAdresses = [...formData.adresses];
    newAdresses[index] = { ...newAdresses[index], [field]: value };
    setFormData(prev => ({ ...prev, adresses: newAdresses }));
  };
  
  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData(prev => ({ ...prev, contacts: newContacts }));
  };
  
  const handleAddAdresse = () => {
    setFormData(prev => ({
      ...prev,
      adresses: [
        ...prev.adresses,
        {
          type: 'FACTURATION',
          rue: '',
          codePostal: '',
          ville: '',
          pays: 'France'
        }
      ]
    }));
  };
  
  const handleRemoveAdresse = (index) => {
    if (formData.adresses.length <= 1) {
      return; // Garder au moins une adresse
    }
    
    const newAdresses = formData.adresses.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, adresses: newAdresses }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Préparer les données pour l'API
      const clientData = {
        ...formData,
        civilite: formData.civiliteId ? { id: formData.civiliteId } : null
      };
      
      // Supprimer les propriétés qui ne sont pas nécessaires pour l'API
      delete clientData.civiliteId;
      
      if (isEditMode) {
        await clientService.updateClient(id, clientData);
      } else {
        await clientService.createClient(clientData);
      }
      
      setSuccess(true);
      setLoading(false);
      
      // Rediriger après un court délai
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement du client:', err);
      setError('Impossible d\'enregistrer le client. Veuillez vérifier les données saisies.');
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
          to="/clients"
        >
          Retour à la liste
        </Button>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Modifier le client' : 'Ajouter un client'}
        </Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Client {isEditMode ? 'modifié' : 'ajouté'} avec succès!
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
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel id="civilite-label">Civilité</InputLabel>
                <Select
                  labelId="civilite-label"
                  id="civiliteId"
                  name="civiliteId"
                  value={formData.civiliteId}
                  onChange={handleChange}
                  label="Civilité"
                >
                  {civilites && civilites.length > 0 ? (
                    civilites.map(civilite => (
                      <MenuItem key={civilite.id} value={civilite.id}>
                        {civilite.libelle}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">Aucune civilité disponible</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                required
                id="nom"
                name="nom"
                label="Nom"
                value={formData.nom}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="prenom"
                name="prenom"
                label="Prénom"
                value={formData.prenom}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="compteAffaire"
                name="compteAffaire"
                label="Compte Affaire / Entreprise"
                value={formData.compteAffaire}
                onChange={handleChange}
                helperText="Laisser vide pour un client particulier"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.estProprietaireActuel}
                    onChange={handleChange}
                    name="estProprietaireActuel"
                  />
                }
                label="Propriétaire actuel"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" component="h2">
                Contacts
              </Typography>
              <Divider sx={{ mt: 1, mb: 2 }} />
            </Grid>
            
            {formData.contacts && formData.contacts.map((contact, index) => (
              <React.Fragment key={`contact-${index}`}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id={`contact-email-${index}`}
                    label="Email"
                    type="email"
                    value={contact.email || ''}
                    onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id={`contact-telephone-fixe-${index}`}
                    label="Téléphone fixe"
                    value={contact.telephoneFixe || ''}
                    onChange={(e) => handleContactChange(index, 'telephoneFixe', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id={`contact-telephone-portable-${index}`}
                    label="Téléphone portable"
                    value={contact.telephonePortable || ''}
                    onChange={(e) => handleContactChange(index, 'telephonePortable', e.target.value)}
                  />
                </Grid>
              </React.Fragment>
            ))}
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="h2">
                  Adresses
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddAdresse}
                  disabled={formData.adresses.length >= 2}
                >
                  Ajouter une adresse
                </Button>
              </Box>
              <Divider sx={{ mt: 1, mb: 2 }} />
            </Grid>
            
            {formData.adresses.map((adresse, index) => (
              <React.Fragment key={`adresse-${index}`}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1">
                      Adresse {index + 1}
                    </Typography>
                    {formData.adresses.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveAdresse(index)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel id={`adresse-type-label-${index}`}>Type d'adresse</InputLabel>
                    <Select
                      labelId={`adresse-type-label-${index}`}
                      id={`adresse-type-${index}`}
                      value={adresse.type}
                      onChange={(e) => handleAdresseChange(index, 'type', e.target.value)}
                      label="Type d'adresse"
                    >
                      <MenuItem value="LIVRAISON">Livraison</MenuItem>
                      <MenuItem value="FACTURATION">Facturation</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    id={`adresse-rue-${index}`}
                    label="Rue"
                    value={adresse.rue}
                    onChange={(e) => handleAdresseChange(index, 'rue', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    id={`adresse-code-postal-${index}`}
                    label="Code postal"
                    value={adresse.codePostal}
                    onChange={(e) => handleAdresseChange(index, 'codePostal', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    id={`adresse-ville-${index}`}
                    label="Ville"
                    value={adresse.ville}
                    onChange={(e) => handleAdresseChange(index, 'ville', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id={`adresse-pays-${index}`}
                    label="Pays"
                    value={adresse.pays}
                    onChange={(e) => handleAdresseChange(index, 'pays', e.target.value)}
                  />
                </Grid>
              </React.Fragment>
            ))}
            
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {isEditMode ? 'Enregistrer les modifications' : 'Ajouter le client'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ClientFormPage; 