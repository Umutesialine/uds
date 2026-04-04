const Cloth = require('../models/Cloth');
const fs = require('fs');
const path = require('path');

// ==================== CREATE CLOTH ====================

// @desc    Add new cloth (with image upload)
// @route   POST /api/clothes
// @access  Private (Admin only)
const addCloth = async (req, res) => {
  try {
    const { name, price, category, style, description, stock } = req.body;

    // Check if all required fields are provided
    if (!name || !price || !category || !style || !description || !stock) {
      // If image was uploaded but validation fails, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, price, category, style, description, stock'
      });
    }

    // Check if cloth with same name already exists
    const existingCloth = await Cloth.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingCloth) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: 'Cloth with this name already exists'
      });
    }

    // Check if image was uploaded
    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Please upload an image'
    //   });
    // }


    // Handle image - use default if no image uploaded
    let imagePath = '/uploads/default-cloth.jpg'; // Default image
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Create image path (relative path for database)
    //const imagePath = `/uploads/${req.file.filename}`;

    // Create new cloth
    const cloth = await Cloth.create({
      name,
      price: parseFloat(price),
      category: category.toLowerCase(),
      style,
      image: imagePath,
      description,
      stock: parseInt(stock)
    });

    res.status(201).json({
      success: true,
      message: 'Cloth added successfully',
      cloth
    });

  } catch (error) {
    // Delete uploaded image if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Add cloth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding cloth',
      error: error.message
    });
  }
};

// ==================== READ CLOTHES ====================

// @desc    Get all clothes (with search & filters)
// @route   GET /api/clothes
// @access  Public
const getAllClothes = async (req, res) => {
  try {
    const { 
      search, 
      category, 
      style, 
      minPrice, 
      maxPrice, 
      inStock,
      sortBy,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    let filter = {};

    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category.toLowerCase();
    }

    // Filter by style
    if (style) {
      filter.style = style;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Filter by stock availability
    if (inStock === 'true') {
      filter.stock = { $gt: 0 };
    }

    // Build sort object
    let sort = {};
    if (sortBy === 'price_asc') sort.price = 1;
    else if (sortBy === 'price_desc') sort.price = -1;
    else if (sortBy === 'name_asc') sort.name = 1;
    else if (sortBy === 'name_desc') sort.name = -1;
    else if (sortBy === 'oldest') sort.createdAt = 1;
    else sort.createdAt = -1; // Default: newest first

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitValue = parseInt(limit);

    // Execute query with pagination
    const clothes = await Cloth.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitValue);

    // Get total count for pagination
    const total = await Cloth.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: clothes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limitValue),
      clothes
    });

  } catch (error) {
    console.error('Get all clothes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching clothes',
      error: error.message
    });
  }
};

// @desc    Get single cloth by ID
// @route   GET /api/clothes/:id
// @access  Public
const getSingleCloth = async (req, res) => {
  try {
    const cloth = await Cloth.findById(req.params.id);

    if (!cloth) {
      return res.status(404).json({
        success: false,
        message: 'Cloth not found'
      });
    }

    res.status(200).json({
      success: true,
      cloth
    });

  } catch (error) {
    console.error('Get single cloth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cloth',
      error: error.message
    });
  }
};

// ==================== UPDATE CLOTH ====================

// @desc    Update cloth (with optional image update)
// @route   PUT /api/clothes/:id
// @access  Private (Admin only)
const updateCloth = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, style, description, stock } = req.body;

    // Find existing cloth
    const cloth = await Cloth.findById(id);

    if (!cloth) {
      // Delete uploaded image if cloth not found
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        message: 'Cloth not found'
      });
    }

    // Check if new name conflicts with existing cloth (excluding current)
    if (name && name !== cloth.name) {
      const existingCloth = await Cloth.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });
      if (existingCloth) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'Cloth with this name already exists'
        });
      }
    }

    // Update image if new one uploaded
    let imagePath = cloth.image;
    if (req.file) {
      // Delete old image file
      const oldImagePath = path.join(__dirname, '..', cloth.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      // Set new image path
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Update cloth fields
    const updatedCloth = await Cloth.findByIdAndUpdate(
      id,
      {
        name: name || cloth.name,
        price: price ? parseFloat(price) : cloth.price,
        category: category ? category.toLowerCase() : cloth.category,
        style: style || cloth.style,
        image: imagePath,
        description: description || cloth.description,
        stock: stock !== undefined ? parseInt(stock) : cloth.stock
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cloth updated successfully',
      cloth: updatedCloth
    });

  } catch (error) {
    // Delete uploaded image if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Update cloth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cloth',
      error: error.message
    });
  }
};

