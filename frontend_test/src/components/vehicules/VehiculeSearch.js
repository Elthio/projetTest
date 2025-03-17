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
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import vehiculeService from '../../services/vehiculeService';

const VehiculeSearch = ({ onSearch }) => {
  const [marques, setMarques] = useState([]);
  const [energies, setEnergies] = useState([]);
  const [filters, setFilters] = useState({
    marque: '',
    modele: '',
    energie: '',
    immatriculation: '',
    vin: '',
    clientNom: '',
    dateMin: '',
    dateMax: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marquesData = await vehiculeService.getMarques();
        setMarques(marquesData['hydra:member'] || []);

        const energiesData = await vehiculeService.getEnergies();
        setEnergies(energiesData['hydra:member'] || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données de référence:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      marque: '',
      modele: '',
      energie: '',
      immatriculation: '',
      vin: '',
      clientNom: '',
      dateMin: '',
      dateMax: ''
    });
    onSearch({});
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Recherche de véhicules
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="marque-label">Marque</InputLabel>
              <Select
                labelId="marque-label"
                name="marque"
                value={filters.marque}
                onChange={handleChange}
                label="Marque"
              >
                <MenuItem value="">Toutes</MenuItem>
                {marques.map((marque) => (
                  <MenuItem key={marque.id} value={marque.libelle}>
                    {marque.libelle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Modèle"
              name="modele"
              value={filters.modele}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="energie-label">Énergie</InputLabel>
              <Select
                labelId="energie-label"
                name="energie"
                value={filters.energie}
                onChange={handleChange}
                label="Énergie"
              >
                <MenuItem value="">Toutes</MenuItem>
                {energies.map((energie) => (
                  <MenuItem key={energie.id} value={energie.libelle}>
                    {energie.libelle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Immatriculation"
              name="immatriculation"
              value={filters.immatriculation}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="VIN"
              name="vin"
              value={filters.vin}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Nom du client"
              name="clientNom"
              value={filters.clientNom}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Date de mise en circulation min"
              name="dateMin"
              type="date"
              value={filters.dateMin}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Date de mise en circulation max"
              name="dateMax"
              type="date"
              value={filters.dateMax}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
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

export default VehiculeSearch; 