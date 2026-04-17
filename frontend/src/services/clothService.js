import api from './api';

// Base URL for cloth endpoints
const CLOTHES_URL = '/clothes';

/**
 * Normalize API response to always return array of valid products
 * @param {Object} response - Axios response object
 * @returns {Array} Array of valid products
 */
const normalizeClothesResponse = (response) => {
  // Extract clothes array from response
  const clothes = response?.data?.clothes;
  
  // Validate it's an array
  if (!Array.isArray(clothes)) {
    console.error('[clothService] Invalid API response format:', response?.data);
    return [];
  }
  
  // Filter out any invalid items (null, undefined, or missing _id)
  return clothes.filter(item => item && item._id);
};

/**
 * Cloth Service - Handles all cloth-related API operations
 * ✅ RULE: EVERY function returns Array<Product>
 */
const clothService = {
  /**
   * Get all clothes with optional filters
   * @param {Object} params - Filter parameters
   * @returns {Promise<Array>} ALWAYS returns array of products
   */
  getAllClothes: async (params = {}) => {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.style) queryParams.append('style', params.style);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
      if (params.inStock === true) queryParams.append('inStock', 'true');
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = queryParams.toString() 
        ? `${CLOTHES_URL}?${queryParams.toString()}`
        : CLOTHES_URL;
      
      const response = await api.get(url);
      
      // ✅ SIMPLE: Always return array, never undefined/null
      return normalizeClothesResponse(response);
      
    } catch (error) {
      console.error('[clothService] getAllClothes error:', error);
      return []; // ✅ ALWAYS return empty array on error
    }
  },

  /**
   * Get single cloth by ID
   * @param {string} id - Cloth ID
   * @returns {Promise<Object|null>} Returns product object or null
   */
  getClothById: async (id) => {
    try {
      const response = await api.get(`${CLOTHES_URL}/${id}`);
      
      // Extract cloth from response
      const cloth = response?.data?.cloth || response?.data?.data || response?.data;
      
      if (cloth && cloth._id) {
        return cloth;
      }
      
      console.warn(`[clothService] Product ${id} not found`);
      return null;
      
    } catch (error) {
      console.error('[clothService] getClothById error:', error);
      return null;
    }
  },

  /**
   * Search clothes by keyword
   * @param {string} query - Search keyword
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} ALWAYS returns array of products
   */
  searchClothes: async (query, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.style) queryParams.append('style', filters.style);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      
      const response = await api.get(`${CLOTHES_URL}/search?${queryParams.toString()}`);
      
      // Extract results array (API might return { results: [...] } or { clothes: [...] })
      const results = response?.data?.results || response?.data?.clothes;
      
      if (!Array.isArray(results)) {
        return [];
      }
      
      return results.filter(item => item && item._id);
      
    } catch (error) {
      console.error('[clothService] searchClothes error:', error);
      return [];
    }
  },

  /**
   * Add new cloth (Admin only)
   * @param {FormData|Object} clothData - Cloth data
   * @returns {Promise<Object|null>} Returns created product or null
   */
  // In clothService.js, make sure addCloth method handles FormData
