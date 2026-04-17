import { useState, useEffect } from 'react';
import { FaSpinner, FaEye, FaSyncAlt, FaSearch, FaTrash } from 'react-icons/fa';
import bookingService from '../../services/bookingService';
import StatusBadge from '../../components/admin/StatusBadge';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      let data;
      if (statusFilter) {
        data = await bookingService.getBookingsByStatus(statusFilter);
      } else {
        data = await bookingService.getAllBookings();
      }
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const result = await bookingService.updateBookingStatus(bookingId, newStatus);
      if (result.success) {
        alert(`Booking status updated to ${newStatus}`);
        fetchBookings();
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
      return;
    }
    
    setDeleting(true);
    try {
      const success = await bookingService.deleteBooking(bookingId);
      if (success) {
        alert('Booking deleted successfully!');
        fetchBookings();
        if (selectedBooking?._id === bookingId) {
          setShowDetails(false);
          setSelectedBooking(null);
        }
      } else {
        alert('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.cloth?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      default: return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bookings Management</h1>
        <p className="text-gray-500">View, manage, and delete customer tailoring bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or design..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={fetchBookings}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <FaSyncAlt size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Design</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked On</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium">{booking.user?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{booking.user?.phone}</p>
                   </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{booking.cloth?.name || 'Custom Design'}</p>
                    <p className="text-xs text-gray-500">{booking.cloth?.style}</p>
                   </td>
                  <td className="px-6 py-4">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                   </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                      className={`px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gold ${
                        booking.status === 'cancelled' ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                   </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(booking.createdAt).toLocaleDateString()}
                   </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetails(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <FaEye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        disabled={deleting}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
        
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <div className="space-y-4">
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
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="font-medium">{selectedBooking.user?.name}</p>
                <p>{selectedBooking.user?.email}</p>
                <p>{selectedBooking.user?.phone}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Design Details</h3>
                <p className="font-medium">{selectedBooking.cloth?.name || 'Custom Design'}</p>
                <p className="text-sm text-gray-500">Style: {selectedBooking.cloth?.style}</p>
                <p className="text-sm text-gray-500">Category: {selectedBooking.cloth?.category}</p>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Measurements</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedBooking.measurements}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Schedule</h3>
                <p><span className="text-gray-500">Preferred Date:</span> {new Date(selectedBooking.preferredDate).toLocaleDateString()}</p>
                <p><span className="text-gray-500">Status:</span> 
                  <span className={`inline-block ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedBooking.status)}`}>
                    {getStatusText(selectedBooking.status)}
                  </span>
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleDeleteBooking(selectedBooking._id)}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <FaTrash size={16} /> Delete Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;