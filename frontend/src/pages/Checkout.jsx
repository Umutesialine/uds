import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaCheckCircle, FaWhatsapp } from 'react-icons/fa';
import orderService from '../services/orderService';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadCart();
    loadUserData();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      if (cart.length === 0) {
        navigate('/cart');
      }
      setCartItems(cart);
    } else {
      navigate('/cart');
    }
  };

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotal = () => {
    return getSubtotal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.address || !formData.city) {
      setMessage({ type: 'error', text: 'Please provide your full address' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          clothId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalPrice: getTotal(),
        address: `${formData.address}, ${formData.city}`,
      };
      
      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        // Clear cart
        localStorage.removeItem('cart');
        setMessage({ type: 'success', text: 'Order placed successfully!' });
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to place order' });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setMessage({ type: 'error', text: 'Failed to place order. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-gold text-4xl" />
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link to="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition mb-6">
        <FaArrowLeft size={14} /> Back to Cart
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-2xl font-bold text-primary mb-6">Checkout</h1>
            
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <div className="flex items-center gap-2">
                  {message.type === 'success' && <FaCheckCircle />}
                  {message.text}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="House number, street name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  placeholder="Special delivery instructions, etc."
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : null}
                {submitting ? 'Placing Order...' : `Place Order • ${getTotal().toLocaleString()} RWF`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Your Order</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} RWF</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{getSubtotal().toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-gold text-xl">{getTotal().toLocaleString()} RWF</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <a
                href="https://wa.me/250788123456?text=Hello!%20I%20have%20a%20question%20about%20my%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition text-sm"
              >
                <FaWhatsapp size={16} /> Questions? Chat with us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;