const Booking = require('../models/Booking');
const Cloth = require('../models/Cloth');

// ==================== CREATE BOOKING ====================

// @desc    Create new booking (custom tailoring)
// @route   POST /api/bookings
// @access  Private (User only)
const createBooking = async (req, res) => {
  try {
    const { cloth, measurements, preferredDate } = req.body;
    const userId = req.user.id;

    // Check if all required fields are provided
    if (!cloth || !measurements || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide cloth, measurements, and preferredDate'
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

    // Create booking
    const booking = await Booking.create({
      user: userId,
      cloth,
      measurements,
      preferredDate: new Date(preferredDate),
      status: 'pending'
    });

    // Populate user and cloth details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('cloth', 'name price style image');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating booking',
      error: error.message
    });
  }
};

// ==================== READ BOOKINGS ====================

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (User only)
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await Booking.find({ user: userId })
      .populate('cloth', 'name price style image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking by ID (user)
// @route   GET /api/bookings/:id
// @access  Private (User only)
const getSingleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: id, user: userId })
      .populate('user', 'name email phone')
      .populate('cloth', 'name price style image description');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Get single booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking',
      error: error.message
    });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings/admin/all
// @access  Private (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate('user', 'name email phone')
      .populate('cloth', 'name price style image')
      .sort({ preferredDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(limitValue);

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitValue),
      bookings
    });

  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching all bookings',
      error: error.message
    });
  }
};

// @desc    Get bookings by status (admin)
// @route   GET /api/bookings/admin/status/:status
// @access  Private (Admin only)
const getBookingsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const bookings = await Booking.find({ status })
      .populate('user', 'name email phone')
      .populate('cloth', 'name style image')
      .sort({ preferredDate: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      status,
      bookings
    });

  } catch (error) {
    console.error('Get bookings by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings by status',
      error: error.message
    });
  }
};

// ==================== UPDATE BOOKING ====================

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed: pending, confirmed, in-progress, completed, cancelled'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update status
    await booking.updateStatus(status);

    const updatedBooking = await Booking.findById(id)
      .populate('user', 'name email phone')
      .populate('cloth', 'name price style');

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status',
      error: error.message
    });
  }
};

// ==================== ADVANCED FEATURES ====================

// @desc    Cancel booking (user)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User only)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: id, user: userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    await booking.cancel();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling booking',
      error: error.message
    });
  }
};

// @desc    Get booking statistics (admin dashboard)
// @route   GET /api/bookings/admin/stats
// @access  Private (Admin only)
const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const inProgressBookings = await Booking.countDocuments({ status: 'in-progress' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysBookings = await Booking.countDocuments({
      preferredDate: { $gte: today, $lt: tomorrow }
    });

    const upcomingBookings = await Booking.find({
      preferredDate: { $gte: today },
      status: { $in: ['pending', 'confirmed'] }
    })
      .populate('user', 'name phone')
      .populate('cloth', 'name')
      .sort({ preferredDate: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        inProgressBookings,
        completedBookings,
        cancelledBookings,
        todaysBookings
      },
      upcomingBookings
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching booking stats',
      error: error.message
    });
  }
};

// @desc    Get today's bookings (admin)
// @route   GET /api/bookings/admin/today
// @access  Private (Admin only)
const getTodaysBookings = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const bookings = await Booking.find({
      preferredDate: { $gte: today, $lt: tomorrow }
    })
      .populate('user', 'name phone')
      .populate('cloth', 'name style')
      .sort({ preferredDate: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      date: today.toDateString(),
      bookings
    });

  } catch (error) {
    console.error('Get today\'s bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching today\'s bookings',
      error: error.message
    });
  }
};

// @desc    Update measurements (user)
// @route   PUT /api/bookings/:id/measurements
// @access  Private (User only)
const updateMeasurements = async (req, res) => {
  try {
    const { id } = req.params;
    const { measurements } = req.body;
    const userId = req.user.id;

    if (!measurements) {
      return res.status(400).json({
        success: false,
        message: 'Please provide measurements'
      });
    }

    const booking = await Booking.findOne({ _id: id, user: userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot update measurements for ${booking.status} booking`
      });
    }

    booking.measurements = measurements;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Measurements updated successfully',
      booking
    });

  } catch (error) {
    console.error('Update measurements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating measurements',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getSingleBooking,
  getAllBookings,
  getBookingsByStatus,
  updateBookingStatus,
  cancelBooking,
  getBookingStats,
  getTodaysBookings,
  updateMeasurements
};