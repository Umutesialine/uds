import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaCut, 
  FaStar, 
  FaCreditCard, 
  FaHeadset, 
  FaTruck, 
  FaShieldAlt, 
  FaClock,
  FaRegStar,
  FaUserCheck,
  FaPaintBrush
} from 'react-icons/fa';
import ProductGrid from '../components/product/ProductGrid';
import clothService from '../services/clothService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await clothService.getAllClothes();
setFeaturedProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
        setFeaturedProducts([
          { _id: '1', name: 'Kitenge Maxi Dress', price: 55000, style: 'Kitenge', category: 'women', stock: 10, image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300' },
          { _id: '2', name: 'Modern Ankara Blouse', price: 35000, style: 'modern', category: 'women', stock: 15, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300' },
          { _id: '3', name: 'African Print Shirt', price: 45000, style: 'Kitenge', category: 'men', stock: 8, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300' },
          { _id: '4', name: 'Kids Kitenge Set', price: 25000, style: 'Kitenge', category: 'kids', stock: 20, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=300' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const features = [
    {
      icon: <FaCut className="w-12 h-12 text-secondary" />,
      title: "Quality Tailoring",
      description: "Expert craftsmanship with attention to every detail, ensuring perfect fit and finish."
    },
    {
      icon: <FaCreditCard className="w-12 h-12 text-secondary" />,
      title: "Secure Payments",
      description: "Safe and protected checkout process with multiple payment options available."
    },
    {
      icon: <FaHeadset className="w-12 h-12 text-secondary" />,
      title: "Customer Support",
      description: "We're here to help you 24/7 with any questions or concerns you may have."
    }
  ];

  return (
    <div>
      {/* Hero Section - Redesigned */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-dark-bg">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold/20 rounded-full"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-gold/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                  <span className="text-gold text-sm font-medium tracking-wide">SINCE 2015</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Universal{' '}
                  <span className="text-gold relative inline-block">
                    Dressmaking
                    <svg className="absolute -bottom-2 left-0 w-full" height="4" viewBox="0 0 200 4">
                      <path d="M0,2 Q50,0 100,2 T200,2" fill="none" stroke="#D4AF37" strokeWidth="2"/>
                    </svg>
                  </span>
                  <br />
                  <span className="text-3xl md:text-4xl lg:text-5xl text-gray-300">African Fashion Designed for You</span>
                </h1>
                
                <p className="text-gray-300 text-lg mb-8 max-w-xl lg:mx-0 mx-auto">
                  Discover our unique collection of authentic African designs. 
                  From traditional Kitenge to modern styles, find your perfect look.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link to="/shop" className="btn-primary flex items-center gap-2 group">
                    Browse Collection 
                    <FaArrowRight className="group-hover:translate-x-1 transition" size={18} />
                  </Link>
                  <Link to="/book-tailoring" className="btn-gold flex items-center gap-2 group">
                    Book Tailoring
                    <FaCut className="group-hover:rotate-12 transition" size={18} />
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl font-bold text-gold">500+</p>
                    <p className="text-xs text-gray-400">Happy Clients</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gold">1000+</p>
                    <p className="text-xs text-gray-400">Designs Created</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gold">50+</p>
                    <p className="text-xs text-gray-400">African Styles</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/30 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gold/30 rounded-full blur-2xl"></div>
                <div className="relative bg-gradient-to-br from-gold/20 to-secondary/20 rounded-2xl p-3 backdrop-blur-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600" 
                    alt="African Fashion Model"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3 animate-bounce">
                  <div className="bg-gold rounded-full p-2">
                    <FaStar size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-primary font-bold">4.9 Rating</p>
                    <p className="text-xs text-gray-500">500+ Reviews</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-light-bg">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="feature-card group"
              >
                <div className="mb-4 inline-block p-4 bg-secondary/10 rounded-full group-hover:bg-secondary/20 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Featured Collections</h2>
            <p className="section-subtitle">
              Discover our most loved African and modern fashion pieces
            </p>
          </motion.div>
          
          <ProductGrid 
            products={featuredProducts}
            loading={loading}
          />
          
          <div className="text-center mt-12">
            <Link to="/shop" className="btn-outline inline-flex items-center gap-2 group">
              View All Products
              <FaArrowRight className="group-hover:translate-x-1 transition" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-secondary to-primary text-white">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for Your Custom Design?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Let us create a unique piece that reflects your style and personality.
              Book your tailoring session today.
            </p>
            <Link to="/book-tailoring" className="btn-gold inline-flex items-center gap-2 group">
              Book Your Appointment
              <FaArrowRight className="group-hover:translate-x-1 transition" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;