const express = require('express');
const router = express.Router();
const { protectUser } = require('../middleware/authMiddleware');
const {
  addReview,
  getClothReviews
} = require('../controllers/reviewController');

// ==================== PUBLIC ROUTES ====================

// @route   GET /api/reviews/:clothId
// @desc    Get all reviews for a specific cloth
// @access  Public
router.get('/:clothId', getClothReviews);

// ==================== USER ROUTES ====================

// @route   POST /api/reviews
// @desc    Add new review for a cloth
// @access  Private (User only - must be logged in)
router.post('/', protectUser, addReview);

module.exports = router;