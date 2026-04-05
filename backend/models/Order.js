const mongoose = require('mongoose');

/**
 * Order Schema - For tracking customer purchases
 * Fields: user, items, totalPrice, status, address
 */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    items: [
  {
    cloth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cloth',
      required: true
    },
    name: String,
    quantity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }
],
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative']
    },
    status: {   
      type: String,
      required: [true, 'Status is required'],
      enum: ['pending', 'delivered', 'cancelled'],
default: 'pending'
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus) {
  this.status = newStatus;
  await this.save();
  return this;
};

// Method to check if order is completed
orderSchema.methods.isCompleted = function() {
  return this.status === 'completed';
};

// Static method to get orders by user
orderSchema.statics.getUserOrders = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to get pending orders
orderSchema.statics.getPendingOrders = function() {
  return this.find({ status: 'pending' }).sort({ createdAt: 1 });
};

// Static method to get completed orders
orderSchema.statics.getCompletedOrders = function() {
  return this.find({ status: 'completed' }).sort({ createdAt: -1 });
};

// Create and export Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;