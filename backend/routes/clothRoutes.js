const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  // Basic CRUD
  addCloth,
  getAllClothes,
  getSingleCloth,
  updateCloth,
  deleteCloth,
  
  // Advanced features
  searchClothes,
  getClothesByCategory,
  getClothesByStyle,
  getLowStockClothes,
  getOutOfStockClothes,
  updateStock
} = require('../controllers/clothController');

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/clothes
// @desc    Get all clothes (with search & filters)
// @access  Public
router.get('/', getAllClothes);

// @route   GET /api/clothes/search
// @desc    Search clothes
// @access  Public
router.get('/search', searchClothes);

// @route   GET /api/clothes/category/:category
// @desc    Get clothes by category (men/women/kids)
// @access  Public
router.get('/category/:category', getClothesByCategory);

// @route   GET /api/clothes/style/:style
// @desc    Get clothes by style (Kitenge/modern)
// @access  Public
router.get('/style/:style', getClothesByStyle);

// @route   GET /api/clothes/:id
// @desc    Get single cloth by ID
// @access  Public
router.get('/:id', getSingleCloth);

// ==================== ADMIN ONLY ROUTES ====================

// @route   POST /api/clothes
// @desc    Add new cloth (with image upload)
// @access  Private (Admin only)
router.post('/', protectAdmin, upload.single('image'), addCloth);

// @route   PUT /api/clothes/:id
// @desc    Update cloth (with optional image upload)
// @access  Private (Admin only)
router.put('/:id', protectAdmin, upload.single('image'), updateCloth);

// @route   DELETE /api/clothes/:id
// @desc    Delete cloth
// @access  Private (Admin only)
router.delete('/:id', protectAdmin, deleteCloth);

// @route   GET /api/clothes/admin/low-stock
// @desc    Get low stock clothes (admin alert)
// @access  Private (Admin only)
router.get('/admin/low-stock', protectAdmin, getLowStockClothes);

// @route   GET /api/clothes/admin/out-of-stock
// @desc    Get out of stock clothes
// @access  Private (Admin only)
router.get('/admin/out-of-stock', protectAdmin, getOutOfStockClothes);

// @route   PATCH /api/clothes/:id/stock
// @desc    Update stock only
// @access  Private (Admin only)
router.patch('/:id/stock', protectAdmin, updateStock);

module.exports = router;