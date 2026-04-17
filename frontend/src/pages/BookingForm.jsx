import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaCut, FaWhatsapp, FaArrowLeft, FaSpinner, FaCalendarAlt, FaRuler } from 'react-icons/fa';
import clothService from '../services/clothService';
import bookingService from '../services/bookingService';

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const clothId = searchParams.get('cloth');
  
  const [cloth, setCloth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    measurements: '',
    preferredDate: '',
    specialInstructions: '',
  });

  useEffect(() => {
    const fetchCloth = async () => {
      if (clothId) {
        try {
          const data = await clothService.getClothById(clothId);
          setCloth(data);
        } catch (error) {
          console.error('Error fetching cloth:', error);
          setMessage({ type: 'error', text: 'Failed to load product details' });
        }
      }
      setLoading(false);
    };
    fetchCloth();
  }, [clothId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.measurements) {
      setMessage({ type: 'error', text: 'Please provide your measurements' });
      return;
    }
    
    if (!formData.preferredDate) {
      setMessage({ type: 'error', text: 'Please select a preferred date' });
      return;
    }
    
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    
    try {
      const bookingData = {
        cloth: clothId,
        measurements: formData.measurements,
        preferredDate: formData.preferredDate,
      };
      
      const response = await bookingService.createBooking(bookingData);
      
      // Also save to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const newBooking = {
        _id: response.booking?._id || 'BKG' + Date.now() + Math.random().toString(36).substr(2, 8),
        cloth: cloth,
        measurements: formData.measurements,
        preferredDate: formData.preferredDate,
        specialInstructions: formData.specialInstructions,
        status: 'pending',
        createdAt: new Date().toISOString(),
        user: user
      };
      
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.unshift(newBooking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));
      
      // Dispatch event to update bookings page
      window.dispatchEvent(new Event('bookingPlaced'));
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Booking created successfully! Redirecting...' });
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to create booking' });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setMessage({ type: 'error', text: 'Failed to create booking' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-20 flex justify-center">
        <FaSpinner className="animate-spin text-gold text-5xl" />
      </div>
    );
  }

  return (
    <div className="container-custom py-8 max-w-3xl mx-auto">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-gold transition mb-6">
        <FaArrowLeft size={14} /> Back to Shop
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCut className="text-gold text-3xl" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Book Custom Tailoring</h1>
          <p className="text-gray-600 mt-2">Get your perfect fit with our expert tailors</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {cloth && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 flex gap-4">
            <img 
              src={cloth.image ? `http://localhost:5000${cloth.image}` : '/images/placeholder.jpg'}
              alt={cloth.name}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-primary">{cloth.name}</h3>
              <p className="text-gold font-bold">{cloth.price.toLocaleString()} RWF</p>
              <p className="text-sm text-gray-500">Style: {cloth.style} | Category: {cloth.category}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaRuler className="inline mr-2 text-gold" /> Your Measurements *
            </label>
            <textarea
              name="measurements"
              value={formData.measurements}
              onChange={handleChange}
              rows="5"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Enter your measurements (bust, waist, hips, length, shoulder, etc.)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Need help? Contact us on WhatsApp for measurement guidance
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaCalendarAlt className="inline mr-2 text-gold" /> Preferred Date *
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Special Instructions (Optional)</label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Fabric preferences, color preferences, design modifications, etc."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              {submitting ? <FaSpinner className="animate-spin" /> : <FaCut size={18} />}
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
            <a
              href={`https://wa.me/250788123456?text=Hello!%20I%20want%20to%20book%20custom%20tailoring%20for%20${cloth?.name || 'a design'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <FaWhatsapp size={18} /> WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;