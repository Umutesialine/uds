const express = require('express');
const router = express.Router();
const { protectUser, protectAdmin } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/bookingController');

// ==================== USER ROUTES ====================

// @route   POST /api/bookings
// @desc    Create new booking (custom tailoring)
// @access  Private (User only)
router.post('/', protectUser, createBooking);

// @route   GET /api/bookings
// @desc    Get logged in user's bookings
// @access  Private (User only)
router.get('/', protectUser, getUserBookings);

// @route   GET /api/bookings/my-bookings
// @desc    Get user's bookings (alternative endpoint)
// @access  Private (User only)
router.get('/my-bookings', protectUser, getUserBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private (User only)
router.get('/:id', protectUser, getSingleBooking);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking (user)
// @access  Private (User only)
router.put('/:id/cancel', protectUser, cancelBooking);

// @route   PUT /api/bookings/:id/measurements
// @desc    Update measurements (user)
// @access  Private (User only)
router.put('/:id/measurements', protectUser, updateMeasurements);

// ==================== ADMIN ROUTES ====================

// @route   PUT /api/bookings/:id
// @desc    Update booking status (admin)
// @access  Private (Admin only)
router.put('/:id', protectAdmin, updateBookingStatus);

// @route   GET /api/bookings/admin/all
// @desc    Get all bookings (admin)
// @access  Private (Admin only)
router.get('/admin/all', protectAdmin, getAllBookings);

// @route   GET /api/bookings/admin/status/:status
// @desc    Get bookings by status (admin)
// @access  Private (Admin only)
router.get('/admin/status/:status', protectAdmin, getBookingsByStatus);

// @route   GET /api/bookings/admin/stats
// @desc    Get booking statistics (admin dashboard)
// @access  Private (Admin only)
router.get('/admin/stats', protectAdmin, getBookingStats);

// @route   GET /api/bookings/admin/today
// @desc    Get today's bookings (admin)
// @access  Private (Admin only)
router.get('/admin/today', protectAdmin, getTodaysBookings);

module.exports = router;