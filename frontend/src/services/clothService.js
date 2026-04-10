import api from './api';
import { handleApiError } from '../utils/errorHandler';

// Base URL for cloth endpoints
const CLOTHES_URL = '/clothes';

/**
 * Cloth Service - Handles all cloth-related API operations
 * Includes CRUD operations, search, filters, and stock management
 */
const clothService = {
  /**
   * Get all clothes with optional filters
   * @param {Object} params - Filter parameters
   * @param {string} params.category - Filter by category (men/women/kids)
   * @param {string} params.style - Filter by style (Kitenge/modern)
   * @param {number} params.minPrice - Minimum price filter
   * @param {number} params.maxPrice - Maximum price filter
   * @param {boolean} params.inStock - Show only in-stock items
   * @param {string} params.search - Search by name or description
   * @param {string} params.sortBy - Sort by (price_asc, price_desc, newest, oldest)
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} List of clothes with pagination
   */
  getAllClothes: async (params = {}) => {
  try {
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

    // 🔥 NORMALIZE HERE
    return response.data?.clothes || response.data || [];
    
  } catch (error) {
    console.error(error);

    // 🔥 ALWAYS return safe value
    return [];
  }
},

  /**
   * Get single cloth by ID
   * @param {string} id - Cloth ID
   * @returns {Promise<Object>} Cloth details
   */
  getClothById: async (id) => {
    try {
      const response = await api.get(`${CLOTHES_URL}/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Search clothes by keyword
   * @param {string} query - Search keyword
   * @param {Object} filters - Additional filters
   * @returns {Promise<Object>} Search results
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
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get clothes by category
   * @param {string} category - Category (men/women/kids)
   * @param {boolean} inStock - Filter by stock availability
   * @returns {Promise<Object>} Filtered clothes
   */
  getClothesByCategory: async (category, inStock = false) => {
    try {
      const url = inStock 
        ? `${CLOTHES_URL}/category/${category}?inStock=true`
        : `${CLOTHES_URL}/category/${category}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get clothes by style
   * @param {string} style - Style (Kitenge/modern)
   * @param {boolean} inStock - Filter by stock availability
   * @returns {Promise<Object>} Filtered clothes
   */
  getClothesByStyle: async (style, inStock = false) => {
    try {
      const url = inStock 
        ? `${CLOTHES_URL}/style/${style}?inStock=true`
        : `${CLOTHES_URL}/style/${style}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Add new cloth (Admin only)
   * @param {FormData|Object} clothData - Cloth data (supports form-data for images)
   * @returns {Promise<Object>} Created cloth
   */
  addCloth: async (clothData) => {
    try {
      const isFormData = clothData instanceof FormData;
      const response = await api.post(CLOTHES_URL, clothData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update cloth (Admin only)
   * @param {string} id - Cloth ID
   * @param {FormData|Object} clothData - Updated cloth data
   * @returns {Promise<Object>} Updated cloth
   */
  updateCloth: async (id, clothData) => {
    try {
      const isFormData = clothData instanceof FormData;
      const response = await api.put(`${CLOTHES_URL}/${id}`, clothData, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Delete cloth (Admin only)
   * @param {string} id - Cloth ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteCloth: async (id) => {
    try {
      const response = await api.delete(`${CLOTHES_URL}/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update cloth stock (Admin only)
   * @param {string} id - Cloth ID
   * @param {number} stock - New stock quantity
   * @returns {Promise<Object>} Updated cloth
   */
  updateStock: async (id, stock) => {
    try {
      const response = await api.patch(`${CLOTHES_URL}/${id}/stock`, { stock });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get low stock alerts (Admin only)
   * @param {number} threshold - Stock threshold (default: 10)
   * @returns {Promise<Object>} Low stock items
   */
  getLowStockAlerts: async (threshold = 10) => {
    try {
      const response = await api.get(`${CLOTHES_URL}/admin/low-stock?threshold=${threshold}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get out of stock clothes (Admin only)
   * @returns {Promise<Object>} Out of stock items
   */
  getOutOfStockClothes: async () => {
    try {
      const response = await api.get(`${CLOTHES_URL}/admin/out-of-stock`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get featured products (with discounts)
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Object>} Featured products
   */
  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await api.get(`${CLOTHES_URL}?discount=true&limit=${limit}&inStock=true`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get product statistics (Admin only)
   * @returns {Promise<Object>} Product statistics
   */
  getProductStats: async () => {
    try {
      const response = await api.get(`${CLOTHES_URL}/admin/stats`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
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
      return handleApiError(error);
    }
  },

  /**
   * Get related products based on category and style
   * @param {string} clothId - Current cloth ID
   * @param {string} category - Category
   * @param {string} style - Style
   * @param {number} limit - Number of related products
   * @returns {Promise<Object>} Related products
   */
  getRelatedProducts: async (clothId, category, style, limit = 4) => {
    try {
      const response = await api.get(`${CLOTHES_URL}/related/${clothId}?category=${category}&style=${style}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Prepare form data for cloth with image
   * @param {Object} clothData - Cloth data object
   * @param {File} imageFile - Image file
   * @returns {FormData} FormData ready for upload
   */
  prepareFormData: (clothData, imageFile = null) => {
    const formData = new FormData();
    
    formData.append('name', clothData.name);
    formData.append('price', clothData.price);
    formData.append('category', clothData.category);
    formData.append('style', clothData.style);
    formData.append('description', clothData.description);
    formData.append('stock', clothData.stock);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    if (clothData.discount) {
      formData.append('discount', clothData.discount);
    }
    
    if (clothData.sizes && clothData.sizes.length) {
      formData.append('sizes', JSON.stringify(clothData.sizes));
    }
    
    if (clothData.colors && clothData.colors.length) {
      formData.append('colors', JSON.stringify(clothData.colors));
    }
    
    return formData;
  },

  /**
   * Format price for display
   * @param {number} price - Price in TZS
   * @returns {string} Formatted price
   */
  formatPrice: (price) => {
    return `TSh ${price.toLocaleString()}`;
  },

  /**
   * Get stock status text and color
   * @param {number} stock - Stock quantity
   * @returns {Object} Status text and color
   */
  getStockStatus: (stock) => {
    if (stock <= 0) {
      return { text: 'Out of Stock', color: 'red', badge: 'sold-out' };
    }
    if (stock < 10) {
      return { text: `Only ${stock} left`, color: 'orange', badge: 'limited' };
    }
    return { text: 'In Stock', color: 'green', badge: 'available' };
  }
};

export default clothService;