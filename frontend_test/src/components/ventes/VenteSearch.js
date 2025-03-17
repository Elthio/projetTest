import React, { useState } from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';

const VenteSearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    numeroDossier: '',
    typeVnVo: '',
    clientNom: '',
    vehiculeVin: '',
    vehiculeImmatriculation: '',
    vendeurNom: '',
    dateAchatMin: '',
    dateAchatMax: '',
    dateLivraisonMin: '',
    dateLivraisonMax: ''
  });
  
  const [expanded, setExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Compter les filtres actifs
    const count = Object.values(filters).filter(val => val !== '').length;
    setActiveFilters(count);
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      numeroDossier: '',
      typeVnVo: '',
      clientNom: '',
      vehiculeVin: '',
      vehiculeImmatriculation: '',
      vendeurNom: '',
      dateAchatMin: '',
      dateAchatMax: '',
      dateLivraisonMin: '',
      dateLivraisonMax: ''
    });
    setActiveFilters(0);
    onSearch({});
  };

  return (
    <Paper elevation={3} sx={{ mb: 4 }}>
      <Box sx={{ p: 2 }}>
        {/* Barre de recherche rapide */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mr: 2 }}>
            Recherche rapide
          </Typography>
          <TextField
            size="small"
            label="N° Dossier"
            name="numeroDossier"
            value={filters.numeroDossier}
            onChange={handleChange}
            sx={{ width: 150, mr: 2 }}
          />
          <FormControl size="small" sx={{ width: 120, mr: 2 }}>
            <InputLabel id="typeVnVo-label">Type</InputLabel>
            <Select
              labelId="typeVnVo-label"
              name="typeVnVo"
              value={filters.typeVnVo}
              onChange={handleChange}
              label="Type"
            >
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="VN">VN</MenuItem>
              <MenuItem value="VO">VO</MenuItem>
            </Select>
          </FormControl>
          <Button
            size="small"
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleSubmit}
          >
            Rechercher
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<ClearIcon />}
            onClick={handleReset}
            sx={{ ml: 1 }}
          >
            Réinitialiser
          </Button>
        </Box>
        
        {/* Filtres avancés */}
        <Accordion 
          expanded={expanded} 
          onChange={() => setExpanded(!expanded)}
          elevation={0}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                Filtres avancés
              </Typography>
              {activeFilters > 0 && (
                <Chip 
                  label={`${activeFilters} actif${activeFilters > 1 ? 's' : ''}`} 
                  size="small" 
                  color="primary" 
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Numéro de dossier"
                    name="numeroDossier"
                    value={filters.numeroDossier}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="typeVnVo-label-full">Type VN/VO</InputLabel>
                    <Select
                      labelId="typeVnVo-label-full"
                      name="typeVnVo"
                      value={filters.typeVnVo}
                      onChange={handleChange}
                      label="Type VN/VO"
                    >
                      <MenuItem value="">Tous</MenuItem>
                      <MenuItem value="VN">Véhicule Neuf</MenuItem>
                      <MenuItem value="VO">Véhicule Occasion</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Nom du client"
                    name="clientNom"
                    value={filters.clientNom}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="VIN du véhicule"
                    name="vehiculeVin"
                    value={filters.vehiculeVin}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Immatriculation"
                    name="vehiculeImmatriculation"
                    value={filters.vehiculeImmatriculation}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Nom du vendeur"
                    name="vendeurNom"
                    value={filters.vendeurNom}
                    onChange={handleChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date d'achat min"
                    name="dateAchatMin"
                    type="date"
                    value={filters.dateAchatMin}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date d'achat max"
                    name="dateAchatMax"
                    type="date"
                    value={filters.dateAchatMax}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date de livraison min"
                    name="dateLivraisonMin"
                    type="date"
                    value={filters.dateLivraisonMin}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Date de livraison max"
                    name="dateLivraisonMax"
                    type="date"
                    value={filters.dateLivraisonMax}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={handleReset}
                    size="small"
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SearchIcon />}
                    size="small"
                  >
                    Rechercher
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
};

export default VenteSearch; 