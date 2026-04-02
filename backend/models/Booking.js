const mongoose = require('mongoose');

/**
 * Booking Schema - For custom tailoring/bookings
 * Fields: user, cloth, measurements, preferredDate, status
 */
const bookingSchema = new mongoose.Schema(
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
    measurements: {
      type: String,
      required: [true, 'Measurements are required'],
      trim: true
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required']
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Method to update booking status
bookingSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  await this.save();
  return this;
};

// Method to check if booking is active
bookingSchema.methods.isActive = function() {
  return ['pending', 'confirmed', 'in-progress'].includes(this.status);
};

// Method to cancel booking
bookingSchema.methods.cancel = async function() {
  this.status = 'cancelled';
  await this.save();
  return this;
};

// Static method to get bookings by user
bookingSchema.statics.getUserBookings = function(userId) {
  return this.find({ user: userId })
    .populate('cloth', 'name price style image')
    .sort({ createdAt: -1 });
};

// Static method to get bookings by cloth
bookingSchema.statics.getClothBookings = function(clothId) {
  return this.find({ cloth: clothId })
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
};

// Static method to get pending bookings
bookingSchema.statics.getPendingBookings = function() {
  return this.find({ status: 'pending' })
    .populate('user', 'name email phone')
    .populate('cloth', 'name style')
    .sort({ preferredDate: 1 });
};

// Static method to get bookings by status
bookingSchema.statics.getBookingsByStatus = function(status) {
  return this.find({ status })
    .populate('user', 'name email phone')
    .populate('cloth', 'name style image')
    .sort({ createdAt: -1 });
};

// Static method to get today's bookings
bookingSchema.statics.getTodaysBookings = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    preferredDate: {
      $gte: today,
      $lt: tomorrow
    }
  })
  .populate('user', 'name phone')
  .populate('cloth', 'name style');
};

// Create and export Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;