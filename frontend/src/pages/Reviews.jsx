import { Link } from 'react-router-dom';
import { FaStar, FaRegStar, FaPlus } from 'react-icons/fa';

const Reviews = () => {
  const userReviews = [];

  if (userReviews.length === 0) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaStar className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">No Reviews Yet</h2>
        <p className="text-gray-600 mb-8">Share your experience with products you've purchased</p>
        <Link to="/orders" className="btn-primary inline-flex items-center gap-2">
          View Your Orders <FaArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <Link to="/orders" className="text-gold hover:underline">Write a Review</Link>
      </div>
      <div className="space-y-4">
        {userReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-4 shadow">
            <div className="flex gap-4">
              <img src={review.image} alt={review.productName} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{review.productName}</h3>
                <div className="flex items-center gap-1 my-1">
                  {[...Array(5)].map((_, i) => (
                    i < review.rating ? 
                      <FaStar key={i} className="text-gold text-sm" /> : 
                      <FaRegStar key={i} className="text-gray-300 text-sm" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;