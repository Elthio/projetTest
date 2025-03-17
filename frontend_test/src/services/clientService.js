import api from './api';

const ClientService = {
  // Récupérer tous les clients avec pagination et filtres
  getClients: async (page = 1, limit = 10, filters = {}) => {
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
      if (filters.nom) {
        params['nom'] = filters.nom;
      }
      
      if (filters.civilite) {
        params['civilite.libelle'] = filters.civilite;
        delete params.civilite;
      }
      
      if (filters.codePostal) {
        params['adresses.codePostal'] = filters.codePostal;
        delete params.codePostal;
      }
      
      if (filters.ville) {
        params['adresses.ville'] = filters.ville;
        delete params.ville;
      }
      
      if (filters.email) {
        params['contacts.email'] = filters.email;
        delete params.email;
      }
      
      if (filters.telephone) {
        params['contacts.telephonePortable'] = filters.telephone;
        delete params.telephone;
      }
      
      if (filters.estProprietaireActuel !== null) {
        params['estProprietaireActuel'] = filters.estProprietaireActuel;
      }
      
      console.log('Appel API clients avec params:', params);
      const response = await api.get('/api/clients', { params });
      console.log('Réponse API clients brute:', response);
      console.log('Réponse API clients data:', response.data);
      
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
      console.error('Erreur lors de la récupération des clients:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Récupérer un client par son ID
  getClientById: async (id) => {
    try {
      console.log(`Appel API pour récupérer le client ${id}`);
      const response = await api.get(`/api/clients/${id}`);
      console.log(`Réponse API client ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    try {
      console.log('Appel API pour créer un client:', clientData);
      const response = await api.post('/api/clients', clientData);
      console.log('Réponse API création client:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    try {
      console.log(`Appel API pour mettre à jour le client ${id}:`, clientData);
      const response = await api.put(`/api/clients/${id}`, clientData);
      console.log(`Réponse API mise à jour client ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du client ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Supprimer un client
  deleteClient: async (id) => {
    try {
      console.log(`Appel API pour supprimer le client ${id}`);
      const response = await api.delete(`/api/clients/${id}`);
      console.log(`Réponse API suppression client ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du client ${id}:`, error);
      console.error('Détails de l\'erreur:', error.response ? error.response.data : 'Pas de réponse');
      throw error;
    }
  },

  // Récupérer toutes les civilités (données statiques car l'API n'existe pas)
  getCivilites: async () => {
    try {
      // Au lieu d'appeler l'API qui n'existe pas, nous retournons une liste statique
      const civilites = [
        { id: 1, libelle: 'M.' },
        { id: 2, libelle: 'Mme' },
        { id: 3, libelle: 'Mlle' },
        { id: 4, libelle: 'Dr' },
        { id: 5, libelle: 'Société' }
      ];
      
      // Simuler la structure de réponse de l'API
      return {
        'hydra:member': civilites,
        'hydra:totalItems': civilites.length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des civilités:', error);
      throw error;
    }
  }
};

export default ClientService; 