import api from './api';

const BOOKINGS_URL = '/bookings';

const bookingService = {
  /**
   * Create new booking (User only)
   * @param {Object} bookingData - { cloth, measurements, preferredDate }
   * @returns {Promise<Object>} Created booking
   */
  createBooking: async (bookingData) => {
    try {
      const response = await api.post(BOOKINGS_URL, bookingData);
      return response.data;
    } catch (error) {
      console.error('Create booking error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create booking'
      };
    }
  },

  /**
   * Get logged in user's bookings
   * @returns {Promise<Array>} User's bookings
   */
  getUserBookings: async () => {
    try {
      const response = await api.get(BOOKINGS_URL);
      // Your backend returns: { success: true, bookings: [...] }
      const bookings = response.data?.bookings || [];
      return Array.isArray(bookings) ? bookings : [];
    } catch (error) {
      console.error('Get user bookings error:', error);
      return [];
    }
  },

  /**
   * Get single booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise<Object|null>} Booking object
   */
  getBookingById: async (id) => {
    try {
      const response = await api.get(`${BOOKINGS_URL}/${id}`);
      return response.data?.booking || response.data || null;
    } catch (error) {
      console.error('Get booking by ID error:', error);
      return null;
    }
  },

  /**
   * Cancel booking (User only)
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Cancellation response
   */
  cancelBooking: async (id) => {
    try {
      const response = await api.put(`${BOOKINGS_URL}/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel booking'
      };
    }
  },

  /**
   * Update measurements (User only)
   * @param {string} id - Booking ID
   * @param {string} measurements - New measurements
   * @returns {Promise<Object>} Update response
   */
  updateMeasurements: async (id, measurements) => {
    try {
      const response = await api.put(`${BOOKINGS_URL}/${id}/measurements`, { measurements });
      return response.data;
    } catch (error) {
      console.error('Update measurements error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update measurements'
      };
    }
  },

  // ==================== ADMIN METHODS ====================

  /**
   * Get all bookings (Admin only)
   * @param {Object} params - Filter params { status, page, limit }
   * @returns {Promise<Array>} All bookings
   */
  getAllBookings: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const url = queryParams.toString() 
        ? `/bookings/admin/all?${queryParams.toString()}`
        : '/bookings/admin/all';
      
      const response = await api.get(url);
      return response.data?.bookings || [];
    } catch (error) {
      console.error('Get all bookings error:', error);
      return [];
    }
  },

  /**
   * Get bookings by status (Admin only)
   * @param {string} status - pending/confirmed/in-progress/completed/cancelled
   * @returns {Promise<Array>} Filtered bookings
   */
  getBookingsByStatus: async (status) => {
    try {
      const response = await api.get(`/bookings/admin/status/${status}`);
      return response.data?.bookings || [];
    } catch (error) {
      console.error('Get bookings by status error:', error);
      return [];
    }
  },

  /**
   * Get booking statistics (Admin only)
   * @returns {Promise<Object>} Booking statistics
   */
  getBookingStats: async () => {
    try {
      const response = await api.get('/bookings/admin/stats');
      return response.data?.stats || {};
    } catch (error) {
      console.error('Get booking stats error:', error);
      return {};
    }
  },

  /**
   * Get today's bookings (Admin only)
   * @returns {Promise<Array>} Today's bookings
   */
 // In src/services/bookingService.js

getTodaysBookings: async () => {
  try {
    const response = await api.get('/bookings/admin/today');
    console.log('Today\'s bookings response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get today\'s bookings error:', error);
    return { bookings: [] };
  }
},

  /**
   * Update booking status (Admin only)
   * @param {string} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Update response
   */
  updateBookingStatus: async (id, status) => {
    try {
      const response = await api.put(`/bookings/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update booking status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update booking status'
      };
    }
  },
  // Add to bookingService.js
deleteBooking: async (id) => {
  try {
    await api.delete(`/bookings/${id}`);
    return true;
  } catch (error) {
    console.error('Delete booking error:', error);
    return false;
  }
},
};

export default bookingService;