addCloth: async (clothData) => {
  try {
    // Check if data is FormData (for file upload)
    const isFormData = clothData instanceof FormData;
    
    const response = await api.post(CLOTHES_URL, clothData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
    });
    
    return response.data;
  } catch (error) {
    console.error('Add cloth error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add cloth'
    };
  }
},

  /**
   * Update cloth (Admin only)
   * @param {string} id - Cloth ID
   * @param {FormData|Object} clothData - Updated cloth data
   * @returns {Promise<Object|null>} Returns updated product or null
   */
  updateCloth: async (id, clothData) => {
    try {
      const isFormData = clothData instanceof FormData;
      const response = await api.put(`${CLOTHES_URL}/${id}`, clothData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      
      const updatedProduct = response?.data?.cloth || response?.data?.data || response?.data;
      
      if (updatedProduct && updatedProduct._id) {
        return updatedProduct;
      }
      
      return null;
      
    } catch (error) {
      console.error('[clothService] updateCloth error:', error);
      return null;
    }
  },

  /**
   * Delete cloth (Admin only)
   * @param {string} id - Cloth ID
   * @returns {Promise<boolean>} Returns true if successful
   */
  deleteCloth: async (id) => {
    try {
      await api.delete(`${CLOTHES_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('[clothService] deleteCloth error:', error);
      return false;
    }
  },

  /**
   * Get image URL (converts relative path to full URL)
   * @param {string} imagePath - Image path from backend
   * @returns {string} Full image URL
   */
  getImageUrl: (imagePath) => {
    if (!imagePath) return '/placeholder-image.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
  },

  /**
   * Get low stock alerts (Admin only)
   * @param {number} threshold - Stock threshold (default: 10)
   * @returns {Promise<Array>} Low stock products
   */
  getLowStockAlerts: async (threshold = 10) => {
    try {
      const response = await api.get(`${CLOTHES_URL}/admin/low-stock?threshold=${threshold}`);
      return response.data?.clothes || [];
    } catch (error) {
      console.error('Get low stock alerts error:', error);
      return [];
    }
  },

  /**
   * Get out of stock clothes (Admin only)
   * @returns {Promise<Array>} Out of stock products
   */
  getOutOfStockClothes: async () => {
    try {
      const response = await api.get(`${CLOTHES_URL}/admin/out-of-stock`);
      return response.data?.clothes || [];
    } catch (error) {
      console.error('Get out of stock error:', error);
      return [];
    }
  },

  /**
   * Update stock only (Admin only)
   * @param {string} id - Cloth ID
   * @param {number} stock - New stock quantity
   * @returns {Promise<Object>} Updated cloth
   */
  updateStock: async (id, stock) => {
    try {
      const response = await api.patch(`${CLOTHES_URL}/${id}/stock`, { stock });
      return response.data;
    } catch (error) {
      console.error('Update stock error:', error);
      return { success: false, message: error.response?.data?.message };
    }
  },

  /**
   * Get product statistics (Admin only)
   * @returns {Promise<Object>} Product statistics
   */
  getProductStats: async () => {
    try {
      const response = await api.get(`${CLOTHES_URL}/admin/stats`);
      return response.data?.stats || {};
    } catch (error) {
      console.error('Get product stats error:', error);
      return {};
    }
  },

  /**
   * Bulk upload clothes (Admin only)
   * @param {Array} clothes - Array of cloth objects
   * @returns {Promise<Object>} Bulk upload result
   */
  bulkUploadClothes: async (clothes) => {
    try {
      const response = await api.post(`${CLOTHES_URL}/bulk`, { clothes });
      return response.data;
    } catch (error) {
      console.error('Bulk upload error:', error);
      return { success: false, message: error.response?.data?.message };
    }
  },

  /**
   * Get related products based on category and style
   * @param {string} clothId - Current cloth ID
   * @param {string} category - Category
   * @param {string} style - Style
   * @param {number} limit - Number of related products
   * @returns {Promise<Array>} Related products
   */
  getRelatedProducts: async (clothId, category, style, limit = 4) => {
    try {
      const response = await api.get(`${CLOTHES_URL}/related/${clothId}?category=${category}&style=${style}&limit=${limit}`);
      return response.data?.clothes || [];
    } catch (error) {
      console.error('Get related products error:', error);
      return [];
    }
  },

  /**
   * Get image URL (converts relative path to full URL)
   * @param {string} imagePath - Image path from backend
   * @returns {string} Full image URL
   */
  getImageUrl: (imagePath) => {
    if (!imagePath) return '/images/placeholder.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
  },

  /**
   * Format price for display
   * @param {number} price - Price in RWF
   * @returns {string} Formatted price
   */
  formatPrice: (price) => {
    return `${price.toLocaleString()} RWF`;
  },

  /**
   * Get stock status text and color
   * @param {number} stock - Stock quantity
   * @returns {Object} Status text and color
   */
  getStockStatus: (stock) => {
    if (stock <= 0) {
      return { text: 'Out of Stock', color: 'red', badge: 'out-of-stock' };
    }
    if (stock < 10) {
      return { text: `Only ${stock} left`, color: 'orange', badge: 'low-stock' };
    }
    return { text: 'In Stock', color: 'green', badge: 'in-stock' };
  }
};

export default clothService;