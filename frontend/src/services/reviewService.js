import api from './api';

const REVIEWS_URL = '/reviews';

const reviewService = {
  /**
   * Add a new review (User only)
   * @param {Object} reviewData - { cloth, rating, comment }
   * @returns {Promise<Object>} Created review
   */
  addReview: async (reviewData) => {
    try {
      const response = await api.post(REVIEWS_URL, reviewData);
      return response.data;
    } catch (error) {
      console.error('Add review error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add review'
      };
    }
  },

  /**
   * Get all reviews for a specific cloth (Public)
   * @param {string} clothId - Cloth ID
   * @param {Object} params - Pagination params { page, limit }
   * @returns {Promise<Object>} Reviews with pagination
   */
  getClothReviews: async (clothId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = queryParams.toString() 
        ? `${REVIEWS_URL}/${clothId}?${queryParams.toString()}`
        : `${REVIEWS_URL}/${clothId}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get cloth reviews error:', error);
      return { success: false, reviews: [], total: 0 };
    }
  },

  /**
   * Get user's own reviews (User only)
   * @returns {Promise<Array>} User's reviews
   */
  getMyReviews: async () => {
    try {
      const response = await api.get(`${REVIEWS_URL}/my-reviews`);
      return response.data?.reviews || [];
    } catch (error) {
      console.error('Get my reviews error:', error);
      return [];
    }
  },

  /**
   * Update user's own review (User only)
   * @param {string} id - Review ID
   * @param {Object} reviewData - { rating, comment }
   * @returns {Promise<Object>} Updated review
   */
  updateReview: async (id, reviewData) => {
    try {
      const response = await api.put(`${REVIEWS_URL}/${id}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Update review error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update review'
      };
    }
  },

  /**
   * Delete user's own review (User only)
   * @param {string} id - Review ID
   * @returns {Promise<boolean>} Success status
   */
  deleteMyReview: async (id) => {
    try {
      await api.delete(`${REVIEWS_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Delete review error:', error);
      return false;
    }
  },

  // ==================== ADMIN METHODS ====================

  /**
   * Get all reviews (Admin only)
   * @param {Object} params - Filter params { rating, page, limit }
   * @returns {Promise<Array>} All reviews
   */
  getAllReviews: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.rating) queryParams.append('rating', params.rating);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = queryParams.toString() 
        ? `/reviews/admin/all?${queryParams.toString()}`
        : '/reviews/admin/all';
      
      const response = await api.get(url);
      return response.data?.reviews || [];
    } catch (error) {
      console.error('Get all reviews error:', error);
      return [];
    }
  },

  /**
   * Delete any review by admin (Admin only)
   * @param {string} id - Review ID
   * @returns {Promise<boolean>} Success status
   */
  deleteReviewByAdmin: async (id) => {
    try {
      await api.delete(`/reviews/admin/${id}`);
      return true;
    } catch (error) {
      console.error('Admin delete review error:', error);
      return false;
    }
  },

  /**
   * Get review statistics for a cloth
   * @param {string} clothId - Cloth ID
   * @returns {Promise<Object>} Rating stats
   */
  getReviewStats: async (clothId) => {
    try {
      const response = await api.get(`${REVIEWS_URL}/cloth/${clothId}/stats`);
      return response.data?.stats || { averageRating: 0, totalReviews: 0 };
    } catch (error) {
      console.error('Get review stats error:', error);
      return { averageRating: 0, totalReviews: 0 };
    }
  },

  /**
   * Get recent reviews (for homepage)
   * @param {number} limit - Number of reviews
   * @returns {Promise<Array>} Recent reviews
   */
  getRecentReviews: async (limit = 6) => {
    try {
      const response = await api.get(`${REVIEWS_URL}/recent?limit=${limit}`);
      return response.data?.reviews || [];
    } catch (error) {
      console.error('Get recent reviews error:', error);
      return [];
    }
  }
};

export default reviewService;