import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, 
  FaCut, 
  FaTruck,
  FaWhatsapp,
  FaGem
} from 'react-icons/fa';
import ProductGrid from '../components/product/ProductGrid';
import clothService from '../services/clothService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        console.log('📦 Fetching products from API...');
        
        // ✅ Service ALWAYS returns array of valid products
        const allProducts = await clothService.getAllClothes({ limit: 20 });
        
        // ✅ DEBUG: Verify data type
        console.log('✅ Products received:', allProducts);
        console.log('✅ Is array:', Array.isArray(allProducts));
        console.log('✅ Product count:', allProducts.length);
        
        if (allProducts.length > 0) {
          console.log('✅ First product sample:', {
            id: allProducts[0]._id,
            name: allProducts[0].name,
            category: allProducts[0].category
          });
        }
        
        // ✅ Set featured products (first 4)
        setFeaturedProducts(allProducts.slice(0, 4));
        
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  const benefits = [
    {
      icon: <FaGem className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Handcrafted with the finest African fabrics",
      color: "bg-amber-500"
    },
    {
      icon: <FaCut className="w-8 h-8" />,
      title: "Custom Tailoring",
      description: "Get clothes made to your exact measurements",
      color: "bg-emerald-500"
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Quick turnaround on all orders and bookings",
      color: "bg-blue-500"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1600")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                <span className="text-gold text-sm font-medium tracking-wide">UNIVERSAL DRESSMAKING</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Premium African
                <br />
                <span className="text-gold">Fashion</span>
              </h1>
              
              <p className="text-gray-200 text-lg mb-8 max-w-xl">
                Discover stunning handcrafted clothing and custom tailoring services
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-gold flex items-center gap-2 group text-lg px-8 py-3">
                  Shop Now
                  <FaArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
                <Link to="/book-tailoring" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-gold hover:text-primary hover:border-gold transition flex items-center gap-2 group">
                  <FaCut /> Book Tailoring
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20 max-w-md">
                <div>
                  <p className="text-2xl font-bold text-gold">500+</p>
                  <p className="text-xs text-gray-300">Happy Clients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gold">1000+</p>
                  <p className="text-xs text-gray-300">Designs Created</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gold">50+</p>
                  <p className="text-xs text-gray-300">African Styles</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-gold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our curated collections</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Link to="/shop?category=women" className="group block">
              <div className="relative overflow-hidden rounded-2xl shadow-lg h-80">
                <img 
                  src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400" 
                  alt="Women"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500 to-rose-500 opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Women</h3>
                  <p className="text-sm opacity-90">Shop Collection</p>
                </div>
              </div>
            </Link>

            <Link to="/shop?category=men" className="group block">
              <div className="relative overflow-hidden rounded-2xl shadow-lg h-80">
                <img 
                  src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400" 
                  alt="Men"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-indigo-500 opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Men</h3>
                  <p className="text-sm opacity-90">Shop Collection</p>
                </div>
              </div>
            </Link>

            <Link to="/shop?category=kids" className="group block">
              <div className="relative overflow-hidden rounded-2xl shadow-lg h-80">
                <img 
                  src="https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400" 
                  alt="Kids"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500 to-emerald-500 opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold">Kids</h3>
                  <p className="text-sm opacity-90">Shop Collection</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-center mb-12"
          >
            <div>
              <h2 className="section-title mb-0">Featured Collection</h2>
            </div>
            <Link to="/shop" className="text-gold hover:text-secondary font-semibold flex items-center gap-2 group">
              All Products <FaArrowRight className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
          
          <ProductGrid 
            products={featuredProducts}
            loading={loading}
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-white/80 max-w-2xl mx-auto">Experience the best in African fashion</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
              >
                <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-white/80">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/250788123456?text=Hello!%20I'm%20interested%20in%20your%20African%20fashion%20collection"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-110 animate-bounce"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
};

export default Home;