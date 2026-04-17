import api from './api';

const ORDERS_URL = '/orders';

const orderService = {

  // createOrder: async (orderData) => {
  //   try {
  //     const response = await api.post(ORDERS_URL, orderData);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Create order error:', error);
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || 'Failed to create order'
  //     };
  //   }
  // },

  /**
   * Get logged in user's orders (User only)
   * @returns {Promise<Array>} User's orders
   */
  getUserOrders: async () => {
    try {
      const response = await api.get(ORDERS_URL);
      return response.data?.orders || [];
    } catch (error) {
      console.error('Get user orders error:', error);
      return [];
    }
  },

  /**
   * Get single order by ID (User only)
   * @param {string} id - Order ID
   * @returns {Promise<Object|null>} Order object
   */
  getOrderById: async (id) => {
    try {
      const response = await api.get(`${ORDERS_URL}/${id}`);
      return response.data?.order || null;
    } catch (error) {
      console.error('Get order by ID error:', error);
      return null;
    }
  },

  /**
   * Cancel order (User only)
   * @param {string} id - Order ID
   * @returns {Promise<Object>} Cancellation response
   */
  cancelOrder: async (id) => {
    try {
      const response = await api.put(`${ORDERS_URL}/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel order'
      };
    }
  },

  // ... existing methods ...

  // Get all orders (admin)
  // In src/services/orderService.js

getAllOrders: async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = queryParams.toString() 
      ? `/orders/admin/all?${queryParams.toString()}`
      : '/orders/admin/all';
    
    console.log('Fetching orders from:', url);
    const response = await api.get(url);
    console.log('Orders response:', response.data);
    
    // Handle different response structures
    if (response.data?.orders) {
      return response.data.orders;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error('Get all orders error:', error);
    return [];
  }
},

  // Get order statistics (admin)
  getOrderStats: async () => {
    try {
      const response = await api.get(`${ORDERS_URL}/admin/stats`);
      return response.data?.stats || {};
    } catch (error) {
      console.error('Get order stats error:', error);
      return {};
    }
  },

  // Update order status (admin)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`${ORDERS_URL}/${id}`, { status });
      return response.data;
    } catch (error) {
      console.error('Update order status error:', error);
      return { success: false, message: error.response?.data?.message };
    }
  },

  /**
 * Create new order (User only)
 * @param {Object} orderData - Order data
 * @returns {Promise<Object>} Created order
 */
// In src/services/orderService.js

createOrder: async (orderData) => {
  try {
    console.log('Creating order with data:', orderData);
    const response = await api.post(ORDERS_URL, orderData);
    console.log('Create order response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create order error:', error);
    console.error('Error response:', error.response?.data);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create order'
    };
  }
},
// Add to orderService.js
deleteOrder: async (id) => {
  try {
    await api.delete(`/orders/${id}`);
    return true;
  } catch (error) {
    console.error('Delete order error:', error);
    return false;
  }
},
};

export default orderService;