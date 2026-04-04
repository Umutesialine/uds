const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Admin Schema - Simple version with only username and password
 * For secure admin authentication
 */
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [20, 'Username cannot exceed 20 characters']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Don't return password by default in queries
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// 🔐 Hash password before saving (pre-save middleware)
adminSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});   
// 🔐 Method to compare entered password with hashed password
adminSchema.methods.comparePassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};  

// 🛠️ Static method to check if any admin exists
adminSchema.statics.adminExists = async function() {
  const count = await this.countDocuments();
  return count > 0;
};

// Create and export Admin model
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;