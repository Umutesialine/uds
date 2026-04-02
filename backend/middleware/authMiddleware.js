const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

/**
 * Protect routes - Verify JWT token for users
 * @desc    Middleware to protect user routes
 * @access  Private (User only)
 */
const protectUser = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is for user (not admin)
    if (decoded.role !== 'user') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. User access required.'
      });
    }

    // Find user and attach to request
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Invalid token.'
      });
    }

    // Attach user to request object
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: 'user'
    };

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

/**
 * Protect routes - Verify JWT token for admins
 * @desc    Middleware to protect admin routes
 * @access  Private (Admin only)
 */
const protectAdmin = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Admin login required.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is for admin (not user)
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin access required.'
      });
    }

    // Find admin and attach to request
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found. Invalid token.'
      });
    }

    // Attach admin to request object
    req.admin = {
      id: admin._id,
      username: admin.username,
      role: 'admin'
    };

    next();

  } catch (error) {
    console.error('Admin auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

/**
 * Optional auth - Try to verify token but don't block if not present
 * @desc    Middleware that attaches user/admin if token is valid
 * @access  Public (but attaches user data if available)
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'user'
        };
      }
    }

    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = {
          id: admin._id,
          username: admin.username,
          role: 'admin'
        };
      }
    }

    next();

  } catch (error) {
    // Token invalid but we still proceed
    next();
  }
};

/**
 * Check if user is admin (to be used after protectAdmin)
 * @desc    Additional check for admin role
 */
const isAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

/**
 * Check if user is logged in user or admin
 * @desc    Allows access if user owns the resource or is admin
 */
const isOwnerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.userId || req.body.userId;
  
  if (req.admin || (req.user && req.user.id === resourceUserId)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  }
};

module.exports = {
  protectUser,
  protectAdmin,
  optionalAuth,
  isAdmin,
  isOwnerOrAdmin
};