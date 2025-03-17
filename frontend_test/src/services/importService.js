import api from './api';
import { handleApiError } from '../utils/apiUtils';

const ImportService = {
  /**
   * Importe un fichier XLSX ou PDF vers le serveur
   * @param {File} file - Le fichier à importer (XLSX ou PDF)
   * @returns {Promise<Object>} - Résultat de l'importation
   */
  importFile: async (file) => {
    try {
      console.log('ImportService - Importation du fichier:', file.name);
      
      // Vérifier le type de fichier
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'pdf'].includes(fileExtension)) {
        throw new Error('Format de fichier non supporté. Seuls les fichiers XLSX et PDF sont acceptés.');
      }
      
      // Créer un FormData pour envoyer le fichier
      const formData = new FormData();
      formData.append('file', file);
      
      // Déterminer l'endpoint en fonction du type de fichier
      const endpoint = fileExtension === 'xlsx' ? '/api/import/xlsx' : '/api/import/pdf';
      
      // Envoyer la requête avec le fichier
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Timeout plus long pour les gros fichiers (60s)
      });
      
      console.log('ImportService - Résultat de l\'importation:', response.data);
      return response.data;
    } catch (error) {
      handleApiError(error, 'importation du fichier');
      throw error;
    }
  },
  
  /**
   * Récupère l'historique des importations
   * @returns {Promise<Array>} - Liste des importations
   */
  getImportHistory: async () => {
    try {
      console.log('ImportService - Récupération de l\'historique des importations');
      const response = await api.get('/api/imports');
      return response.data;
    } catch (error) {
      handleApiError(error, 'récupération de l\'historique des importations');
      throw error;
    }
  }
};

export default ImportService; 