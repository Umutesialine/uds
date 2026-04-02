const mongoose = require('mongoose');

/**
 * Review Schema - For user feedback on clothes
 * Fields: user, cloth, rating, comment
 */
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    cloth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cloth',
      required: [true, 'Cloth is required']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: function(value) {
          return Number.isInteger(value) && value >= 1 && value <= 5;
        },
        message: 'Rating must be a whole number between 1 and 5'
      }
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
      minlength: [3, 'Comment must be at least 3 characters long'],
      maxlength: [500, 'Comment cannot exceed 500 characters']
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Ensure one user can only review a specific cloth once
reviewSchema.index({ user: 1, cloth: 1 }, { unique: true });

// Method to update review
reviewSchema.methods.updateReview = async function(rating, comment) {
  this.rating = rating;
  this.comment = comment;
  await this.save();
  return this;
};

// Static method to get all reviews for a specific cloth
reviewSchema.statics.getClothReviews = function(clothId) {
  return this.find({ cloth: clothId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
};

// Static method to get average rating for a cloth
reviewSchema.statics.getAverageRating = async function(clothId) {
  const result = await this.aggregate([
    { $match: { cloth: clothId } },
    {
      $group: {
        _id: '$cloth',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }
  
  return {
    averageRating: parseFloat(result[0].averageRating.toFixed(1)),
    totalReviews: result[0].totalReviews
  };
};

// Static method to get all reviews by a specific user
reviewSchema.statics.getUserReviews = function(userId) {
  return this.find({ user: userId })
    .populate('cloth', 'name image price')
    .sort({ createdAt: -1 });
};

// Static method to get high-rated reviews (4-5 stars)
reviewSchema.statics.getHighRatedReviews = function(clothId, minRating = 4) {
  const query = { rating: { $gte: minRating } };
  if (clothId) query.cloth = clothId;
  
  return this.find(query)
    .populate('user', 'name')
    .populate('cloth', 'name')
    .sort({ rating: -1, createdAt: -1 });
};

// Create and export Review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;