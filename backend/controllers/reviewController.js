const Review = require('../models/Review');
const Cloth = require('../models/Cloth');
const Order = require('../models/Order');

// ==================== CREATE REVIEW ====================

// @desc    Add new review for a cloth
// @route   POST /api/reviews
// @access  Private (User only)
const addReview = async (req, res) => {
  try {
    const { cloth, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if all required fields are provided
    if (!cloth || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cloth, rating, and comment'
      });
    }

    // Check if cloth exists
    const clothExists = await Cloth.findById(cloth);
    if (!clothExists) {
      return res.status(404).json({
        success: false,
        message: 'Cloth not found'
      });
    }

    // Check if user has purchased this cloth (optional but recommended)
    const hasPurchased = await Order.findOne({
      user: userId,
      'items.clothId': cloth,
      status: 'completed'
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: 'You can only review clothes you have purchased'
      });
    }

    // Check if user already reviewed this cloth
    const existingReview = await Review.findOne({ user: userId, cloth });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this cloth. You can update your existing review.'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Create review
    const review = await Review.create({
      user: userId,
      cloth,
      rating: parseInt(rating),
      comment
    });

    // Populate user details
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .populate('cloth', 'name price style image');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review: populatedReview
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding review',
      error: error.message
    });
  }
};

// ==================== GET REVIEWS ====================

// @desc    Get all reviews for a specific cloth
// @route   GET /api/reviews/cloth/:clothId
// @access  Public
const getClothReviews = async (req, res) => {
  try {
    const { clothId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if cloth exists
    const clothExists = await Cloth.findById(clothId);
    if (!clothExists) {
      return res.status(404).json({
        success: false,
        message: 'Cloth not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    const reviews = await Review.find({ cloth: clothId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitValue);

    const total = await Review.countDocuments({ cloth: clothId });

    // Get average rating
    const ratingStats = await Review.getAverageRating(clothId);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitValue),
      ratingStats,
      reviews
    });

  } catch (error) {
    console.error('Get cloth reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews',
      error: error.message
    });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin/all
// @access  Private (Admin only)
const getAllReviews = async (req, res) => {
  try {
    const { rating, page = 1, limit = 20 } = req.query;
    
    let filter = {};
    if (rating) filter.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('cloth', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitValue);

    const total = await Review.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitValue),
      reviews
    });

  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching all reviews',
      error: error.message
    });
  }
};

// @desc    Get user's own reviews
// @route   GET /api/reviews/my-reviews
// @access  Private (User only)
const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reviews = await Review.find({ user: userId })
      .populate('cloth', 'name price style image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your reviews',
      error: error.message
    });
  }
};

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getSingleReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('user', 'name')
      .populate('cloth', 'name price style image description');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    console.error('Get single review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching review',
      error: error.message
    });
  }
};

// ==================== UPDATE REVIEW ====================

// @desc    Update user's own review
// @route   PUT /api/reviews/:id
// @access  Private (User only)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    // Find review and check ownership
    const review = await Review.findOne({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not the owner'
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Update review
    await review.updateReview(
      rating || review.rating,
      comment || review.comment
    );

    const updatedReview = await Review.findById(id)
      .populate('user', 'name')
      .populate('cloth', 'name price');

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating review',
      error: error.message
    });
  }
};

// ==================== DELETE REVIEW ====================

// @desc    Delete user's own review
// @route   DELETE /api/reviews/:id
// @access  Private (User only)
const deleteMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ _id: id, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or you are not the owner'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting review',
      error: error.message
    });
  }
};

// @desc    Delete any review (admin)
// @route   DELETE /api/reviews/admin/:id
// @access  Private (Admin only)
const deleteReviewByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully by admin'
    });

  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting review',
      error: error.message
    });
  }
};

// ==================== ADVANCED FEATURES ====================

// @desc    Get high rated reviews (4-5 stars) for a cloth
// @route   GET /api/reviews/cloth/:clothId/high-rated
// @access  Public
const getHighRatedReviews = async (req, res) => {
  try {
    const { clothId } = req.params;
    const { minRating = 4, limit = 5 } = req.query;

    const reviews = await Review.find({ 
      cloth: clothId, 
      rating: { $gte: parseInt(minRating) } 
    })
      .populate('user', 'name')
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      minRating,
      reviews
    });

  } catch (error) {
    console.error('Get high rated reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching high rated reviews',
      error: error.message
    });
  }
};

// @desc    Get review statistics for a cloth
// @route   GET /api/reviews/cloth/:clothId/stats
// @access  Public
const getReviewStats = async (req, res) => {
  try {
    const { clothId } = req.params;

    // Check if cloth exists
    const clothExists = await Cloth.findById(clothId);
    if (!clothExists) {
      return res.status(404).json({
        success: false,
        message: 'Cloth not found'
      });
    }

    // Get average rating and total reviews
    const ratingStats = await Review.getAverageRating(clothId);

    // Get rating distribution
    const distribution = await Review.aggregate([
      { $match: { cloth: clothId } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Format distribution (1-5 stars)
    const ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    distribution.forEach(item => {
      ratingDistribution[item._id] = item.count;
    });

    // Get percentage for each rating
    const totalReviews = ratingStats.totalReviews;
    const ratingPercentages = {};
    for (let i = 1; i <= 5; i++) {
      ratingPercentages[i] = totalReviews > 0 
        ? ((ratingDistribution[i] / totalReviews) * 100).toFixed(1)
        : 0;
    }

    res.status(200).json({
      success: true,
      stats: {
        averageRating: ratingStats.averageRating,
        totalReviews: ratingStats.totalReviews,
        ratingDistribution,
        ratingPercentages
      }
    });

  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching review statistics',
      error: error.message
    });
  }
};

// @desc    Get recent reviews (for homepage)
// @route   GET /api/reviews/recent
// @access  Public
const getRecentReviews = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('cloth', 'name image')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.error('Get recent reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching recent reviews',
      error: error.message
    });
  }
};

module.exports = {
  // Create
  addReview,
  
  // Read
  getClothReviews,
  getAllReviews,
  getMyReviews,
  getSingleReview,
  getHighRatedReviews,
  getReviewStats,
  getRecentReviews,
  
  // Update
  updateReview,
  
  // Delete
  deleteMyReview,
  deleteReviewByAdmin
};