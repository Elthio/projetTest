import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Tabs, Tab, Divider, Alert, AlertTitle, Fade, useMediaQuery, useTheme } from '@mui/material';
import FileImport from '../components/import/FileImport';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const ImportPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleImportSuccess = (result) => {
    console.log('ImportPage - Import réussi:', result);
    setImportResult(result);
  };

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg">
        <Box sx={{ 
          mb: 4, 
          textAlign: 'center',
          position: 'relative',
          py: 3
        }}>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: { xs: -15, sm: -20 }, 
              left: '50%', 
              transform: 'translateX(-50%)',
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              boxShadow: '0 4px 20px rgba(76, 175, 80, 0.5)',
              zIndex: 1
            }}
          >
            <CloudUploadIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: 'white' }} />
          </Box>
          
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700, 
              mt: { xs: 4, sm: 5 },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Importation de données
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: 700, 
              mx: 'auto', 
              mb: 1,
              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' }
            }}
          >
            Importez facilement vos fichiers XLSX ou PDF pour mettre à jour votre base de données
          </Typography>
          <Box 
            sx={{ 
              width: { xs: 60, sm: 100 }, 
              height: { xs: 3, sm: 4 }, 
              bgcolor: 'success.main', 
              mx: 'auto', 
              mt: 2, 
              borderRadius: 2,
              background: 'linear-gradient(90deg, #2e7d32, #4caf50)'
            }} 
          />
        </Box>

        <Paper 
          elevation={4} 
          sx={{ 
            mb: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="success"
            textColor="success"
            sx={{ 
              bgcolor: 'background.paper',
              '& .MuiTab-root': {
                py: { xs: 2, sm: 3 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
                minWidth: 0,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              },
              '& .Mui-selected': {
                fontWeight: 'bold',
              }
            }}
          >
            <Tab 
              icon={isMobile ? null : <CloudUploadIcon />} 
              label="Importer" 
              iconPosition="start"
              sx={{ py: 2 }}
            />
            <Tab 
              icon={isMobile ? null : <HistoryIcon />} 
              label="Historique" 
              iconPosition="start"
              sx={{ py: 2 }}
            />
            <Tab 
              icon={isMobile ? null : <HelpOutlineIcon />} 
              label="Aide" 
              iconPosition="start"
              sx={{ py: 2 }}
            />
          </Tabs>
          <Divider />

          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {activeTab === 0 && (
              <Fade in={activeTab === 0} timeout={500}>
                <Box>
                  <FileImport onImportSuccess={handleImportSuccess} />
                </Box>
              </Fade>
            )}

            {activeTab === 1 && (
              <Fade in={activeTab === 1} timeout={500}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Historique des importations
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Cette fonctionnalité sera disponible prochainement.
                  </Typography>
                  {importResult && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                      <AlertTitle>Dernière importation</AlertTitle>
                      <Typography variant="body2">
                        {importResult.message || 'Importation réussie'}
                      </Typography>
                      {importResult.stats && (
                        <Box component="pre" sx={{ 
                          mt: 1, 
                          p: 1, 
                          bgcolor: 'background.paper', 
                          borderRadius: 1, 
                          fontSize: '0.8rem', 
                          overflow: 'auto',
                          maxWidth: '100%'
                        }}>
                          {JSON.stringify(importResult.stats, null, 2)}
                        </Box>
                      )}
                    </Alert>
                  )}
                </Box>
              </Fade>
            )}

            {activeTab === 2 && (
              <Fade in={activeTab === 2} timeout={500}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Guide d'importation
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Fichiers XLSX
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Les fichiers Excel (XLSX) doivent respecter un format spécifique pour être correctement importés :
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      <li>
                        <Typography variant="body2">
                          La première ligne doit contenir les en-têtes de colonnes correspondant aux champs de la base de données.
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Les colonnes obligatoires dépendent du type de données que vous importez (véhicules, clients, etc.).
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Les dates doivent être au format YYYY-MM-DD ou DD/MM/YYYY.
                        </Typography>
                      </li>
                    </ul>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Fichiers PDF
                    </Typography>
                    <Typography variant="body2" paragraph>
                      L'importation de fichiers PDF est principalement destinée aux documents officiels comme :
                    </Typography>
                    <ul style={{ paddingLeft: '20px' }}>
                      <li>
                        <Typography variant="body2">
                          Certificats d'immatriculation
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Contrats de vente
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Factures
                        </Typography>
                      </li>
                    </ul>
                    <Typography variant="body2">
                      Le système tentera d'extraire automatiquement les informations pertinentes de ces documents.
                    </Typography>
                  </Box>
                  
                  <Alert severity="success">
                    <AlertTitle>Conseil</AlertTitle>
                    Pour de meilleurs résultats, assurez-vous que vos fichiers sont correctement formatés et que les données sont cohérentes.
                  </Alert>
                </Box>
              </Fade>
            )}
          </Box>
        </Paper>
      </Container>
    </Fade>
  );
};

export default ImportPage; 