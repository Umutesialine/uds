import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlistItems(JSON.parse(saved));
    }
  };

  const removeFromWishlist = (productId) => {
    const updated = wishlistItems.filter(item => item._id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlistItems(updated);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaHeart className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-8">Save your favorite items here</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Start Shopping <FaArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlistItems.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item._id} className="bg-white rounded-xl shadow overflow-hidden">
            <img 
              src={item.image ? `http://localhost:5000${item.image}` : '/images/placeholder.jpg'}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold line-clamp-1">{item.name}</h3>
              <p className="text-gold font-bold mt-1">{item.price.toLocaleString()} RWF</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => addToCart(item)}
                  className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-primary/90 transition flex items-center justify-center gap-1"
                >
                  <FaShoppingBag size={14} /> Add to Cart
                </button>
                <button 
                  onClick={() => removeFromWishlist(item._id)}
                  className="p-2 border border-red-300 rounded-lg text-red-500 hover:bg-red-50 transition"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;