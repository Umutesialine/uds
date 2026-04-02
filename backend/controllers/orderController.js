const Order = require('../models/Order');
const Cloth = require('../models/Cloth');

// ==================== CREATE ORDER ====================

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User only)
const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, address } = req.body;
    const userId = req.user.id;

    // Check if all required fields are provided
    if (!items || !items.length || !totalPrice || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide items, totalPrice, and address'
      });
    }

    // Validate stock for each item
    for (const item of items) {
      const cloth = await Cloth.findById(item.clothId);
      if (!cloth) {
        return res.status(404).json({
          success: false,
          message: `Cloth with ID ${item.clothId} not found`
        });
      }
      
      if (cloth.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${cloth.name}. Only ${cloth.stock} available`
        });
      }
    }

    // Reduce stock for each item
    for (const item of items) {
      const cloth = await Cloth.findById(item.clothId);
      await cloth.reduceStock(item.quantity);
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items,
      totalPrice: parseFloat(totalPrice),
      status: 'pending',
      address
    });

    // Populate user and cloth details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating order',
      error: error.message
    });
  }
};

// ==================== READ ORDERS ====================

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private (User only)
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching your orders',
      error: error.message
    });
  }
};

// @desc    Get single order by ID (user)
// @route   GET /api/orders/:id
// @access  Private (User only)
const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate('user', 'name email phone address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get single order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order',
      error: error.message
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitValue);

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitValue),
      orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching all orders',
      error: error.message
    });
  }
};

// ==================== UPDATE ORDER ====================

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed: pending, completed'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    await order.updateStatus(status);

    const updatedOrder = await Order.findById(id)
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: error.message
    });
  }
};

// ==================== ADVANCED FEATURES ====================

// @desc    Get order statistics (admin dashboard)
// @route   GET /api/orders/admin/stats
// @access  Private (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order stats',
      error: error.message
    });
  }
};

// @desc    Cancel order (user)
// @route   PUT /api/orders/:id/cancel
// @access  Private (User only)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: id, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed order'
      });
    }

    // Restore stock for each item
    for (const item of order.items) {
      const cloth = await Cloth.findById(item.clothId);
      if (cloth) {
        await cloth.increaseStock(item.quantity);
      }
    }

    // Delete order
    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Order cancelled and stock restored successfully'
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error cancelling order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  cancelOrder
};