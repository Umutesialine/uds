const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema - For customer accounts
 * Enables user registration, login, and order/booking tracking
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't return password by default in queries
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[0-9+\-\s()]{10,15}$/,
        'Please provide a valid phone number'
      ]
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// 🔐 Hash password before saving (pre-save middleware)
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error);
  }
});

// 🔐 Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🛡️ Method to hide sensitive data when sending to client
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    createdAt: this.createdAt
  };
};

// 🛡️ Static method to find user by email (exclude password)
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('-password');
};

// 🛡️ Static method to check if email already exists
userSchema.statics.isEmailTaken = async function(email, excludeUserId = null) {
  const query = { email: email.toLowerCase() };
  if (excludeUserId) {
    query._id = { $ne: excludeUserId };
  }
  const user = await this.findOne(query);
  return !!user;
};

// Create and export User model
const User = mongoose.model('User', userSchema);

module.exports = User;