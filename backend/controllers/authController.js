const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// ==================== ADMIN AUTH ====================

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Admin login attempt:', { username, passwordProvided: !!password });

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both username and password'
      });
    }

    // Find admin and explicitly include password field
    const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');

    // Check if admin exists
    if (!admin) {
      console.log('Admin not found:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    console.log('Admin found:', admin.username);
    console.log('Admin has comparePassword method:', typeof admin.comparePassword === 'function');

    // Compare password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      console.log('Password mismatch for admin:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    console.log('Admin login successful:', username);

    // Generate token
    const token = generateToken(admin._id, 'admin');

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};
// ==================== USER AUTH ====================

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log('User registration attempt:', { name, email, phone });

    // Check if all fields are provided
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and phone'
      });
    }

    // Check if password length is sufficient
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone
    });

    console.log('User registered successfully:', user.email);

    // Generate token
    const token = generateToken(user._id, 'user');

    // Return success response (without password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login OR /api/auth/user/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('User login attempt:', { email, passwordProvided: !!password });

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user and explicitly include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Check if user exists
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('User found:', user.email);

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('User login successful:', user.email);

    // Generate token
    const token = generateToken(user._id, 'user');

    // Return success response
    res.status(200).json({
      success: true,
      message: 'User login successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// ==================== TOKEN VERIFICATION ====================

// @desc    Verify token and get current user/admin
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        role: 'admin',
        user: {
          id: admin._id,
          username: admin.username,
          role: 'admin'
        }
      });
    } 
    
    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        role: 'user',
        user: user.getPublicProfile()
      });
    }
    
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
    
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

// ==================== PASSWORD MANAGEMENT ====================

// @desc    Change user password
// @route   PUT /api/auth/user/change-password
// @access  Private
const changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide old and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
      error: error.message
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/auth/admin/change-password
// @access  Private (Admin only)
const changeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide old and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const admin = await Admin.findById(adminId).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin password changed successfully'
    });

  } catch (error) {
    console.error('Admin password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/admin/profile
// @access  Private (Admin only)
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching admin profile',
      error: error.message
    });
  }
};

module.exports = {
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
};