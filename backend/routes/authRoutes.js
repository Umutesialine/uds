const express = require('express');
const router = express.Router();
const {
  // Admin auth
  loginAdmin,
  changeAdminPassword,
  getAdminProfile,
  
  // User auth
  registerUser,
  loginUser,
  changeUserPassword,
  getUserProfile,
  
  // Common
  verifyToken
} = require('../controllers/authController');
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');

// ==================== USER AUTH ROUTES ====================

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user (SIMPLIFIED - matches Postman test)
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/auth/user/login
// @desc    Login user (alternative endpoint)
// @access  Public
router.post('/user/login', loginUser);

// @route   GET /api/auth/user/profile
// @desc    Get user profile
// @access  Private (User only)
router.get('/user/profile', protectUser, getUserProfile);

// @route   PUT /api/auth/user/change-password
// @desc    Change user password
// @access  Private (User only)
router.put('/user/change-password', protectUser, changeUserPassword);

// ==================== ADMIN AUTH ROUTES ====================

// @route   POST /api/auth/admin/login
// @desc    Login admin
// @access  Public
router.post('/admin/login', loginAdmin);

// @route   POST /api/auth/login/admin
// @desc    Login admin (alternative endpoint)
// @access  Public
router.post('/login/admin', loginAdmin);

// @route   GET /api/auth/admin/profile
// @desc    Get admin profile
// @access  Private (Admin only)
router.get('/admin/profile', protectAdmin, getAdminProfile);

// @route   PUT /api/auth/admin/change-password
// @desc    Change admin password
// @access  Private (Admin only)
router.put('/admin/change-password', protectAdmin, changeAdminPassword);

// ==================== COMMON ROUTES ====================

// @route   GET /api/auth/verify
// @desc    Verify token and get user/admin info
// @access  Private
router.get('/verify', verifyToken);

module.exports = router;