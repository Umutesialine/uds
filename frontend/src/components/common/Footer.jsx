import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPaperPlane,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaShoppingBag,
  FaShieldAlt, FaTruck, FaSyncAlt, FaCreditCard,
  FaCcVisa, FaCcMastercard, FaPaypal
} from 'react-icons/fa';
import { SiMastercard } from "react-icons/si";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'Returns & Exchanges', path: '/returns' },
  ];

  const categories = [
    { name: "Women's Kitenge", path: '/shop?category=women&style=Kitenge' },
    { name: "Men's African Wear", path: '/shop?category=men&style=Kitenge' },
    { name: "Modern Women's Fashion", path: '/shop?category=women&style=modern' },
    { name: "Kids Traditional Wear", path: '/shop?category=kids' },
    { name: "Accessories", path: '/shop?category=accessories' },
    { name: "Bridal Collection", path: '/shop?category=bridal' },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-6">
      <div className="container-custom">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaShoppingBag className="text-gold text-2xl" />
              <div>
                <span className="font-display font-bold text-xl">Universal</span>
                <span className="font-display font-bold text-xl text-gold ml-1">Dressmaking</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Bringing authentic African fashion to the world. Quality Kitenge, Ankara, 
              and modern designs tailored just for you.
            </p>
            <div className="flex space-x-3">
              <SocialIcon icon={<FaFacebook size={18} />} href="#" />
              <SocialIcon icon={<FaInstagram size={18} />} href="#" />
              <SocialIcon icon={<FaTwitter size={18} />} href="#" />
              <SocialIcon icon={<FaYoutube size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gold"></span>
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-gold transition text-sm flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4 relative inline-block">
              Categories
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gold"></span>
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link to={cat.path} className="text-gray-400 hover:text-gold transition text-sm flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gold transition-all"></span>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gold"></span>
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaMapMarkerAlt size={16} className="text-gold" />
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaPhone size={16} className="text-gold" />
                <span>+255 712 345 678</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaEnvelope size={16} className="text-gold" />
                <span>info@universaldressmaking.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FaClock size={16} className="text-gold" />
                <span>Mon - Sat: 9AM - 6PM</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Subscribe to our newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l-lg text-gray-800 outline-none focus:ring-1 focus:ring-gold text-sm"
                />
                <button className="bg-gold text-primary px-4 rounded-r-lg hover:bg-gold/90 transition">
                  <FaPaperPlane size={18} />
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">Get 10% off on your first order!</p>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-t border-gray-800 mb-6">
          <FeatureItem icon={<FaTruck size={20} />} text="Free Shipping" subtext="On orders over 100k" />
          <FeatureItem icon={<FaShieldAlt size={20} />} text="Secure Payment" subtext="100% safe checkout" />
          <FeatureItem icon={<FaSyncAlt size={20} />} text="Easy Returns" subtext="30 days return policy" />
          <FeatureItem icon={<FaCreditCard size={20} />} text="Flexible Payment" subtext="M-Pesa, Card, Cash" />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Universal Dressmaking Shop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <FaCcVisa size={30} className="text-gray-400 opacity-50 hover:opacity-100 transition" />
            <FaCcMastercard size={30} className="text-gray-400 opacity-50 hover:opacity-100 transition" />
            <SiMastercard size={30} className="text-gray-400 opacity-50 hover:opacity-100 transition" />
            <FaPaypal size={30} className="text-gray-400 opacity-50 hover:opacity-100 transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Social Icon Component
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href}
    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-gold hover:text-primary transition-all duration-300 hover:scale-110"
  >
    {icon}
  </a>
);

// Feature Item Component
const FeatureItem = ({ icon, text, subtext }) => (
  <div className="flex items-center gap-3">
    <div className="text-gold">{icon}</div>
    <div>
      <p className="text-white text-sm font-semibold">{text}</p>
      <p className="text-gray-500 text-xs">{subtext}</p>
    </div>
  </div>
);

export default Footer;