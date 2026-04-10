/**
 * Handle API errors consistently
 * @param {Error} error - Error object from axios
 * @returns {Object} Standardized error response
 */
export const handleApiError = (error) => {
  // Network error
  if (!error.response) {
    return {
      success: false,
      message: 'Network error. Please check your internet connection.',
      error: error.message,
    };
  }

  // Server responded with error status
  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      return {
        success: false,
        message: data.message || 'Bad request. Please check your input.',
        errors: data.errors,
      };
    case 401:
      return {
        success: false,
        message: data.message || 'Unauthorized. Please login again.',
        unauthorized: true,
      };
    case 403:
      return {
        success: false,
        message: data.message || 'Forbidden. You do not have permission.',
      };
    case 404:
      return {
        success: false,
        message: data.message || 'Resource not found.',
      };
    case 409:
      return {
        success: false,
        message: data.message || 'Conflict with existing data.',
      };
    case 422:
      return {
        success: false,
        message: data.message || 'Validation failed.',
        errors: data.errors,
      };
    case 429:
      return {
        success: false,
        message: 'Too many requests. Please try again later.',
      };
    case 500:
      return {
        success: false,
        message: data.message || 'Server error. Please try again later.',
      };
    default:
      return {
        success: false,
        message: data.message || 'An unexpected error occurred.',
      };
  }
};

/**
 * Show error toast message
 * @param {Object} error - Error object from API
 * @param {Function} showToast - Toast notification function
 */
export const showErrorToast = (error, showToast) => {
  const errorMessage = error.message || 'Something went wrong. Please try again.';
  showToast(errorMessage, 'error');
};

/**
 * Extract validation errors from response
 * @param {Object} error - Error object
 * @returns {Object} Validation errors
 */
export const getValidationErrors = (error) => {
  if (error.errors) {
    return error.errors;
  }
  return {};
};