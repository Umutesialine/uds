const mongoose = require('mongoose');

/**
 * Cloth Schema - For managing clothing designs and products
 * Fields: name, price, category, style, image, description, stock
 */
const clothSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cloth name is required'],
      trim: true,
      unique: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['men', 'women', 'kids'],
      lowercase: true
    },
    style: {
      type: String,
      required: [true, 'Style is required'],
      enum: ['Kitenge', 'modern'],
      enum: ['Kitenge', 'modern']
    },
    image: {
      type: String,
      required: [false, 'Image is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Method to check if cloth is in stock
clothSchema.methods.isInStock = function(quantity = 1) {
  return this.stock >= quantity;
};

// Method to reduce stock when purchased
clothSchema.methods.reduceStock = async function(quantity = 1) {
  if (!this.isInStock(quantity)) {
    throw new Error(`Insufficient stock. Only ${this.stock} items available`);
  }
  this.stock -= quantity;
  await this.save();
  return this.stock;
};

clothSchema.methods.increaseStock = async function (qty) {
  this.stock += qty;
  return await this.save();
};

clothSchema.methods.decreaseStock = async function (qty) {
  this.stock -= qty;
  return await this.save();
};  

// Create and export Cloth model
const Cloth = mongoose.model('Cloth', clothSchema);

module.exports = Cloth;