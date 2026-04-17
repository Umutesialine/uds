import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  console.log('AdminRoute check:', { 
    hasToken: !!token, 
    userRole: user?.role,
    isAdmin: user?.role === 'admin'
  });

  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    console.log('Not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('Admin access granted');
  return children;
};

export default AdminRoute;