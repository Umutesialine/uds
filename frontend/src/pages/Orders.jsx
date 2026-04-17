import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaEye, FaSpinner, FaWhatsapp, FaCheckCircle, FaClock, FaTimesCircle, FaTrash } from 'react-icons/fa';
import orderService from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Listen for new orders
    window.addEventListener('orderPlaced', fetchOrders);
    return () => window.removeEventListener('orderPlaced', fetchOrders);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // First try to get orders from backend
      let backendOrders = [];
      try {
        backendOrders = await orderService.getUserOrders();
      } catch (error) {
        console.log('Backend orders not available');
      }
      
      // Also get orders from localStorage
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Combine and deduplicate by _id
      const allOrders = [...backendOrders, ...localOrders];
      const uniqueOrders = allOrders.filter((order, index, self) => 
        index === self.findIndex(o => o._id === order._id)
      );
      
      // Filter out cancelled orders (don't show them at all)
      const activeOrders = uniqueOrders.filter(order => order.status?.toLowerCase() !== 'cancelled');
      
      // Sort by date (newest first)
      activeOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(activeOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const activeOrders = localOrders.filter(order => order.status?.toLowerCase() !== 'cancelled');
      setOrders(activeOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    
    try {
      // ✅ Delete from localStorage (permanently remove, not just status change)
      const localOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedLocalOrders = localOrders.filter(order => order._id !== orderId);
      localStorage.setItem('orders', JSON.stringify(updatedLocalOrders));
      
      // Try to delete from backend if API exists
      try {
        // If you have a delete endpoint, call it here
        // await orderService.deleteOrder(orderId);
      } catch (error) {
        console.log('Backend delete API not available');
      }
      
      // Update state - remove the order completely
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
      
      // Close modal if open
      if (selectedOrder?._id === orderId) {
        setShowDetails(false);
        setSelectedOrder(null);
      }
      
      alert('Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FaClock size={14} className="text-yellow-500" />;
      case 'completed': return <FaCheckCircle size={14} className="text-green-500" />;
      default: return null;
    }
  };

  const canDeleteOrder = (status) => {
    // Allow deletion only for pending orders
    return status?.toLowerCase() === 'pending';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-gold text-4xl" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaShoppingBag className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
      <p className="text-gray-500 mb-6">Track and manage your orders ({orders.length} active)</p>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-sm font-semibold">#{order._id?.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Items</p>
                <p className="text-sm">{order.items?.length || 1} item(s)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-bold text-gold">{order.totalPrice?.toLocaleString()} RWF</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetails(true);
                  }}
                  className="text-gold hover:text-secondary transition flex items-center gap-1 text-sm"
                >
                  <FaEye size={14} /> View
                </button>
                {canDeleteOrder(order.status) && (
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={deleting}
                    className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm"
                  >
                    <FaTrash size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Order Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-mono text-sm">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-1 mt-1">
                  {getStatusIcon(selectedOrder.status)}
                  <span className={`inline-block px-2 py-1 text-sm rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status || 'Pending'}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Contact Phone</p>
                <p className="font-medium">{selectedOrder.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>
                <p className="font-medium">{selectedOrder.address || 'Kigali Main Shop'}</p>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-500">Additional Notes</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{(item.price * item.quantity).toLocaleString()} RWF</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <p className="font-bold">Total</p>
                  <p className="text-xl font-bold text-gold">{selectedOrder.totalPrice?.toLocaleString()} RWF</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Pickup Instructions</p>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-sm">📍 Come to: Universal Dressmaking Shop</p>
                  <p className="text-sm">📞 Call: +250 788 123 456</p>
                  <p className="text-sm">⏱ Bring your order ID and ID card</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                {canDeleteOrder(selectedOrder.status) && (
                  <button
                    onClick={() => {
                      handleDeleteOrder(selectedOrder._id);
                      setShowDetails(false);
                    }}
                    disabled={deleting}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                  >
                    <FaTrash size={16} /> Cancel & Delete Order
                  </button>
                )}
                <a
                  href={`https://wa.me/250788123456?text=Hello!%20I%20have%20a%20question%20about%20my%20order%20${selectedOrder._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={18} /> Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;