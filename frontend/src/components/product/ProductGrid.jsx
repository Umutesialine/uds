import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGrid = ({ products, loading }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    updateCounts();
  }, []);

  const updateCounts = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setCartCount(cart.length);
    setWishlistCount(wishlist.length);
  };

  // Add to Cart function
  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = existingCart.findIndex(item => item._id === product._id);
    
    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1;
    } else {
      existingCart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        style: product.style,
        category: product.category,
        stock: product.stock,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    updateCounts();
  };

  // Add to Wishlist function
  const handleAddToWishlist = (product) => {
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
    updateCounts();
  };

  // Check if product is in wishlist
  const isProductInWishlist = (productId) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item._id === productId);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <div className="text-7xl mb-4">👗</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
        <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  const validProducts = products.filter(product => product && product._id);
  
  if (validProducts.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
        <div className="text-7xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Valid Products</h3>
        <p className="text-gray-500">Unable to load products. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      {/* Cart & Wishlist Counters (Optional) */}
      {(cartCount > 0 || wishlistCount > 0) && (
        <div className="fixed bottom-20 right-4 z-40 space-y-2">
          {cartCount > 0 && (
            <div className="bg-primary text-white rounded-full px-3 py-1 text-xs shadow-lg">
              🛒 {cartCount} items in cart
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {validProducts.map((product, index) => {
          const isWishlisted = isProductInWishlist(product._id);
          
          return (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 8) * 0.05 }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isWishlisted={isWishlisted}
              />
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default ProductGrid;