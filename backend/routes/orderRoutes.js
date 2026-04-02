const express = require('express');
const router = express.Router();
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');
const {
  createOrder,
  getUserOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  cancelOrder
} = require('../controllers/orderController');

// ==================== USER ROUTES ====================

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (User only)
router.post('/', protectUser, createOrder);

// @route   GET /api/orders
// @desc    Get logged in user's orders
// @access  Private (User only)
router.get('/', protectUser, getUserOrders);

// @route   GET /api/orders/my-orders
// @desc    Get user's orders (alternative endpoint)
// @access  Private (User only)
router.get('/my-orders', protectUser, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private (User only)
router.get('/:id', protectUser, getSingleOrder);

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order (user)
// @access  Private (User only)
router.put('/:id/cancel', protectUser, cancelOrder);

// ==================== ADMIN ROUTES ====================

// @route   PUT /api/orders/:id
// @desc    Update order status (admin)
// @access  Private (Admin only)
router.put('/:id', protectAdmin, updateOrderStatus);

// @route   GET /api/orders/admin/all
// @desc    Get all orders (admin)
// @access  Private (Admin only)
router.get('/admin/all', protectAdmin, getAllOrders);

// @route   GET /api/orders/admin/stats
// @desc    Get order statistics (admin dashboard)
// @access  Private (Admin only)
router.get('/admin/stats', protectAdmin, getOrderStats);

module.exports = router;