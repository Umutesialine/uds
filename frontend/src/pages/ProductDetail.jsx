import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSpinner, FaWhatsapp, FaCut, FaArrowLeft } from 'react-icons/fa';
import clothService from '../services/clothService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await clothService.getClothById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom py-20 flex justify-center">
        <FaSpinner className="animate-spin text-gold text-5xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/shop" className="text-gold hover:underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-gold mb-6">
        <FaArrowLeft size={14} /> Back to Shop
      </Link>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
          <img 
            src={product.image ? `http://localhost:5000${product.image}` : '/images/placeholder.jpg'}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
          <p className="text-gold text-2xl font-bold mb-4">{product.price.toLocaleString()} RWF</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="space-y-3 mb-6">
            <p><span className="font-semibold">Category:</span> {product.category}</p>
            <p><span className="font-semibold">Style:</span> {product.style}</p>
            <p><span className="font-semibold">Stock:</span> {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              className="btn-primary flex-1"
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
            <Link 
              to={`/book-tailoring?cloth=${product._id}`}
              className="btn-gold flex-1 flex items-center justify-center gap-2"
            >
              <FaCut /> Book Tailoring
            </Link>
          </div>
          
          <a 
            href={`https://wa.me/250788123456?text=Hello!%20I'm%20interested%20in%20${product.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full mt-4 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
          >
            <FaWhatsapp size={20} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;