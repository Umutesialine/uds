import { useState, useEffect } from 'react';
import { 
  FaBoxes, 
  FaShoppingBag, 
  FaCalendarAlt, 
  FaStar,
  FaExclamationTriangle,
  FaSpinner,
  FaSyncAlt
} from 'react-icons/fa';
import StatCard from '../../components/admin/StatCard';
import StatusBadge from '../../components/admin/StatusBadge';
import orderService from '../../services/orderService';
import bookingService from '../../services/bookingService';
import clothService from '../../services/clothService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalBookings: 0,
    pendingBookings: 0,
    inProgressBookings: 0,
    completedBookings: 0,
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    todaysBookings: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [todaysBookingsList, setTodaysBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch order stats
      const orderStats = await orderService.getOrderStats();
      const allOrders = await orderService.getAllOrders();
      const pendingOrdersData = await orderService.getAllOrders({ status: 'pending' });
      const completedOrdersData = await orderService.getAllOrders({ status: 'completed' });
      
      // Fetch booking stats
      const bookingStats = await bookingService.getBookingStats();
      const todaysBookingsData = await bookingService.getTodaysBookings();
      
      // Fetch product stats
      const allProducts = await clothService.getAllClothes();
      const lowStock = await clothService.getLowStockAlerts(10);
      const outOfStock = await clothService.getOutOfStockClothes();
      
      console.log('Today\'s Bookings:', todaysBookingsData);
      console.log('Low Stock Products:', lowStock);
      
      setStats({
        totalOrders: orderStats?.totalOrders || 0,
        totalRevenue: orderStats?.totalRevenue || 0,
        pendingOrders: pendingOrdersData?.length || 0,
        completedOrders: completedOrdersData?.length || 0,
        totalBookings: bookingStats?.totalBookings || 0,
        pendingBookings: bookingStats?.pendingBookings || 0,
        inProgressBookings: bookingStats?.inProgressBookings || 0,
        completedBookings: bookingStats?.completedBookings || 0,
        totalProducts: allProducts?.length || 0,
        lowStockCount: lowStock?.length || 0,
        outOfStockCount: outOfStock?.length || 0,
        todaysBookings: bookingStats?.todaysBookings || 0,
      });
      
      setRecentOrders(allOrders?.slice(0, 5) || []);
      setLowStockProducts(lowStock || []);
      setTodaysBookingsList(todaysBookingsData?.bookings || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome to your admin dashboard</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-primary rounded-lg hover:bg-gold/90 transition"
        >
          <FaSyncAlt className={refreshing ? 'animate-spin' : ''} size={14} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`${stats.totalRevenue.toLocaleString()} RWF`} 
          icon={<FaShoppingBag size={24} />} 
          color="green"
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={<FaShoppingBag size={24} />} 
          color="blue"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats.totalBookings} 
          icon={<FaCalendarAlt size={24} />} 
          color="purple"
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<FaBoxes size={24} />} 
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Order #{order._id?.slice(-6)}</p>
                    <p className="text-xs text-gray-500">{order.totalPrice?.toLocaleString()} RWF</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Today's Bookings</h2>
          {todaysBookingsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings for today</p>
              <p className="text-xs text-gray-400 mt-2">Bookings with preferred date = today will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysBookingsList.map((booking) => (
                <div key={booking._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{booking.cloth?.name || 'Custom Design'}</p>
                    <p className="text-xs text-gray-500">{booking.user?.name}</p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Low Stock Alerts</h2>
            {stats.lowStockCount > 0 && (
              <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                {stats.lowStockCount} items
              </span>
            )}
          </div>
          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">All products have good stock levels</p>
              <p className="text-xs text-gray-400 mt-2">Products with stock {'<='} 10 will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock} units</p>
                  </div>
                  <StatusBadge status="low-stock" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-sm p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/admin/products/add'}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition"
            >
              <FaBoxes className="mx-auto mb-2" size={24} />
              <span className="text-sm">Add Product</span>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/orders'}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition"
            >
              <FaShoppingBag className="mx-auto mb-2" size={24} />
              <span className="text-sm">View Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;