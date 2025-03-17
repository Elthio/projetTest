import axios from 'axios';

// Vérifier que l'URL de l'API est correcte
const API_URL = 'http://localhost:8000';

console.log('Configuration de l\'API avec l\'URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/ld+json',
    'Accept': 'application/ld+json',
  },
  withCredentials: false,
  timeout: 10000,
});

// Tester la connexion à l'API
const testApiConnection = async () => {
  try {
    console.log('Test de connexion à l\'API...');
    const response = await axios.get(`${API_URL}/api/energies`);
    console.log('Connexion à l\'API réussie:', response.status);
    console.log('Données reçues:', response.data);
    return true;
  } catch (error) {
    console.error('Erreur de connexion à l\'API:', error.message);
    return false;
  }
};

// Exécuter le test de connexion
testApiConnection();

// Ajouter un intercepteur pour les requêtes
api.interceptors.request.use(
  config => {
    console.log('Requête API en cours:', {
      url: config.url,
      method: config.method,
      params: config.params,
      headers: config.headers,
      data: config.data
    });
    
    // S'assurer que les en-têtes CORS sont correctement configurés
    config.headers = {
      ...config.headers,
      'Access-Control-Allow-Origin': '*',
    };
    
    return config;
  },
  error => {
    console.error('Erreur lors de la requête API:', error);
    return Promise.reject(error);
  }
);

// Ajouter un intercepteur pour les réponses
api.interceptors.response.use(
  response => {
    console.log('Réponse API reçue:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Erreur API:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    // Améliorer le message d'erreur
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'erreur
      error.message = `Erreur ${error.response.status}: ${error.response.data?.message || 'Erreur serveur'}`;
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      error.message = 'Aucune réponse reçue du serveur. Vérifiez votre connexion.';
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      error.message = 'Erreur de configuration de la requête.';
    }
    
    return Promise.reject(error);
  }
);

export default api; 