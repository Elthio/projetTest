import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import clientService from '../../services/clientService';

const ClientSearch = ({ onSearch }) => {
  const [civilites, setCivilites] = useState([]);
  const [filters, setFilters] = useState({
    nom: '',
    civilite: '',
    codePostal: '',
    ville: '',
    email: '',
    telephone: '',
    estProprietaireActuel: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const civilitesData = await clientService.getCivilites();
        setCivilites(civilitesData['hydra:member'] || []);
      } catch (error) {
        console.error('Erreur lors du chargement des civilités:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters(prev => ({ ...prev, [name]: checked ? true : null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      nom: '',
      civilite: '',
      codePostal: '',
      ville: '',
      email: '',
      telephone: '',
      estProprietaireActuel: null
    });
    onSearch({});
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recherche de clients
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Nom"
              name="nom"
              value={filters.nom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="civilite-label">Civilité</InputLabel>
              <Select
                labelId="civilite-label"
                name="civilite"
                value={filters.civilite}
                onChange={handleChange}
                label="Civilité"
              >
                <MenuItem value="">Toutes</MenuItem>
                {civilites.map((civilite) => (
                  <MenuItem key={civilite.id} value={civilite.libelle}>
                    {civilite.libelle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Code postal"
              name="codePostal"
              value={filters.codePostal}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Ville"
              name="ville"
              value={filters.ville}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={filters.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Téléphone"
              name="telephone"
              value={filters.telephone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.estProprietaireActuel === true}
                  onChange={handleCheckboxChange}
                  name="estProprietaireActuel"
                />
              }
              label="Propriétaire actuel"
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleReset}
            >
              Réinitialiser
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
            >
              Rechercher
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ClientSearch; 