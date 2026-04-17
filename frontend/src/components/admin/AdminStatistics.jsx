import { useState, useEffect } from 'react';
import { FaSpinner, FaChartLine, FaShoppingBag, FaCalendarAlt, FaBoxes, FaStar } from 'react-icons/fa';
import orderService from '../../services/orderService';
import bookingService from '../../services/bookingService';
import clothService from '../../services/clothService';

const AdminStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: { total: 0, pending: 0, completed: 0, revenue: 0 },
    bookings: { total: 0, pending: 0, confirmed: 0, inProgress: 0, completed: 0, cancelled: 0 },
    products: { total: 0, lowStock: 0, outOfStock: 0 },
    reviews: { total: 0, averageRating: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Fetch order stats
      const orderStats = await orderService.getOrderStats();
      const allOrders = await orderService.getAllOrders();
      const pendingOrders = await orderService.getAllOrders({ status: 'pending' });
      const completedOrders = await orderService.getAllOrders({ status: 'completed' });
      
      // Fetch booking stats
      const bookingStats = await bookingService.getBookingStats();
      
      // Fetch product stats
      const allProducts = await clothService.getAllClothes();
      const lowStock = await clothService.getLowStockAlerts(10);
      const outOfStock = await clothService.getOutOfStockClothes();
      
      setStats({
        orders: {
          total: orderStats?.totalOrders || 0,
          pending: pendingOrders?.length || 0,
          completed: completedOrders?.length || 0,
          revenue: orderStats?.totalRevenue || 0,
        },
        bookings: {
          total: bookingStats?.totalBookings || 0,
          pending: bookingStats?.pendingBookings || 0,
          confirmed: bookingStats?.confirmedBookings || 0,
          inProgress: bookingStats?.inProgressBookings || 0,
          completed: bookingStats?.completedBookings || 0,
          cancelled: bookingStats?.cancelledBookings || 0,
        },
        products: {
          total: allProducts?.length || 0,
          lowStock: lowStock?.length || 0,
          outOfStock: outOfStock?.length || 0,
        },
        reviews: {
          total: 0,
          averageRating: 0,
        },
      });
      
      // Combine recent activity
      const recentOrders = (allOrders || []).slice(0, 5).map(o => ({
        type: 'order',
        id: o._id,
        status: o.status,
        amount: o.totalPrice,
        date: o.createdAt,
        customer: o.user?.name,
      }));
      
      setRecentActivity(recentOrders);
      
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-gray-800">Statistics & Reports</h1>
        <p className="text-gray-500">Overview of your store performance</p>
      </div>

      {/* Revenue Summary */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-sm p-6 mb-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
        <p className="text-4xl font-bold">{stats.orders.revenue.toLocaleString()} RWF</p>
        <p className="text-white/80 text-sm mt-2">From {stats.orders.completed} completed orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <FaShoppingBag className="text-gold text-2xl" />
            <span className="text-xs text-gray-400">Orders</span>
          </div>
          <p className="text-2xl font-bold">{stats.orders.total}</p>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-yellow-600">Pending: {stats.orders.pending}</span>
            <span className="text-green-600">Completed: {stats.orders.completed}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <FaCalendarAlt className="text-gold text-2xl" />
            <span className="text-xs text-gray-400">Bookings</span>
          </div>
          <p className="text-2xl font-bold">{stats.bookings.total}</p>
          <div className="flex flex-wrap gap-2 text-xs mt-2">
            <span className="text-yellow-600">Pending: {stats.bookings.pending}</span>
            <span className="text-blue-600">In Progress: {stats.bookings.inProgress}</span>
            <span className="text-green-600">Completed: {stats.bookings.completed}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <FaBoxes className="text-gold text-2xl" />
            <span className="text-xs text-gray-400">Products</span>
          </div>
          <p className="text-2xl font-bold">{stats.products.total}</p>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-orange-600">Low Stock: {stats.products.lowStock}</span>
            <span className="text-red-600">Out of Stock: {stats.products.outOfStock}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <FaChartLine className="text-gold text-2xl" />
            <span className="text-xs text-gray-400">Completion Rate</span>
          </div>
          <p className="text-2xl font-bold">
            {stats.orders.total > 0 
              ? Math.round((stats.orders.completed / stats.orders.total) * 100) 
              : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-2">Order completion rate</p>
        </div>
      </div>

      {/* Booking Status Distribution */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Booking Status Distribution</h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Pending</span>
              <span>{stats.bookings.pending}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 rounded-full h-2" 
                style={{ width: `${stats.bookings.total > 0 ? (stats.bookings.pending / stats.bookings.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Confirmed</span>
              <span>{stats.bookings.confirmed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 rounded-full h-2" 
                style={{ width: `${stats.bookings.total > 0 ? (stats.bookings.confirmed / stats.bookings.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>In Progress</span>
              <span>{stats.bookings.inProgress}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 rounded-full h-2" 
                style={{ width: `${stats.bookings.total > 0 ? (stats.bookings.inProgress / stats.bookings.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Completed</span>
              <span>{stats.bookings.completed}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 rounded-full h-2" 
                style={{ width: `${stats.bookings.total > 0 ? (stats.bookings.completed / stats.bookings.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">
                    {activity.type === 'order' ? '📦 New Order' : '📅 New Booking'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {activity.customer || 'Customer'} • {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  {activity.amount && (
                    <p className="font-semibold text-gold">{activity.amount.toLocaleString()} RWF</p>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatistics;