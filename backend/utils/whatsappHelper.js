/**
 * WhatsApp Helper Utility
 * Generates WhatsApp links with auto-generated messages
 */

/**
 * Generate WhatsApp link with custom message
 * @param {string} phoneNumber - WhatsApp phone number (with country code, no + or spaces)
 * @param {string} message - Message to pre-fill
 * @returns {string} - WhatsApp link
 */
const generateWhatsAppLink = (phoneNumber, message) => {
  // Remove any non-digit characters from phone number
  const cleanNumber = phoneNumber.toString().replace(/\D/g, '');
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
};

/**
 * Generate message for buying ready-made cloth
 * @param {Object} cloth - Cloth object with name, price, etc.
 * @param {Object} user - User object with name
 * @returns {string} - Formatted message
 */
const getBuyMessage = (cloth, user = null) => {
  const userName = user?.name || 'Customer';
  const message = `Hello! I am ${userName} and I am interested in buying this product:

👗 Product: ${cloth.name}
💰 Price: ${cloth.price} TZS
📦 Availability: In Stock

I would like to place an order. Please let me know the next steps.

Thank you!`;
  
  return message;
};

/**
 * Generate message for booking custom tailoring
 * @param {Object} cloth - Cloth object with name, style, etc.
 * @param {Object} user - User object with name
 * @param {Object} details - Additional booking details
 * @returns {string} - Formatted message
 */
const getBookingMessage = (cloth, user = null, details = {}) => {
  const userName = user?.name || 'Customer';
  const measurements = details.measurements || 'Will provide measurements';
  const preferredDate = details.preferredDate || 'To be discussed';
  
  const message = `Hello! I am ${userName} and I would like to book this design for custom tailoring:

👗 Design: ${cloth.name}
🎨 Style: ${cloth.style}
📏 Measurements: ${measurements}
📅 Preferred Date: ${preferredDate}
✏️ Special Instructions: ${details.instructions || 'None'}

Please let me know the pricing and timeline.

Thank you!`;
  
  return message;
};

/**
 * Generate message for general inquiry
 * @param {string} clothName - Name of the cloth
 * @param {Object} user - User object with name
 * @returns {string} - Formatted message
 */
const getInquiryMessage = (clothName, user = null) => {
  const userName = user?.name || 'Customer';
  
  const message = `Hello! I am ${userName} and I have a question about:

👗 Product: ${clothName}

Could you please provide more information about this item?

Thank you!`;
  
  return message;
};

/**
 * Generate message for order status inquiry
 * @param {string} orderId - Order ID
 * @param {Object} user - User object with name
 * @returns {string} - Formatted message
 */
const getOrderStatusMessage = (orderId, user = null) => {
  const userName = user?.name || 'Customer';
  
  const message = `Hello! I am ${userName} and I would like to check the status of my order:

📦 Order ID: ${orderId}

Could you please provide an update?

Thank you!`;
  
  return message;
};

/**
 * Generate message for booking status inquiry
 * @param {string} bookingId - Booking ID
 * @param {Object} user - User object with name
 * @returns {string} - Formatted message
 */
const getBookingStatusMessage = (bookingId, user = null) => {
  const userName = user?.name || 'Customer';
  
  const message = `Hello! I am ${userName} and I would like to check the status of my booking:

📅 Booking ID: ${bookingId}

Could you please provide an update on the tailoring progress?

Thank you!`;
  
  return message;
};

/**
 * Generate message for bulk order inquiry
 * @param {Array} items - Array of cloth items
 * @param {Object} user - User object with name
 * @returns {string} - Formatted message
 */
const getBulkOrderMessage = (items, user = null) => {
  const userName = user?.name || 'Customer';
  
  let itemsList = '';
  items.forEach((item, index) => {
    itemsList += `\n${index + 1}. ${item.name} - Quantity: ${item.quantity || 1}`;
  });
  
  const message = `Hello! I am ${userName} and I am interested in a bulk order:

${itemsList}

Please let me know if you have bulk discounts available.

Thank you!`;
  
  return message;
};

