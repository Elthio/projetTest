import api from './api';

const VehiculeService = {
  // Récupérer tous les véhicules avec pagination et filtres
  getVehicules: async (page = 1, limit = 10, filters = {}) => {
    try {
      // Convertir les paramètres pour l'API Platform
      const params = { ...filters };
      
      // Ajouter les paramètres de pagination si nécessaire
      if (page !== undefined) {
        params.page = page; // API Platform utilise une pagination basée sur 1
      }
      
      if (limit !== undefined) {
        params.itemsPerPage = limit;
      }
      
      // Ajouter les paramètres de tri si nécessaire
      if (filters.sortBy && filters.sortOrder) {
        params[`order[${filters.sortBy}]`] = filters.sortOrder.toLowerCase();
        // Supprimer les paramètres de tri originaux
        delete params.sortBy;
        delete params.sortOrder;
      }
      
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
      
      console.log('Appel API véhicules avec params:', params);
      const response = await api.get('/api/vehicules', { params });
      
      // Vérifier la structure de la réponse
      if (!response.data) {
        console.error('Réponse API sans données');
        return { data: { content: [], total: 0 } };
      }
      
      // Extraire les données selon la structure de l'API
      const content = response.data['hydra:member'] || [];
      const total = response.data['hydra:totalItems'] || 0;
      
      return {
        data: {
          content,
          total
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      console.log('Détails de l\'erreur:', error.response?.data);
      throw error;
    }
  },

  // Récupérer un véhicule par son ID
  getVehiculeById: async (id) => {
    try {
      console.log(`Appel API pour récupérer le véhicule ${id}`);
      const response = await api.get(`/api/vehicules/${id}`);
      console.log(`Réponse API véhicule ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du véhicule ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Créer un nouveau véhicule
  createVehicule: async (vehiculeData) => {
    try {
      console.log('Appel API pour créer un véhicule:', vehiculeData);
      const response = await api.post('/api/vehicules', vehiculeData);
      console.log('Réponse API création véhicule:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du véhicule:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Mettre à jour un véhicule
  updateVehicule: async (id, vehiculeData) => {
    try {
      console.log(`Appel API pour mettre à jour le véhicule ${id}:`, vehiculeData);
      const response = await api.put(`/api/vehicules/${id}`, vehiculeData);
      console.log(`Réponse API mise à jour véhicule ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du véhicule ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Supprimer un véhicule
  deleteVehicule: async (id) => {
    try {
      console.log(`Appel API pour supprimer le véhicule ${id}`);
      const response = await api.delete(`/api/vehicules/${id}`);
      console.log(`Réponse API suppression véhicule ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du véhicule ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Récupérer toutes les marques
  getMarques: async () => {
    try {
      console.log('Appel API pour récupérer les marques');
      const response = await api.get('/api/marques');
      console.log('Réponse API marques:', response.data);
      
      // Extraire les données selon la structure de l'API
      let items = [];
      let total = 0;
      
      if (Array.isArray(response.data)) {
        items = response.data;
        total = response.data.length;
      } else if (response.data.member && Array.isArray(response.data.member)) {
        items = response.data.member;
        total = response.data.totalItems || items.length;
      } else if (response.data['hydra:member'] && Array.isArray(response.data['hydra:member'])) {
        items = response.data['hydra:member'];
        total = response.data['hydra:totalItems'] || items.length;
      }
      
      return {
        'hydra:member': items,
        'hydra:totalItems': total
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des marques:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Récupérer tous les modèles
  getModeles: async (marqueId = null) => {
    try {
      const params = marqueId ? { 'marque.id': marqueId } : {};
      console.log('Appel API pour récupérer les modèles avec params:', params);
      const response = await api.get('/api/modeles', { params });
      console.log('Réponse API modèles:', response.data);
      
      // Extraire les données selon la structure de l'API
      let items = [];
      let total = 0;
      
      if (Array.isArray(response.data)) {
        items = response.data;
        total = response.data.length;
      } else if (response.data.member && Array.isArray(response.data.member)) {
        items = response.data.member;
        total = response.data.totalItems || items.length;
      } else if (response.data['hydra:member'] && Array.isArray(response.data['hydra:member'])) {
        items = response.data['hydra:member'];
        total = response.data['hydra:totalItems'] || items.length;
      }
      
      return {
        'hydra:member': items,
        'hydra:totalItems': total
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Récupérer toutes les énergies
  getEnergies: async () => {
    try {
      console.log('Appel API pour récupérer les énergies');
      const response = await api.get('/api/energies');
      console.log('Réponse API énergies:', response.data);
      
      // Extraire les données selon la structure de l'API
      let items = [];
      let total = 0;
      
      if (Array.isArray(response.data)) {
        items = response.data;
        total = response.data.length;
      } else if (response.data.member && Array.isArray(response.data.member)) {
        items = response.data.member;
        total = response.data.totalItems || items.length;
      } else if (response.data['hydra:member'] && Array.isArray(response.data['hydra:member'])) {
        items = response.data['hydra:member'];
        total = response.data['hydra:totalItems'] || items.length;
      }
      
      return {
        'hydra:member': items,
        'hydra:totalItems': total
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des énergies:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  }
};

export default VehiculeService; 