import api from './api';

const USERS_URL = '/auth';

const userService = {
  /**
   * Get all users (Admin only)
   * @returns {Promise<Array>} List of all users
   */
  getAllUsers: async () => {
    try {
      const response = await api.get(`${USERS_URL}/all`);
      return response.data?.users || [];
    } catch (error) {
      console.error('Get all users error:', error);
      return [];
    }
  },

  /**
   * Get user by ID (Admin only)
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object
   */
  getUserById: async (id) => {
    try {
      const response = await api.get(`${USERS_URL}/user/${id}`);
      return response.data?.user || null;
    } catch (error) {
      console.error('Get user by ID error:', error);
      return null;
    }
  },

  /**
   * Delete user (Admin only)
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  deleteUser: async (id) => {
    try {
      await api.delete(`${USERS_URL}/${id}`);
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      return false;
    }
  },

  /**
   * Update user (Admin only)
   * @param {string} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object|null>} Updated user
   */
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`${USERS_URL}/${id}`, userData);
      return response.data?.user || null;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  }
};

export default userService;