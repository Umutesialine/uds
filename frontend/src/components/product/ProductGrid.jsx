import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaHeart, FaRegHeart, FaEye, FaShoppingBag, FaCut } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, loading, onAddToCart, onAddToWishlist, wishlistItems = [] }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Helper function to get average rating (will come from API)
  const getAverageRating = (product) => {
    if (product.averageRating) return product.averageRating;
    return 4.5; // Default fallback
  };

  // Helper function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-gold text-xs" />
        ))}
        {hasHalfStar && <FaStar className="text-gold text-xs opacity-50" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-gray-400 text-xs" />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCard key={i} loading={true} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👗</div>
        <h3 className="text-xl font-semibold text-primary mb-2">No Products Found</h3>
        <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const isWishlisted = wishlistItems.includes(product._id);
        const rating = getAverageRating(product);
        
        return (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative"
            onMouseEnter={() => setHoveredProduct(product._id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              
              {/* Image Container */}
              <Link to={`/product/${product._id}`} className="relative block overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={product.image || 'https://via.placeholder.com/400x500?text=No+Image'}
                  alt={product.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Stock Badge */}
                {product.stock === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
                {product.stock > 0 && product.stock < 10 && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Low Stock: {product.stock}
                  </div>
                )}
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-3 right-3 bg-gold text-primary text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}% OFF
                  </div>
                )}

                {/* Style Badge */}
                <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {product.style}
                </div>

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-all duration-300 ${
                  hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <Link
                    to={`/product/${product._id}`}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-gold hover:text-white transition transform hover:scale-110"
                  >
                    <FaEye size={18} />
                  </Link>
                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-gold hover:text-white transition transform hover:scale-110"
                    disabled={product.stock === 0}
                  >
                    <FaShoppingBag size={16} />
                  </button>
                  <button
                    onClick={() => onAddToWishlist?.(product)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-gold hover:text-white transition transform hover:scale-110"
                  >
                    {isWishlisted ? <FaHeart className="text-red-500" size={16} /> : <FaRegHeart size={16} />}
                  </button>
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                {/* Category & Rating */}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(rating)}
                    <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 12})</span>
                  </div>
                </div>

                {/* Product Name */}
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-semibold text-primary hover:text-gold transition line-clamp-2 mb-2 text-sm">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gold">
                    TSh {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      TSh {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/product/${product._id}`}
                    className="flex-1 bg-primary text-white text-center py-2 rounded-lg font-medium hover:bg-primary/90 transition text-sm"
                  >
                    View Details
                  </Link>
                  {product.isCustomizable !== false ? (
                    <Link
                      to={`/book-tailoring?cloth=${product._id}`}
                      className="px-3 py-2 border border-gold text-gold rounded-lg hover:bg-gold hover:text-primary transition"
                    >
                      <FaCut size={16} />
                    </Link>
                  ) : null}
                </div>

                {/* Stock Status */}
                {product.stock > 0 && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    In Stock
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductGrid;