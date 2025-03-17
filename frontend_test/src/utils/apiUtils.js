/**
 * Fonction utilitaire pour extraire les données d'une réponse API
 * @param {Object} response - Réponse de l'API
 * @returns {Object} - Données normalisées
 */
export const extractApiData = (response) => {
  if (!response || !response.data) {
    console.error('Réponse API invalide:', response);
    return { items: [], total: 0 };
  }

  let items = [];
  let total = 0;

  // Vérifier les différentes structures possibles
  if (Array.isArray(response.data)) {
    // La réponse est directement un tableau
    items = response.data;
    total = response.data.length;
  } else if (response.data.member && Array.isArray(response.data.member)) {
    // Structure avec 'member'
    items = response.data.member;
    total = response.data.totalItems || items.length;
  } else if (response.data['hydra:member'] && Array.isArray(response.data['hydra:member'])) {
    // Structure API Platform avec 'hydra:member'
    items = response.data['hydra:member'];
    total = response.data['hydra:totalItems'] || items.length;
  } else {
    // Parcourir toutes les clés pour trouver un tableau
    for (const key in response.data) {
      if (Array.isArray(response.data[key])) {
        items = response.data[key];
        break;
      }
    }
    
    // Chercher une clé pour le total
    for (const key in response.data) {
      if (key.includes('total') || key.includes('Total') || key.includes('count') || key.includes('Count')) {
        total = response.data[key];
        break;
      }
    }
  }

  // Vérifier que items est bien un tableau
  if (!Array.isArray(items)) {
    console.error('Données extraites non valides:', items);
    items = [];
  }

  return { items, total };
};

/**
 * Fonction utilitaire pour construire les paramètres de requête API
 * @param {Object} options - Options de requête
 * @returns {Object} - Paramètres normalisés
 */
export const buildApiParams = (options) => {
  const { page = 1, limit = 10, sortBy, sortOrder, filters = {} } = options;
  
  // Construire les paramètres de base
  const params = { ...filters };
  
  // Ajouter les paramètres de pagination
  params.page = page;
  params.itemsPerPage = limit;
  
  // Ajouter les paramètres de tri
  if (sortBy && sortOrder) {
    params[`order[${sortBy}]`] = sortOrder.toLowerCase();
    // Supprimer les paramètres de tri originaux si présents dans les filtres
    delete params.sortBy;
    delete params.sortOrder;
  }
  
  return params;
};

/**
 * Fonction utilitaire pour gérer les erreurs API
 * @param {Error} error - Erreur survenue
 * @param {string} context - Contexte de l'erreur
 */
export const handleApiError = (error, context = '') => {
  console.error(`Erreur API ${context ? `(${context})` : ''}:`, error);
  
  // Extraire les détails de l'erreur si disponibles
  const errorDetails = error.response?.data || 'Pas de détails disponibles';
  console.error('Détails de l\'erreur:', errorDetails);
  
  return {
    message: error.message || 'Une erreur est survenue',
    details: errorDetails,
    status: error.response?.status
  };
}; 