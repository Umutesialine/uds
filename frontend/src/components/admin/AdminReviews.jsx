import { useState, useEffect } from 'react';
import { FaSpinner, FaTrash, FaStar, FaRegStar, FaSearch, FaUserCircle } from 'react-icons/fa';
import reviewService from '../../services/reviewService';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = ratingFilter ? { rating: ratingFilter } : {};
      const data = await reviewService.getAllReviews(params);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;
    
    try {
      const success = await reviewService.deleteReviewByAdmin(selectedReview._id);
      if (success) {
        setReviews(reviews.filter(r => r._id !== selectedReview._id));
        setShowDeleteModal(false);
        setSelectedReview(null);
        alert('Review deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          i < rating ? 
            <FaStar key={i} className="text-gold text-sm" /> : 
            <FaRegStar key={i} className="text-gray-300 text-sm" />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.cloth?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
        <h1 className="text-2xl font-bold text-gray-800">Reviews Management</h1>
        <p className="text-gray-500">View and manage customer reviews</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, product, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars & Up</option>
            <option value="3">3 Stars & Up</option>
            <option value="2">2 Stars & Up</option>
            <option value="1">1 Star & Up</option>
          </select>
          <button
            onClick={fetchReviews}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Reviews Cards */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review._id} className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <FaUserCircle className="text-gold text-2xl" />
                </div>
                <div>
                  <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedReview(review);
                  setShowDeleteModal(true);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <FaTrash size={18} />
              </button>
            </div>
            
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gold">({review.rating}/5)</span>
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm">
                  <span className="text-gray-500">Product:</span>{' '}
                  <span className="font-medium">{review.cloth?.name}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Category: {review.cloth?.category} | Style: {review.cloth?.style}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaStar className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review by <span className="font-semibold">{selectedReview.user?.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedReview(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;