/**
 * Generate WhatsApp link for buying a cloth
 * @param {string} phoneNumber - Tailor's WhatsApp number
 * @param {Object} cloth - Cloth object
 * @param {Object} user - User object (optional)
 * @returns {string} - WhatsApp link
 */
const getBuyWhatsAppLink = (phoneNumber, cloth, user = null) => {
  const message = getBuyMessage(cloth, user);
  return generateWhatsAppLink(phoneNumber, message);
};

/**
 * Generate WhatsApp link for booking a cloth
 * @param {string} phoneNumber - Tailor's WhatsApp number
 * @param {Object} cloth - Cloth object
 * @param {Object} user - User object (optional)
 * @param {Object} details - Booking details (optional)
 * @returns {string} - WhatsApp link
 */
const getBookingWhatsAppLink = (phoneNumber, cloth, user = null, details = {}) => {
  const message = getBookingMessage(cloth, user, details);
  return generateWhatsAppLink(phoneNumber, message);
};

/**
 * Generate WhatsApp link for general inquiry
 * @param {string} phoneNumber - Tailor's WhatsApp number
 * @param {string} clothName - Name of the cloth
 * @param {Object} user - User object (optional)
 * @returns {string} - WhatsApp link
 */
const getInquiryWhatsAppLink = (phoneNumber, clothName, user = null) => {
  const message = getInquiryMessage(clothName, user);
  return generateWhatsAppLink(phoneNumber, message);
};

/**
 * Generate WhatsApp link for order status
 * @param {string} phoneNumber - Tailor's WhatsApp number
 * @param {string} orderId - Order ID
 * @param {Object} user - User object (optional)
 * @returns {string} - WhatsApp link
 */
const getOrderStatusWhatsAppLink = (phoneNumber, orderId, user = null) => {
  const message = getOrderStatusMessage(orderId, user);
  return generateWhatsAppLink(phoneNumber, message);
};

/**
 * Generate WhatsApp link for booking status
 * @param {string} phoneNumber - Tailor's WhatsApp number
 * @param {string} bookingId - Booking ID
 * @param {Object} user - User object (optional)
 * @returns {string} - WhatsApp link
 */
const getBookingStatusWhatsAppLink = (phoneNumber, bookingId, user = null) => {
  const message = getBookingStatusMessage(bookingId, user);
  return generateWhatsAppLink(phoneNumber, message);
};

/**
 * Generate simple WhatsApp link with custom message
 * @param {string} phoneNumber - Tailor's WhatsApp number
 * @param {string} customMessage - Custom message
 * @returns {string} - WhatsApp link
 */
const getCustomWhatsAppLink = (phoneNumber, customMessage) => {
  return generateWhatsAppLink(phoneNumber, customMessage);
};

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid
 */
const isValidPhoneNumber = (phoneNumber) => {
  const cleanNumber = phoneNumber.toString().replace(/\D/g, '');
  // Basic validation: should be between 10-15 digits
  return cleanNumber.length >= 10 && cleanNumber.length <= 15;
};

/**
 * Format phone number for WhatsApp (remove +, spaces, etc.)
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} - Cleaned phone number
 */
const formatPhoneNumber = (phoneNumber) => {
  return phoneNumber.toString().replace(/\D/g, '');
};

/**
 * Get default tailor WhatsApp number from env
 * @returns {string} - Tailor's WhatsApp number
 */
const getTailorWhatsAppNumber = () => {
  return process.env.TAILOR_WHATSAPP_NUMBER || '255700000000';
};

module.exports = {
  // Core functions
  generateWhatsAppLink,
  formatPhoneNumber,
  isValidPhoneNumber,
  getTailorWhatsAppNumber,
  
  // Message generators
  getBuyMessage,
  getBookingMessage,
  getInquiryMessage,
  getOrderStatusMessage,
  getBookingStatusMessage,
  getBulkOrderMessage,
  
  // WhatsApp link generators
  getBuyWhatsAppLink,
  getBookingWhatsAppLink,
  getInquiryWhatsAppLink,
  getOrderStatusWhatsAppLink,
  getBookingStatusWhatsAppLink,
  getCustomWhatsAppLink
};