import { useState, useEffect, useRef } from 'react';

/**
 * Hook personnalisé pour gérer les appels API de manière optimisée
 * @param {Function} apiCall - Fonction qui effectue l'appel API
 * @param {Array} dependencies - Dépendances qui déclenchent un nouvel appel API
 * @param {Object} options - Options supplémentaires
 * @returns {Object} - Données, état de chargement et erreur
 */
const useApi = (apiCall, dependencies = [], options = {}) => {
  const { initialData = null, onSuccess = null, onError = null } = options;
  
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Référence pour éviter les appels dupliqués
  const isLoadingRef = useRef(false);
  
  // Référence pour stocker la dernière requête
  const lastRequestRef = useRef(null);
  
  useEffect(() => {
    // Fonction pour effectuer l'appel API
    const fetchData = async () => {
      // Si un chargement est déjà en cours, ne pas en démarrer un nouveau
      if (isLoadingRef.current) {
        console.log('useApi - Un chargement est déjà en cours, ignoré');
        return;
      }
      
      // Marquer comme en cours de chargement
      isLoadingRef.current = true;
      setLoading(true);
      
      try {
        // Effectuer l'appel API
        const result = await apiCall();
        
        // Mettre à jour les données
        setData(result);
        setError(null);
        
        // Appeler le callback de succès si défini
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err) {
        console.error('useApi - Erreur lors de l\'appel API:', err);
        setError(err);
        
        // Appeler le callback d'erreur si défini
        if (onError) {
          onError(err);
        }
      } finally {
        // Marquer comme terminé
        setLoading(false);
        isLoadingRef.current = false;
      }
    };
    
    // Effectuer l'appel API
    fetchData();
    
    // Nettoyage
    return () => {
      // Annuler la requête si possible
      if (lastRequestRef.current && lastRequestRef.current.cancel) {
        lastRequestRef.current.cancel();
      }
    };
  }, dependencies);
  
  // Fonction pour recharger les données
  const refetch = async () => {
    // Si un chargement est déjà en cours, ne pas en démarrer un nouveau
    if (isLoadingRef.current) {
      console.log('useApi - Un chargement est déjà en cours, ignoré');
      return;
    }
    
    // Marquer comme en cours de chargement
    isLoadingRef.current = true;
    setLoading(true);
    
    try {
      // Effectuer l'appel API
      const result = await apiCall();
      
      // Mettre à jour les données
      setData(result);
      setError(null);
      
      // Appeler le callback de succès si défini
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('useApi - Erreur lors de l\'appel API:', err);
      setError(err);
      
      // Appeler le callback d'erreur si défini
      if (onError) {
        onError(err);
      }
    } finally {
      // Marquer comme terminé
      setLoading(false);
      isLoadingRef.current = false;
    }
  };
  
  return { data, loading, error, refetch };
};

export default useApi; 