import api from './api';

const AUTH_URL = '/auth';

/**
 * Authentication Service - Handles all auth-related API operations
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response with token and user data
   */
  register: async (userData) => {
    try {
      const response = await api.post(`${AUTH_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  /**
   * Login user (uses email + password)
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Login response with token and user data
   */
  login: async (email, password) => {
    try {
      const response = await api.post(`${AUTH_URL}/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  /**
   * Login admin (uses email + password - same as user)
   * @param {string} email - Admin's email
   * @param {string} password - Admin's password
   * @returns {Promise<Object>} Login response with token and admin data
   */
  adminLogin: async (email, password) => {
    try {
      const response = await api.post(`${AUTH_URL}/admin/login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Admin login failed'
      };
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await api.get(`${AUTH_URL}/user/profile`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get profile'
      };
    }
  },

  /**
   * Get admin profile
   * @returns {Promise<Object>} Admin profile data
   */
  getAdminProfile: async () => {
    try {
      const response = await api.get(`${AUTH_URL}/admin/profile`);
      return response.data;
    } catch (error) {
      console.error('Get admin profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to get admin profile'
      };
    }
  },

  /**
   * Change user password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change response
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.put(`${AUTH_URL}/user/change-password`, { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change password'
      };
    }
  },

  /**
   * ✅ NEW: Change admin password
   * @param {string} oldPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change response
   */
  changeAdminPassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.put(`${AUTH_URL}/admin/change-password`, { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      console.error('Change admin password error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change admin password'
      };
    }
  },

  /**
   * Verify token
   * @returns {Promise<Object>} Token verification response
   */
  verifyToken: async () => {
    try {
      const response = await api.get(`${AUTH_URL}/verify`);
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid token'
      };
    }
  },

  /**
   * Logout user (clear local storage)
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if token exists
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  changePassword: async (oldPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Token in changePassword:', !!token);
    
    const response = await api.put(`${AUTH_URL}/user/change-password`, { oldPassword, newPassword });
    console.log('Change password response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error);
    console.error('Error response:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to change password'
    };
  }
},

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get auth token
   * @returns {string|null} JWT token or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;