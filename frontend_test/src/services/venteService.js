import api from './api';

const VenteService = {
  // Récupérer toutes les ventes avec pagination et filtres
  getVentes: async (page = 0, limit = 10, filters = {}) => {
    try {
      // Convertir les paramètres pour l'API Platform
      const params = { ...filters };
      
      // Ajouter les paramètres de pagination si nécessaire
      if (page !== undefined) {
        params.page = page + 1; // API Platform utilise une pagination basée sur 1
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
      if (filters.numeroDossier) {
        params['numeroDossier'] = filters.numeroDossier;
      }
      
      if (filters.typeVnVo) {
        params['typeVnVo'] = filters.typeVnVo;
      }
      
      if (filters.clientNom) {
        params['client.nom'] = filters.clientNom;
        delete params.clientNom;
      }
      
      if (filters.vehiculeVin) {
        params['vehicule.vin'] = filters.vehiculeVin;
        delete params.vehiculeVin;
      }
      
      if (filters.vehiculeImmatriculation) {
        params['vehicule.immatriculation'] = filters.vehiculeImmatriculation;
        delete params.vehiculeImmatriculation;
      }
      
      if (filters.vendeurNom) {
        params['vendeurVn.nom'] = filters.vendeurNom;
        delete params.vendeurNom;
      }
      
      if (filters.dateAchatMin) {
        params['dateAchat[after]'] = filters.dateAchatMin;
        delete params.dateAchatMin;
      }
      
      if (filters.dateAchatMax) {
        params['dateAchat[before]'] = filters.dateAchatMax;
        delete params.dateAchatMax;
      }
      
      if (filters.dateLivraisonMin) {
        params['dateLivraison[after]'] = filters.dateLivraisonMin;
        delete params.dateLivraisonMin;
      }
      
      if (filters.dateLivraisonMax) {
        params['dateLivraison[before]'] = filters.dateLivraisonMax;
        delete params.dateLivraisonMax;
      }
      
      console.log('Appel API ventes avec params:', params);
      const response = await api.get('/api/ventes', { params });
      console.log('Réponse API ventes brute:', response);
      console.log('Réponse API ventes data:', response.data);
      
      // Vérifier la structure de la réponse
      if (!response.data) {
        console.error('Réponse API sans données');
        return { items: [], total: 0, page, limit, totalPages: 0 };
      }
      
      // Extraire les données selon la structure de l'API
      let items = [];
      let total = 0;
      
      if (Array.isArray(response.data)) {
        // Si la réponse est un tableau
        items = response.data;
        total = response.data.length;
      } else if (response.data.member && Array.isArray(response.data.member)) {
        // Si la réponse a un champ 'member' qui est un tableau
        items = response.data.member;
        total = response.data.totalItems || items.length;
      } else if (response.data['hydra:member'] && Array.isArray(response.data['hydra:member'])) {
        // Si la réponse a un champ 'hydra:member' qui est un tableau
        items = response.data['hydra:member'];
        total = response.data['hydra:totalItems'] || items.length;
      } else {
        console.error('Structure de réponse non reconnue:', response.data);
      }
      
      // Transformer la réponse pour correspondre au format attendu par notre application
      const result = {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
      
      console.log('Données transformées:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Récupérer une vente par son ID
  getVenteById: async (id) => {
    try {
      console.log(`Appel API pour récupérer la vente ${id}`);
      const response = await api.get(`/api/ventes/${id}`);
      console.log(`Réponse API vente ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la vente ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Créer une nouvelle vente
  createVente: async (venteData) => {
    try {
      console.log('Appel API pour créer une vente:', venteData);
      const response = await api.post('/api/ventes', venteData);
      console.log('Réponse API création vente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la vente:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Mettre à jour une vente
  updateVente: async (id, venteData) => {
    try {
      console.log(`Appel API pour mettre à jour la vente ${id}:`, venteData);
      const response = await api.put(`/api/ventes/${id}`, venteData);
      console.log(`Réponse API mise à jour vente ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la vente ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Supprimer une vente
  deleteVente: async (id) => {
    try {
      console.log(`Appel API pour supprimer la vente ${id}`);
      const response = await api.delete(`/api/ventes/${id}`);
      console.log(`Réponse API suppression vente ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la vente ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Récupérer tous les vendeurs
  getVendeurs: async () => {
    try {
      console.log('Appel API pour récupérer les vendeurs');
      const response = await api.get('/api/vendeurs');
      console.log('Réponse API vendeurs:', response.data);
      
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
      console.error('Erreur lors de la récupération des vendeurs:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  }
};

export default VenteService; 