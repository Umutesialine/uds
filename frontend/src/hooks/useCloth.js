import { useState, useEffect, useCallback } from 'react';
import clothService from '../services/clothService';

/**
 * Custom hook for cloth operations
 * Provides state management for loading, error, and data
 */
export const useCloth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /**
   * Fetch all clothes with filters
   */
  const fetchClothes = useCallback(async (filters = {}, reset = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clothService.getAllClothes(filters);
      
      if (response.success) {
        if (reset) {
          setProducts(response.clothes || []);
        } else {
          setProducts(prev => [...prev, ...(response.clothes || [])]);
        }
        setTotal(response.total || 0);
        setHasMore(response.clothes?.length === (filters.limit || 10));
        return response;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch single cloth by ID
   */
  const fetchClothById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clothService.getClothById(id);
      
      if (response.success) {
        return response.cloth;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search clothes
   */
  const searchClothes = useCallback(async (query, filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clothService.searchClothes(query, filters);
      
      if (response.success) {
        setProducts(response.results || []);
        return response;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Add new cloth
   */
  const addCloth = useCallback(async (clothData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clothService.addCloth(clothData);
      
      if (response.success) {
        return response.cloth;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update cloth
   */
  const updateCloth = useCallback(async (id, clothData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clothService.updateCloth(id, clothData);
      
      if (response.success) {
        return response.cloth;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete cloth
   */
  const deleteCloth = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clothService.deleteCloth(id);
      
      if (response.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update stock
   */
  const updateStock = useCallback(async (id, stock) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await clothService.updateStock(id, stock);
      
      if (response.success) {
        setProducts(prev => prev.map(p => 
          p._id === id ? { ...p, stock } : p
        ));
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = () => setError(null);

  return {
    // State
    loading,
    error,
    products,
    total,
    page,
    hasMore,
    
    // Actions
    fetchClothes,
    fetchClothById,
    searchClothes,
    addCloth,
    updateCloth,
    deleteCloth,
    updateStock,
    clearError,
    setPage,
  };
};

export default useCloth;