import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  AlertTitle,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import importService from '../../services/importService';

const FileImport = ({ onImportSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [importStats, setImportStats] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setImportStats(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      setImportStats(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier à importer');
      return;
    }

    // Vérifier l'extension du fichier
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'pdf'].includes(fileExtension)) {
      setError('Format de fichier non supporté. Seuls les fichiers XLSX et PDF sont acceptés.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    setImportStats(null);

    try {
      const result = await importService.importFile(selectedFile);
      
      setSuccess(`Le fichier ${selectedFile.name} a été importé avec succès.`);
      
      // Extraire les statistiques d'importation si disponibles
      if (result && result.stats) {
        setImportStats(result.stats);
      }
      
      // Réinitialiser le fichier sélectionné
      setSelectedFile(null);
      
      // Appeler le callback de succès si fourni
      if (onImportSuccess && typeof onImportSuccess === 'function') {
        onImportSuccess(result);
      }
    } catch (err) {
      console.error('Erreur lors de l\'importation:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'importation du fichier');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
    setImportStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    switch (fileExtension) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" sx={{ fontSize: 40 }} />;
      case 'xlsx':
        return <TableChartIcon color="success" sx={{ fontSize: 40 }} />;
      default:
        return <FileUploadIcon color="primary" sx={{ fontSize: 40 }} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px dashed',
          borderColor: selectedFile ? 'primary.main' : 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Importation de fichiers
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Glissez-déposez un fichier XLSX ou PDF, ou cliquez pour sélectionner
          </Typography>
        </Box>

        {/* Zone de glisser-déposer */}
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            px: 2,
            mb: 3,
            borderRadius: 1,
            bgcolor: 'background.default',
            border: '2px dashed',
            borderColor: selectedFile ? 'primary.main' : 'divider',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover'
            }
          }}
          onClick={() => fileInputRef.current.click()}
        >
          {selectedFile ? (
            <>
              {getFileIcon()}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {formatFileSize(selectedFile.size)}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Chip 
                  label={selectedFile.name.split('.').pop().toUpperCase()} 
                  color={selectedFile.name.endsWith('.xlsx') ? 'success' : 'error'} 
                  size="small" 
                />
                <Tooltip title="Supprimer le fichier">
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleClearFile(); }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          ) : (
            <>
              <CloudUploadIcon color="primary" sx={{ fontSize: 60, mb: 2, opacity: 0.7 }} />
              <Typography variant="body1">
                Cliquez ou glissez-déposez un fichier ici
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Formats supportés: XLSX, PDF
              </Typography>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.pdf"
            style={{ display: 'none' }}
          />
        </Box>

        {/* Bouton d'importation */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <FileUploadIcon fontSize="large" />}
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            sx={{ 
              px: { xs: 3, sm: 4, md: 6 }, 
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: { xs: '0.9rem', sm: '1.1rem' },
              boxShadow: '0 8px 16px rgba(76, 175, 80, 0.4)',
              background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              transition: 'all 0.3s ease',
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                boxShadow: '0 12px 20px rgba(76, 175, 80, 0.6)',
                transform: 'translateY(-2px)',
              },
              '&:active': {
                boxShadow: '0 5px 10px rgba(76, 175, 80, 0.4)',
                transform: 'translateY(1px)',
              },
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: !loading && selectedFile ? 'shine 2s infinite' : 'none',
              },
              '@keyframes shine': {
                '0%': { left: '-100%' },
                '100%': { left: '100%' }
              }
            }}
          >
            {loading ? 'Importation en cours...' : 'Importer le fichier'}
          </Button>
        </Box>

        {/* Messages d'erreur ou de succès */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            <AlertTitle>Erreur</AlertTitle>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <AlertTitle>Succès</AlertTitle>
            {success}
          </Alert>
        )}

        {/* Statistiques d'importation */}
        {importStats && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ my: 2 }}>
              <Chip label="Résultats de l'importation" color="primary" />
            </Divider>
            <List>
              {Object.entries(importStats).map(([key, value]) => (
                <ListItem key={key}>
                  <ListItemIcon>
                    {typeof value === 'number' && value > 0 ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <InfoIcon color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} 
                    secondary={value}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default FileImport; 