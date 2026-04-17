import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await authService.getAdminProfile();
      if (response.success) {
        setAdmin(response.admin);
      } else {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    
    setUpdating(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await authService.changeAdminPassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-gold text-4xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin" className="text-gray-600 hover:text-gold transition flex items-center gap-2 mb-4">
          <FaArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
        <p className="text-gray-500">Manage your account settings</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
              <FaUser className="text-gold text-3xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{admin?.username}</h2>
              <p className="text-gray-500">Administrator</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 py-3 border-b">
              <FaUser className="text-gold" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium">{admin?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 border-b">
              <FaEnvelope className="text-gold" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{admin?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3">
              <FaLock className="text-gold" />
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="font-medium">••••••••</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="btn-outline w-full mt-6"
          >
            Change Password
          </button>
        </div>

        {/* Change Password Form */}
        {showPasswordForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {updating ? <FaSpinner className="animate-spin" /> : <FaSave size={16} />}
                  {updating ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;