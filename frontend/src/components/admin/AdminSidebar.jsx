import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBoxes, 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaStar, 
  FaUser,
  FaUsers,
  FaSignOutAlt,
  FaPlus,
  FaChartLine
} from 'react-icons/fa';

const AdminSidebar = ({ onNavigate }) => {
  const location = useLocation();

  const menuItems = [
    { 
      title: 'DASHBOARD', 
      items: [
        { name: 'Overview', path: '/admin', icon: <FaTachometerAlt size={18} /> },
        { name: 'Statistics', path: '/admin/statistics', icon: <FaChartLine size={18} /> }
      ]
    },

    // Add to menuItems array under DASHBOARD or as new section
{ 
  title: 'USERS', 
  items: [
    { name: 'All Users', path: '/admin/users', icon: <FaUsers size={18} /> }
  ]
},
    { 
      title: 'PRODUCTS', 
      items: [
        { name: 'All Products', path: '/admin/products', icon: <FaBoxes size={18} /> },
        { name: 'Add Product', path: '/admin/products/add', icon: <FaPlus size={18} /> }
      ]
    },
    { 
      title: 'ORDERS', 
      items: [
        { name: 'All Orders', path: '/admin/orders', icon: <FaShoppingBag size={18} /> }
      ]
    },
    { 
      title: 'BOOKINGS', 
      items: [
        { name: 'All Bookings', path: '/admin/bookings', icon: <FaCalendarAlt size={18} /> }
      ]
    },
    { 
      title: 'REVIEWS', 
      items: [
        { name: 'All Reviews', path: '/admin/reviews', icon: <FaStar size={18} /> }
      ]
    },
    { 
      title: 'PROFILE', 
      items: [
        { name: 'Admin Profile', path: '/admin/profile', icon: <FaUser size={18} /> }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    // ✅ Sidebar with scroll but NO visible overflow scrollbar line
    <div className="w-64 bg-primary text-white h-full flex flex-col">
      {/* Logo - Fixed at top */}
      <div className="p-6 border-b border-white/20 flex-shrink-0">
        <h1 className="text-xl font-bold">
          Universal<span className="text-gold">Dressmaking</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      {/* Scrollable Navigation - Custom scrollbar (hidden by default, appears on hover) */}
      <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {section.title}
            </h3>
            {section.items.map((item, itemIdx) => (
              <Link
                key={itemIdx}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-gold text-primary border-l-4 border-gold'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout Button - Fixed at bottom */}
      <div className="p-4 border-t border-white/20 flex-shrink-0">
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-2 py-2 text-gray-300 hover:text-red-400 transition w-full"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;