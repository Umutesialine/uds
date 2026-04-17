import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowRight, FaWhatsapp, FaTag, FaTruck } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
    calculateTotals(savedCart);
  };

  const calculateTotals = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    setSubtotal(sum);
    setTotal(sum); // Add shipping logic here if needed
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      localStorage.setItem('cart', '[]');
      setCartItems([]);
      calculateTotals([]);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaShoppingBag className="text-5xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items yet</p>
        <Link to="/shop" className="btn-gold inline-flex items-center gap-2 px-8 py-3">
          Continue Shopping <FaArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Shopping Cart</h1>
      <p className="text-gray-500 mb-6">{cartItems.length} items in your cart</p>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-600 border-b">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            {/* Items */}
            <div className="divide-y">
              {cartItems.map((item) => (
                <div key={item._id} className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <img 
                      src={item.image ? `http://localhost:5000${item.image}` : '/images/placeholder.jpg'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:text-gold transition">
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500">{item.style} | {item.category}</p>
                        </div>
                        
                        {/* Mobile Price */}
                        <div className="md:hidden">
                          <p className="text-gold font-bold">{item.price.toLocaleString()} RWF</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        
                        {/* Desktop Price */}
                        <div className="hidden md:block w-24 text-center">
                          <span className="text-gray-800 font-medium">{item.price.toLocaleString()} RWF</span>
                        </div>
                        
                        {/* Total */}
                        <div className="w-24 text-right">
                          <span className="font-bold text-gold">{(item.price * (item.quantity || 1)).toLocaleString()} RWF</span>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Remove item"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between gap-3">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700 transition text-sm"
              >
                Clear Cart
              </button>
              <Link to="/shop" className="text-gold hover:text-secondary transition text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">{subtotal.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 flex items-center gap-1"><FaTruck size={12} /> Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Estimated Tax</span>
                <span>Included</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl text-gold">{total.toLocaleString()} RWF</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Free shipping on orders over 100,000 RWF</p>
            </div>
            
            <button
              onClick={handleCheckout}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3 mb-3"
            >
              Proceed to Checkout <FaArrowRight size={16} />
            </button>
            
            <a
              href="https://wa.me/250788123456?text=Hello!%20I%20need%20help%20with%20my%20cart"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
            >
              <FaWhatsapp size={18} /> Need Help? Chat with us
            </a>
            
            {/* Payment Methods */}
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-xs text-gray-500 mb-2">Secure Payment Methods</p>
              <div className="flex justify-center gap-2 text-2xl">
                <span>💳</span> <span>📱</span> <span>🏦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;