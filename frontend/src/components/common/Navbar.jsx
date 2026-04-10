import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaShoppingBag, FaBars, FaTimes, FaUser, FaSignOutAlt, 
  FaSearch, FaHeart, FaCalendarAlt, FaStar, FaChevronDown,
  FaUserCircle, FaUserPlus, FaSignInAlt
} from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Women', path: '/shop?category=women' },
    { name: 'Men', path: '/shop?category=men' },
    { name: 'Kids', path: '/shop?category=kids' },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-primary/95 backdrop-blur-md shadow-2xl py-2' : 'bg-primary py-4'
      }`}>
        <div className="container-custom">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <FaShoppingBag className="text-gold text-2xl group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-2 w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-white">
                  Universal
                </span>
                <span className="font-display font-bold text-xl text-gold ml-1">
                  Dressmaking
                </span>
                <p className="text-[10px] text-gray-400 tracking-wider">AFRICAN FASHION HOUSE</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-gray-300 hover:text-gold transition font-medium relative group ${
                    location.pathname === link.path ? 'text-gold' : ''
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}
              
              {token && (
                <>
                  <Link to="/bookings" className="text-gray-300 hover:text-gold transition flex items-center gap-1">
                    <FaCalendarAlt size={16} /> Bookings
                  </Link>
                  <Link to="/reviews" className="text-gray-300 hover:text-gold transition flex items-center gap-1">
                    <FaStar size={16} /> Reviews
                  </Link>
                </>
              )}
            </div>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-5">
              <button 
                onClick={() => setSearchOpen(true)}
                className="text-gray-300 hover:text-gold transition p-2"
              >
                <FaSearch size={20} />
              </button>
              
              <Link to="/wishlist" className="text-gray-300 hover:text-gold transition relative">
                <FaHeart size={20} />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-secondary rounded-full text-white text-[10px] flex items-center justify-center">0</span>
              </Link>

              {token ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-gold transition">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <FaUser size={16} className="text-gold" />
                    </div>
                    <span className="text-sm">{user.name?.split(' ')[0] || 'User'}</span>
                    <FaChevronDown size={14} />
                  </button>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <FaUserCircle size={16} /> My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <FaShoppingBag size={16} /> My Orders
                    </Link>
                    <Link to="/bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <FaCalendarAlt size={16} /> My Bookings
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center gap-2">
                      <FaSignOutAlt size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-gray-300 hover:text-gold transition flex items-center gap-1">
                    <FaSignInAlt size={14} /> Sign In
                  </Link>
                  <Link to="/register" className="bg-gold text-primary px-5 py-2 rounded-full font-semibold hover:bg-gold/90 transition transform hover:scale-105 flex items-center gap-1">
                    <FaUserPlus size={14} /> Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed inset-x-0 top-[73px] bg-primary/95 backdrop-blur-md border-t border-gray-800 transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="container-custom py-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gold transition py-2 text-lg"
                >
                  {link.name}
                </Link>
              ))}
              {token && (
                <>
                  <Link to="/bookings" onClick={() => setIsOpen(false)} className="text-white hover:text-gold transition py-2 flex items-center gap-2">
                    <FaCalendarAlt size={18} /> My Bookings
                  </Link>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="text-white hover:text-gold transition py-2 flex items-center gap-2">
                    <FaUserCircle size={18} /> My Profile
                  </Link>
                  <Link to="/orders" onClick={() => setIsOpen(false)} className="text-white hover:text-gold transition py-2 flex items-center gap-2">
                    <FaShoppingBag size={18} /> My Orders
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-gray-800">
                {token ? (
                  <button onClick={handleLogout} className="btn-outline w-full flex items-center justify-center gap-2">
                    <FaSignOutAlt size={16} /> Logout
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <Link to="/login" className="btn-outline flex-1 text-center flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                      <FaSignInAlt size={14} /> Sign In
                    </Link>
                    <Link to="/register" className="btn-gold flex-1 text-center flex items-center justify-center gap-2" onClick={() => setIsOpen(false)}>
                      <FaUserPlus size={14} /> Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center animate-fadeInUp">
          <div className="w-full max-w-2xl mx-4">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSearchOpen(false)} className="text-white hover:text-gold transition">
                <FaTimes size={32} />
              </button>
            </div>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for clothes, styles, fabrics..."
                  className="w-full px-6 py-4 text-lg rounded-full bg-white text-primary outline-none focus:ring-2 focus:ring-gold"
                  autoFocus
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-gold text-primary p-2 rounded-full hover:bg-gold/90 transition">
                  <FaSearch size={24} />
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {['Kitenge', 'Ankara', 'Modern Dresses', 'African Prints', 'Wedding Gowns'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      handleSearch(new Event('submit'));
                    }}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 hover:bg-gold hover:text-primary transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-[73px]"></div>
    </>
  );
};

export default Navbar;