// ==================== DELETE CLOTH ====================

// @desc    Delete cloth (and its image)
// @route   DELETE /api/clothes/:id
// @access  Private (Admin only)
const deleteCloth = async (req, res) => {
  try {
    const { id } = req.params;

    // Find cloth
    const cloth = await Cloth.findById(id);

    if (!cloth) {
      return res.status(404).json({
        success: false,
        message: 'Cloth not found'
      });
    }

    // Delete image file from server
    const imagePath = path.join(__dirname, '..', cloth.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete cloth from database
    await Cloth.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Cloth deleted successfully'
    });

  } catch (error) {
    console.error('Delete cloth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting cloth',
      error: error.message
    });
  }
};

// ==================== ADVANCED FEATURES ====================

// @desc    Search clothes (dedicated search endpoint)
// @route   GET /api/clothes/search/query
// @access  Public
const searchClothes = async (req, res) => {
  try {
    const { q, category, style, minPrice, maxPrice } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
    }

    let filter = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };

    if (category) filter.category = category.toLowerCase();
    if (style) filter.style = style;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const results = await Cloth.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      searchTerm: q,
      results
    });

  } catch (error) {
    console.error('Search clothes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching clothes',
      error: error.message
    });
  }
};

// @desc    Get clothes by category
// @route   GET /api/clothes/category/:category
// @access  Public
const getClothesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { inStock } = req.query;

    let filter = { category: category.toLowerCase() };
    if (inStock === 'true') filter.stock = { $gt: 0 };

    const clothes = await Cloth.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clothes.length,
      category,
      clothes
    });

  } catch (error) {
    console.error('Get by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching clothes by category',
      error: error.message
    });
  }
};

// @desc    Get clothes by style
// @route   GET /api/clothes/style/:style
// @access  Public
const getClothesByStyle = async (req, res) => {
  try {
    const { style } = req.params;
    const { inStock } = req.query;

    let filter = { style };
    if (inStock === 'true') filter.stock = { $gt: 0 };

    const clothes = await Cloth.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clothes.length,
      style,
      clothes
    });

  } catch (error) {
    console.error('Get by style error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching clothes by style',
      error: error.message
    });
  }
};

// @desc    Get low stock alerts (admin)
// @route   GET /api/clothes/admin/low-stock
// @access  Private (Admin only)
const getLowStockClothes = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 10;
    
    const clothes = await Cloth.find({ 
      stock: { $lte: threshold, $gt: 0 } 
    }).sort({ stock: 1 });

    res.status(200).json({
      success: true,
      threshold,
      count: clothes.length,
      clothes
    });

  } catch (error) {
    console.error('Get low stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching low stock items',
      error: error.message
    });
  }
};

// @desc    Get out of stock clothes (admin)
// @route   GET /api/clothes/admin/out-of-stock
// @access  Private (Admin only)
const getOutOfStockClothes = async (req, res) => {
  try {
    const clothes = await Cloth.find({ stock: 0 }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clothes.length,
      clothes
    });

  } catch (error) {
    console.error('Get out of stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching out of stock items',
      error: error.message
    });
  }
};

// @desc    Update stock only (admin)
// @route   PATCH /api/clothes/:id/stock
// @access  Private (Admin only)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid stock quantity'
      });
    }

    const cloth = await Cloth.findByIdAndUpdate(
      id,
      { stock: parseInt(stock) },
      { new: true }
    );

    if (!cloth) {
      return res.status(404).json({
        success: false,
        message: 'Cloth not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      cloth
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating stock',
      error: error.message
    });
  }
};

module.exports = {
  // Basic CRUD
  addCloth,
  getAllClothes,
  getSingleCloth,
  updateCloth,
  deleteCloth,
  
  // Advanced features
  searchClothes,
  getClothesByCategory,
  getClothesByStyle,
  getLowStockClothes,
  getOutOfStockClothes,
  updateStock
};