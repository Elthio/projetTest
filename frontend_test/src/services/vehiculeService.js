import api from './api';
import { extractApiData, buildApiParams, handleApiError } from '../utils/apiUtils';

const VehiculeService = {
  // Récupérer tous les véhicules avec pagination et filtres
  getVehicules: async (page = 1, limit = 10, filters = {}) => {
    try {
      // Construire les paramètres pour l'API
      const params = buildApiParams({ page, limit, sortBy: filters.sortBy, sortOrder: filters.sortOrder, filters });
      
      // Traitement spécifique pour certains filtres
      if (filters.marque) {
        params['marque.libelle'] = filters.marque;
        delete params.marque;
      }
      
      if (filters.modele) {
        params['modele.libelle'] = filters.modele;
        delete params.modele;
      }
      
      if (filters.energie) {
        params['energie.libelle'] = filters.energie;
        delete params.energie;
      }
      
      if (filters.clientNom) {
        params['client.nom'] = filters.clientNom;
        delete params.clientNom;
      }
      
      if (filters.dateMin) {
        params['dateMiseCirculation[after]'] = filters.dateMin;
        delete params.dateMin;
      }
      
      if (filters.dateMax) {
        params['dateMiseCirculation[before]'] = filters.dateMax;
        delete params.dateMax;
      }
      
      console.log('VehiculeService - Appel API véhicules avec params:', params);
      const response = await api.get('/api/vehicules', { params });
      
      // Extraire et normaliser les données
      const result = extractApiData(response);
      
      console.log('VehiculeService - Données extraites:', { 
        items: result.items, 
        total: result.total, 
        itemsLength: result.items.length 
      });
      
      return result;
    } catch (error) {
      handleApiError(error, 'récupération des véhicules');
      throw error;
    }
  },

  // Récupérer un véhicule par son ID
  getVehiculeById: async (id) => {
    try {
      console.log(`VehiculeService - Récupération du véhicule ${id}`);
      const response = await api.get(`/api/vehicules/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `récupération du véhicule ${id}`);
      throw error;
    }
  },

  // Créer un nouveau véhicule
  createVehicule: async (vehiculeData) => {
    try {
      console.log('VehiculeService - Création d\'un véhicule:', vehiculeData);
      const response = await api.post('/api/vehicules', vehiculeData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'création du véhicule');
      throw error;
    }
  },

  // Mettre à jour un véhicule
  updateVehicule: async (id, vehiculeData) => {
    try {
      console.log(`VehiculeService - Mise à jour du véhicule ${id}:`, vehiculeData);
      const response = await api.put(`/api/vehicules/${id}`, vehiculeData);
      return response.data;
    } catch (error) {
      handleApiError(error, `mise à jour du véhicule ${id}`);
      throw error;
    }
  },

  // Supprimer un véhicule
  deleteVehicule: async (id) => {
    try {
      console.log(`VehiculeService - Suppression du véhicule ${id}`);
      const response = await api.delete(`/api/vehicules/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `suppression du véhicule ${id}`);
      throw error;
    }
  },

  // Récupérer toutes les marques
  getMarques: async () => {
    try {
      console.log('VehiculeService - Récupération des marques');
      const response = await api.get('/api/marques');
      
      // Extraire et normaliser les données
      return extractApiData(response);
    } catch (error) {
      handleApiError(error, 'récupération des marques');
      throw error;
    }
  },

  // Récupérer tous les modèles
  getModeles: async (marqueId = null) => {
    try {
      const params = marqueId ? { 'marque.id': marqueId } : {};
      console.log('VehiculeService - Récupération des modèles avec params:', params);
      const response = await api.get('/api/modeles', { params });
      
      // Extraire et normaliser les données
      return extractApiData(response);
    } catch (error) {
      handleApiError(error, 'récupération des modèles');
      throw error;
    }
  },

  // Récupérer toutes les énergies
  getEnergies: async () => {
    try {
      console.log('VehiculeService - Récupération des énergies');
      const response = await api.get('/api/energies');
      
      // Extraire et normaliser les données
      return extractApiData(response);
    } catch (error) {
      handleApiError(error, 'récupération des énergies');
      throw error;
    }
  }
};

export default VehiculeService; 