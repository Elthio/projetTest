import api from './api';

const ReferenceService = {
  // Fonction générique pour récupérer les données de référence
  getGenericReference: async (endpoint, page = 0, limit = 50, filters = {}) => {
    try {
      const params = { ...filters };
      
      if (page !== undefined) {
        params.page = page + 1;
      }
      
      if (limit !== undefined) {
        params.itemsPerPage = limit;
      }
      
      console.log(`Appel API ${endpoint} avec params:`, params);
      const response = await api.get(`/api/${endpoint}`, { params });
      
      // Vérifier la structure de la réponse
      if (!response.data) {
        console.error('Réponse API sans données');
        return { items: [], total: 0 };
      }
      
      console.log(`Réponse API ${endpoint} complète:`, response);
      console.log(`Données API ${endpoint}:`, response.data);
      
      // Extraire les données selon la structure de l'API
      let items = [];
      let total = 0;
      
      // Vérifier si la réponse contient des données au format Hydra
      if (response.data['member'] && Array.isArray(response.data['member'])) {
        items = response.data['member'];
        total = response.data['totalItems'] || items.length;
        console.log('Format member détecté:', items);
      } else if (response.data['hydra:member'] && Array.isArray(response.data['hydra:member'])) {
        items = response.data['hydra:member'];
        total = response.data['hydra:totalItems'] || items.length;
        console.log('Format hydra:member détecté:', items);
      } else if (Array.isArray(response.data)) {
        items = response.data;
        total = response.data.length;
        console.log('Format tableau détecté:', items);
      } else {
        // Tentative de récupération des données dans un format inconnu
        console.log('Format inconnu, tentative de récupération alternative');
        if (typeof response.data === 'object') {
          // Parcourir l'objet pour trouver un tableau
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              items = response.data[key];
              total = items.length;
              console.log(`Tableau trouvé dans la clé ${key}:`, items);
              break;
            }
          }
        }
      }
      
      return { items, total };
    } catch (error) {
      console.error(`Erreur lors de la récupération des ${endpoint}:`, error);
      throw error;
    }
  },
  
  // ===== CIVILITÉS =====
  getCivilites: async (page = 0, limit = 50, filters = {}) => {
    return ReferenceService.getGenericReference('civilites', page, limit, filters);
  },
  
  getCiviliteById: async (id) => {
    try {
      const response = await api.get(`/api/civilites/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la civilité ${id}:`, error);
      throw error;
    }
  },
  
  createCivilite: async (data) => {
    try {
      const response = await api.post('/api/civilites', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la civilité:', error);
      throw error;
    }
  },
  
  updateCivilite: async (id, data) => {
    try {
      const response = await api.put(`/api/civilites/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la civilité ${id}:`, error);
      throw error;
    }
  },
  
  deleteCivilite: async (id) => {
    try {
      await api.delete(`/api/civilites/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la civilité ${id}:`, error);
      throw error;
    }
  },
  
  // ===== ÉNERGIES =====
  getEnergies: async (page = 0, limit = 50, filters = {}) => {
    return ReferenceService.getGenericReference('energies', page, limit, filters);
  },
  
  getEnergieById: async (id) => {
    try {
      const response = await api.get(`/api/energies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'énergie ${id}:`, error);
      throw error;
    }
  },
  
  createEnergie: async (data) => {
    try {
      const response = await api.post('/api/energies', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'énergie:', error);
      throw error;
    }
  },
  
  updateEnergie: async (id, data) => {
    try {
      const response = await api.put(`/api/energies/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'énergie ${id}:`, error);
      throw error;
    }
  },
  
  deleteEnergie: async (id) => {
    try {
      await api.delete(`/api/energies/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'énergie ${id}:`, error);
      throw error;
    }
  },
  
  // ===== ÉVÉNEMENTS =====
  getEvenements: async (page = 0, limit = 50, filters = {}) => {
    return ReferenceService.getGenericReference('evenements', page, limit, filters);
  },
  
  getEvenementById: async (id) => {
    try {
      const response = await api.get(`/api/evenements/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'événement ${id}:`, error);
      throw error;
    }
  },
  
  createEvenement: async (data) => {
    try {
      const response = await api.post('/api/evenements', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  },
  
  updateEvenement: async (id, data) => {
    try {
      const response = await api.put(`/api/evenements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'événement ${id}:`, error);
      throw error;
    }
  },
  
  deleteEvenement: async (id) => {
    try {
      await api.delete(`/api/evenements/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'événement ${id}:`, error);
      throw error;
    }
  },
  
  // ===== MARQUES =====
  getMarques: async (page = 0, limit = 50, filters = {}) => {
    return ReferenceService.getGenericReference('marques', page, limit, filters);
  },
  
  getMarqueById: async (id) => {
    try {
      const response = await api.get(`/api/marques/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la marque ${id}:`, error);
      throw error;
    }
  },
  
  createMarque: async (data) => {
    try {
      const response = await api.post('/api/marques', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la marque:', error);
      throw error;
    }
  },
  
  updateMarque: async (id, data) => {
    try {
      const response = await api.put(`/api/marques/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la marque ${id}:`, error);
      throw error;
    }
  },
  
  deleteMarque: async (id) => {
    try {
      await api.delete(`/api/marques/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la marque ${id}:`, error);
      throw error;
    }
  },
  
  // ===== MODÈLES =====
  getModeles: async (page = 0, limit = 50, filters = {}) => {
    return ReferenceService.getGenericReference('modeles', page, limit, filters);
  },
  
  getModeleById: async (id) => {
    try {
      const response = await api.get(`/api/modeles/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du modèle ${id}:`, error);
      throw error;
    }
  },
  
  createModele: async (data) => {
    try {
      const response = await api.post('/api/modeles', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du modèle:', error);
      throw error;
    }
  },
  
  updateModele: async (id, data) => {
    try {
      const response = await api.put(`/api/modeles/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du modèle ${id}:`, error);
      throw error;
    }
  },
  
  deleteModele: async (id) => {
    try {
      await api.delete(`/api/modeles/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du modèle ${id}:`, error);
      throw error;
    }
  },
  
  // ===== VENDEURS =====
  getVendeurs: async (page = 0, limit = 50, filters = {}) => {
    return ReferenceService.getGenericReference('vendeurs', page, limit, filters);
  },
  
  getVendeurById: async (id) => {
    try {
      const response = await api.get(`/api/vendeurs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du vendeur ${id}:`, error);
      throw error;
    }
  },
  
  createVendeur: async (data) => {
    try {
      const response = await api.post('/api/vendeurs', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du vendeur:', error);
      throw error;
    }
  },
  
  updateVendeur: async (id, data) => {
    try {
      const response = await api.put(`/api/vendeurs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du vendeur ${id}:`, error);
      throw error;
    }
  },
  
  deleteVendeur: async (id) => {
    try {
      await api.delete(`/api/vendeurs/${id}`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du vendeur ${id}:`, error);
      throw error;
    }
  }
};

export default ReferenceService; 