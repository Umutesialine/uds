/**
 * Global Error Handler Middleware
 * Provides clean, consistent error responses across the application
 */

// Custom error class for operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle MongoDB duplicate key error (code 11000)
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value entered for ${field}: "${value}". Please use another value.`;
  return new AppError(message, 400);
};

// Handle MongoDB validation error
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle MongoDB cast error (invalid ObjectId)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}. Resource not found.`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () => {
  return new AppError('Invalid token. Please login again.', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please login again.', 401);
};

// Handle multer errors
const handleMulterError = (err) => {
  if (err.code === 'FILE_TOO_LARGE') {
    return new AppError('File too large. Maximum file size is 5MB.', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Maximum 5 images allowed.', 400);
  }
  return new AppError(err.message, 400);
};

// Send error response for development (detailed)
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
    status: err.status
  });
};

// Send error response for production (clean, no stack traces)
const sendErrorProd = (err, res) => {
  // Operational, trusted errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      status: err.status
    });
  } else {
    // Programming or other unknown errors: don't leak error details
    console.error('ERROR 💥:', err);
    
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
      status: 'error'
    });
  }
};

// Main global error handler middleware
const errorHandler = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle specific error types
  let error = { ...err };
  error.message = err.message;

  // MongoDB errors
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }
  
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }
  
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }
  
  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }
  
  // Multer errors
  if (err.name === 'MulterError') {
    error = handleMulterError(err);
  }

  // Send appropriate response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404 Not Found middleware (for routes that don't exist)
const notFound = (req, res, next) => {
  const error = new AppError(`Cannot find ${req.originalUrl} on this server`, 404);
  next(error);
};

// Async wrapper to catch errors in async route handlers
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFound,
  catchAsync,
  AppError
};