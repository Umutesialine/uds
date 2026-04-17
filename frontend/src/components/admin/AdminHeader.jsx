import { useState, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const AdminHeader = ({ onMenuClick, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setAdmin(JSON.parse(user));
    }
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gold transition"
          >
            <FaBars size={22} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
            Welcome back, {admin?.username || 'Admin'}!
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative text-gray-500 hover:text-gold transition">
            <FaBell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 text-gray-700 hover:text-gold transition"
            >
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <FaUserCircle size={20} className="text-gold" />
              </div>
              <span className="hidden md:block text-sm font-medium">
                {admin?.username || 'Admin'}
              </span>
              <FaChevronDown size={12} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border">
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;