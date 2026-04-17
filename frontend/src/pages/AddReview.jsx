import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft } from 'react-icons/fa';

const AddReview = () => {
  const { clothId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Review submitted successfully!');
    navigate('/reviews');
  };

  return (
    <div className="container-custom py-8 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gold mb-6">
        <FaArrowLeft size={14} /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Write a Review</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <label className="block text-gray-700 mb-3 font-medium">Your Rating</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="text-3xl focus:outline-none"
                >
                  <FaStar 
                    className={`transition ${
                      star <= (hoveredRating || rating) 
                        ? 'text-gold' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full py-3">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;