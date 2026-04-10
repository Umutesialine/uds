import { FaRegStar } from 'react-icons/fa';

const ProductCard = ({ product, loading, onAddToCart, onAddToWishlist, wishlistItems = [] }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Image */}
      <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Category & Rating */}
        <div className="flex justify-between items-start mb-2">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <FaRegStar key={i} className="text-gray-200 text-xs" />
            ))}
          </div>
        </div>
        
        {/* Product Name */}
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-3"></div>
        
        {/* Price */}
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
        
        {/* Button */}
        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
};

export default ProductCard;