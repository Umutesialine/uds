import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import authService from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Try admin login first
      let response = await authService.adminLogin(email, password);
      let isAdmin = false;
      
      // If admin login fails, try user login
      if (!response.success) {
        response = await authService.login(email, password);
        isAdmin = false;
      } else {
        isAdmin = true;
      }
      
      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user || response.admin));
        
        // ✅ IMPORTANT: Redirect based on role
        if (isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        // Reload to update navbar state
        window.location.reload();
      } else {
        setError(response.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-gold text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold transition"
                placeholder="Enter your email"
                required
                autoFocus
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold transition"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-lg"
          >
            {loading ? <FaSpinner className="animate-spin" size={20} /> : 'Sign In'}
            {!loading && <FaArrowRight size={18} />}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Secure login powered by Universal Dressmaking</p>
        </div>
      </div>
    </div>
  );
};

export default Login;