import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaEye, FaSpinner, FaCut, FaWhatsapp, FaClock, FaCheckCircle, FaTimesCircle, FaTrash } from 'react-icons/fa';
import bookingService from '../services/bookingService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
    
    // Listen for new bookings
    window.addEventListener('bookingPlaced', fetchBookings);
    return () => window.removeEventListener('bookingPlaced', fetchBookings);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // First try to get bookings from backend
      let backendBookings = [];
      try {
        backendBookings = await bookingService.getUserBookings();
      } catch (error) {
        console.log('Backend bookings not available');
      }
      
      // Also get bookings from localStorage
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      
      // Combine and deduplicate by _id
      const allBookings = [...backendBookings, ...localBookings];
      const uniqueBookings = allBookings.filter((booking, index, self) => 
        index === self.findIndex(b => b._id === booking._id)
      );
      
      // Filter out cancelled bookings (don't show them at all)
      const activeBookings = uniqueBookings.filter(booking => booking.status?.toLowerCase() !== 'cancelled');
      
      // Sort by date (newest first)
      activeBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setBookings(activeBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const activeBookings = localBookings.filter(booking => booking.status?.toLowerCase() !== 'cancelled');
      setBookings(activeBookings);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    
    try {
      // Delete from localStorage (permanently remove)
      const localBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      const updatedLocalBookings = localBookings.filter(booking => booking._id !== bookingId);
      localStorage.setItem('bookings', JSON.stringify(updatedLocalBookings));
      
      // Try to delete from backend if API exists
      try {
        await bookingService.cancelBooking(bookingId);
      } catch (error) {
        console.log('Backend cancel API not available');
      }
      
      // Update state - remove the booking completely
      setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
      
      // Close modal if open
      if (selectedBooking?._id === bookingId) {
        setShowDetails(false);
        setSelectedBooking(null);
      }
      
      alert('Booking deleted successfully!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <FaClock size={14} className="text-yellow-500" />;
      case 'confirmed': return <FaCheckCircle size={14} className="text-blue-500" />;
      case 'in-progress': return <FaCut size={14} className="text-purple-500" />;
      case 'completed': return <FaCheckCircle size={14} className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle size={14} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'in-progress': return 'In Progress';
      default: return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
    }
  };

  const canDeleteBooking = (status) => {
    // Allow deletion only for pending or confirmed bookings
    return ['pending', 'confirmed'].includes(status?.toLowerCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-gold text-4xl" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCut className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h2>
        <p className="text-gray-500 mb-6">You haven't made any tailoring bookings yet</p>
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          Browse Designs
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
      <p className="text-gray-500 mb-6">Track and manage your tailoring bookings ({bookings.length} active)</p>
      
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-xs text-gray-500">Booking ID</p>
                <p className="font-mono text-sm font-semibold">#{booking._id?.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Design</p>
                <p className="text-sm font-medium">{booking.cloth?.name || 'Custom Design'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Preferred Date</p>
                <p className="text-sm">{new Date(booking.preferredDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <div className="flex items-center gap-1">
                  {getStatusIcon(booking.status)}
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowDetails(true);
                  }}
                  className="text-gold hover:text-secondary transition flex items-center gap-1 text-sm"
                >
                  <FaEye size={14} /> View
                </button>
                {canDeleteBooking(booking.status) && (
                  <button
                    onClick={() => handleDeleteBooking(booking._id)}
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

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-mono text-sm">{selectedBooking._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booked On</p>
                  <p>{new Date(selectedBooking.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Design Details</p>
                <p className="font-semibold">{selectedBooking.cloth?.name || 'Custom Design'}</p>
                <p className="text-sm text-gray-500">Style: {selectedBooking.cloth?.style}</p>
                <p className="text-sm text-gray-500">Category: {selectedBooking.cloth?.category}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="flex items-center gap-1 mt-1">
                  {getStatusIcon(selectedBooking.status)}
                  <span className={`inline-block px-2 py-1 text-sm rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusText(selectedBooking.status)}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Measurements</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {selectedBooking.measurements}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Preferred Date</p>
                <p>{new Date(selectedBooking.preferredDate).toLocaleDateString()}</p>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Tailoring Process</p>
                <div className="relative">
                  <div className="flex justify-between mb-2">
                    {['pending', 'confirmed', 'in-progress', 'completed'].map((step, idx) => {
                      const stepIndex = ['pending', 'confirmed', 'in-progress', 'completed'].indexOf(selectedBooking.status?.toLowerCase() || 'pending');
                      const isActive = idx <= stepIndex;
                      return (
                        <div key={step} className="text-center flex-1">
                          <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                            isActive ? 'bg-gold text-primary' : 'bg-gray-200 text-gray-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <p className={`text-xs mt-1 ${isActive ? 'text-gold font-semibold' : 'text-gray-400'}`}>
                            {step === 'in-progress' ? 'Cutting/Sewing' : step.charAt(0).toUpperCase() + step.slice(1)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                    <div className="h-full bg-gold transition-all duration-500" style={{ width: `${['pending', 'confirmed', 'in-progress', 'completed'].indexOf(selectedBooking.status?.toLowerCase() || 'pending') * 33}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                {canDeleteBooking(selectedBooking.status) && (
                  <button
                    onClick={() => {
                      handleDeleteBooking(selectedBooking._id);
                      setShowDetails(false);
                    }}
                    disabled={deleting}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                  >
                    <FaTrash size={16} /> Cancel Booking
                  </button>
                )}
                <a
                  href={`https://wa.me/250788123456?text=Hello!%20I%20have%20a%20question%20about%20my%20tailoring%20booking%20${selectedBooking._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <FaWhatsapp size={18} /> Contact Tailor
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;