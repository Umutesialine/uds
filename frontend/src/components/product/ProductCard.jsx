import { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaStar, 
  FaRegStar, 
  FaStarHalfAlt,
  FaHeart, 
  FaRegHeart, 
  FaEye, 
  FaShoppingBag, 
  FaCut,
  FaCheckCircle,
  FaBolt,
  FaWhatsapp,
  FaTimes,
  FaPhone,
  FaMapMarkerAlt,
  FaStore,
  FaSpinner,
  FaArrowRight
} from 'react-icons/fa';

import orderService from '../../services/orderService';

// Helper functions
const formatPrice = (price) => {
  if (!price && price !== 0) return '0 RWF';
  return `${price.toLocaleString()} RWF`;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/placeholder.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:5000${imagePath}`;
  }
  return imagePath;
};

// Star Rating Component
const StarRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(Math.max(0, fullStars))].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-xs" />}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-gray-300 text-xs" />
      ))}
    </div>
  );
};

// Buy Now Modal Component
// Buy Now Modal Component
const BuyNowModal = ({ product, isOpen, onClose, onOrderPlaced }) => {
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

 // Inside BuyNowModal component, update the handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!token) {
    window.location.href = '/login';
    return;
  }
  
  if (!phone || !pickupLocation) {
    alert('Please provide phone number and pickup location');
    return;
  }
  
  setSubmitting(true);
  
  try {
    const orderData = {
      items: [{
        clothId: product._id,
        name: product.name,
        quantity: quantity,
        price: product.price
      }],
      totalPrice: product.price * quantity,
      address: pickupLocation,
      phone: phone,
      notes: notes
    };
    
    console.log('Sending order to backend:', orderData);
    
    // ✅ Save to backend API
    const response = await orderService.createOrder(orderData);
    console.log('Backend response:', response);
    
    if (response.success) {
      // ✅ Order saved to backend successfully
      const newOrder = response.order;
      
      // Also save to localStorage for backup/fast access
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Dispatch events to update UI
      window.dispatchEvent(new Event('orderPlaced'));
      window.dispatchEvent(new Event('cartUpdated'));
      
      setOrderDetails(newOrder);
      setOrderPlaced(true);
      if (onOrderPlaced) onOrderPlaced();
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
    } else {
      alert(response.message || 'Failed to place order');
    }
  } catch (error) {
    console.error('Order error:', error);
    alert('Failed to place order. Please try again.');
  } finally {
    setSubmitting(false);
  }
};

  if (!isOpen) return null;

  if (orderPlaced && orderDetails) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheckCircle className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed! ✅</h2>
          <p className="text-gray-600 mb-4">Your order has been received successfully.</p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-mono font-semibold mb-2">{orderDetails._id}</p>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-gold font-bold text-xl">{orderDetails.totalPrice.toLocaleString()} RWF</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-4 text-left">
            <h3 className="font-semibold mb-2">📍 Pickup Instructions</h3>
            <p className="text-sm text-gray-600">Please come to our shop at:</p>
            <p className="font-medium">Universal Dressmaking Shop</p>
            <p className="text-sm">KG 123 St, Kigali, Rwanda</p>
            <p className="text-sm mt-2">⏱ Bring your order ID and ID card</p>
            <p className="text-sm">📞 Call us: +250 788 123 456</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link
              to="/orders"
              onClick={onClose}
              className="bg-gold text-primary py-3 rounded-lg hover:bg-gold/90 transition font-semibold flex items-center justify-center gap-2"
            >
              <FaShoppingBag size={18} /> View My Orders
            </Link>
            <a
              href={`https://wa.me/250788123456?text=Hello!%20I%20placed%20order%20${orderDetails._id}%20for%20${product.name}.%20I'll%20pick%20it%20up%20soon.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <FaWhatsapp size={20} /> Contact via WhatsApp
            </a>
            <button
              onClick={onClose}
              className="border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Complete Your Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-5">
          {/* Product Summary */}
          <div className="flex gap-3 mb-5 pb-4 border-b">
            <img 
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
            />
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gold font-bold">{formatPrice(product.price)}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
            </div>
            
            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaPhone className="inline mr-2 text-gold" /> Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            
            {/* Pickup Location */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                <FaMapMarkerAlt className="inline mr-2 text-gold" /> Pickup Location *
              </label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="">Select pickup location</option>
                <option value="Kigali Main Shop">🏪 Kigali Main Shop - KG 123 St</option>
                <option value="Downtown Branch">🏪 Downtown Branch - Commercial Area</option>
                <option value="Kimironko Market">🏪 Kimironko Market - Textile Section</option>
              </select>
            </div>
            
            {/* Notes */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Additional Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="2"
                placeholder="Special instructions, preferred pickup time, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{(product.price * quantity).toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Pickup Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-gold">{(product.price * quantity).toLocaleString()} RWF</span>
                </div>
              </div>
            </div>
            
            {/* Place Order Button */}
            <button
              type="submit"
              disabled={submitting}
              className="relative w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-lg overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #DAA520 100%)',
                color: '#1a1a2e'
              }}
            >
              <span className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <FaStore size={20} />
                  Place Order - Pay at Pickup
                  <FaArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
              <span>💳 Cash</span>
              <span>•</span>
              <span>📱 Mobile Money</span>
              <span>•</span>
              <span>🏦 Bank Transfer</span>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              Pay when you pick up at our shop. No online payment required.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
const ProductCard = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  isWishlisted = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);
  const [wishlistFeedback, setWishlistFeedback] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);

  if (!product || !product._id) {
    return null;
  }

  const rating = product.rating || product.averageRating || 4.5;
  const reviewCount = product.reviewCount || product.totalReviews || 0;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 10;
  
  const imageUrl = useMemo(() => getImageUrl(product.image), [product.image]);
  const formattedPrice = useMemo(() => formatPrice(product.price), [product.price]);
  
  const handleAddToCart = useCallback(async () => {
    if (isOutOfStock) return;
    
    setIsAddingToCart(true);
    setCartFeedback(true);
    
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = existingCart.findIndex(item => item._id === product._id);
    
    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        style: product.style,
        category: product.category,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    setTimeout(() => {
      setCartFeedback(false);
      setIsAddingToCart(false);
    }, 1500);
    
    if (onAddToCart) onAddToCart(product);
  }, [product, isOutOfStock, onAddToCart]);
  
  const handleAddToWishlist = useCallback(() => {
  setWishlistFeedback(true);
  setTimeout(() => setWishlistFeedback(false), 1500);
  
  // Get existing wishlist from localStorage
  const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const exists = existingWishlist.some(item => item._id === product._id);
  
  if (exists) {
    const newWishlist = existingWishlist.filter(item => item._id !== product._id);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  } else {
    existingWishlist.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      style: product.style,
      category: product.category
    });
    localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
  }
  
  // ✅ Dispatch custom event to update Navbar
  window.dispatchEvent(new Event('wishlistUpdated'));
  
  if (onAddToWishlist) onAddToWishlist(product);
}, [product, onAddToWishlist]);

  const checkIsWishlisted = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item._id === product._id);
  };

  const [localWishlisted, setLocalWishlisted] = useState(checkIsWishlisted);

  useEffect(() => {
    setLocalWishlisted(isWishlisted || checkIsWishlisted());
  }, [isWishlisted, product._id]);

  const whatsappMessage = `Hello! I'm interested in ${product.name} priced at ${formattedPrice}. Is it available?`;

  return (
    <>
      <motion.div
        className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={imgError ? '/images/placeholder.jpg' : imageUrl}
            alt={product.name || 'Product'}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
            loading="lazy"
            onClick={() => window.location.href = `/product/${product._id}`}
            onError={() => setImgError(true)}
          />
          
          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
              Out of Stock
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full z-10">
              Only {product.stock} left
            </div>
          )}

          {/* Style Badge */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full z-10">
            {product.style || 'Style'}
          </div>

          {/* Hover Overlay Icons - Removed wishlist */}
<div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-all duration-300 z-10 ${
  isHovered ? 'opacity-100' : 'opacity-0'
}`}>
  <Link
    to={`/product/${product._id}`}
    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gold hover:text-white transition transform hover:scale-110"
  >
    <FaEye size={18} />
  </Link>
  
  <button
    onClick={handleAddToCart}
    disabled={isOutOfStock}
    className={`w-10 h-10 bg-white rounded-full flex items-center justify-center transition transform hover:scale-110 ${
      isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold hover:text-white'
    }`}
  >
    <FaShoppingBag size={16} />
  </button>
</div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category and Rating */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-gray-500 uppercase bg-gray-100 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <StarRating rating={rating} />
              {reviewCount > 0 && <span className="text-xs text-gray-400">({reviewCount})</span>}
            </div>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-gray-800 hover:text-gold transition line-clamp-2 mb-2 text-sm">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mb-3">
            <span className="text-xl font-bold text-gold">{formattedPrice}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* Buy Now Button */}
            <button
              onClick={() => setShowBuyModal(true)}
              disabled={isOutOfStock}
              className={`w-full py-2 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                isOutOfStock 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <FaBolt size={14} /> Buy Now
            </button>
            
            {/* Secondary Buttons Row */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                  isOutOfStock 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                <FaShoppingBag size={14} /> 
                {isAddingToCart ? 'Added!' : 'Add to Cart'}
              </button>
              
              <Link
                to={`/book-tailoring?cloth=${product._id}`}
                className="px-3 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-1 border border-gold text-gold hover:bg-gold hover:text-primary"
              >
                <FaCut size={14} /> Tailor
              </Link>
            </div>
            
            {/* WhatsApp Inquiry */}
            <a
              href={`https://wa.me/250788123456?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-green-600 transition"
            >
              <FaWhatsapp size={14} /> Inquire on WhatsApp
            </a>
          </div>

          {/* Stock Status */}
          {!isOutOfStock && (
            <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
              In Stock
            </p>
          )}
        </div>
      </motion.div>

      {/* Buy Now Modal */}
      <BuyNowModal
        product={product}
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onOrderPlaced={() => {
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </>
  );
};

export default ProductCard;