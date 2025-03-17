import api from './api';
import { extractApiData, buildApiParams, handleApiError } from '../utils/apiUtils';

const ClientService = {
  // Récupérer tous les clients avec pagination et filtres
  getClients: async (page = 1, limit = 10, filters = {}) => {
    try {
      // Construire les paramètres pour l'API
      const params = buildApiParams({ page, limit, sortBy: filters.sortBy, sortOrder: filters.sortOrder, filters });
      
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
      
      if (filters.estProprietaireActuel !== null && filters.estProprietaireActuel !== undefined) {
        params['estProprietaireActuel'] = filters.estProprietaireActuel;
      }
      
      console.log('ClientService - Appel API clients avec params:', params);
      const response = await api.get('/api/clients', { params });
      
      // Extraire et normaliser les données
      const result = extractApiData(response);
      
      console.log('ClientService - Données extraites:', { 
        items: result.items, 
        total: result.total, 
        itemsLength: result.items.length 
      });
      
      return result;
    } catch (error) {
      handleApiError(error, 'récupération des clients');
      throw error;
    }
  },

  // Récupérer un client par son ID
  getClientById: async (id) => {
    try {
      console.log(`ClientService - Récupération du client ${id}`);
      const response = await api.get(`/api/clients/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `récupération du client ${id}`);
      throw error;
    }
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    try {
      console.log('ClientService - Création d\'un client:', clientData);
      const response = await api.post('/api/clients', clientData);
      return response.data;
    } catch (error) {
      handleApiError(error, 'création du client');
      throw error;
    }
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    try {
      console.log(`ClientService - Mise à jour du client ${id}:`, clientData);
      const response = await api.put(`/api/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      handleApiError(error, `mise à jour du client ${id}`);
      throw error;
    }
  },

  // Supprimer un client
  deleteClient: async (id) => {
    try {
      console.log(`ClientService - Suppression du client ${id}`);
      const response = await api.delete(`/api/clients/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `suppression du client ${id}`);
      throw error;
    }
  },

  // Récupérer toutes les civilités
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
      
      return {
        items: civilites,
        total: civilites.length
      };
    } catch (error) {
      handleApiError(error, 'récupération des civilités');
      throw error;
    }
  }
};

export default ClientService; 