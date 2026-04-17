import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Bookings from './pages/Bookings';
import BookingForm from './pages/BookingForm';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Reviews from './pages/Reviews';
import AddReview from './pages/AddReview';
import ChangePassword from './pages/ChangePassword';

import AdminUsers from './components/admin/AdminUsers';

// Admin Pages
import AdminDashboard from './components/admin/AdminDashboard';

// Add these imports
import AdminProducts from './components/admin/AdminProducts';
import AddProduct from './components/admin/AddProduct';

// Add these imports
import EditProduct from './components/admin/EditProduct';
import AdminOrders from './components/admin/AdminOrders';

// Add imports
import AdminBookings from './components/admin/AdminBookings';
import AdminReviews from './components/admin/AdminReviews';

// Add imports
import AdminProfile from './components/admin/AdminProfile';
import AdminStatistics from './components/admin/AdminStatistics';

import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
             // Inside AdminLayout routes, add:
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />

            <Route path="bookings" element={<AdminBookings />} />
            <Route path="reviews" element={<AdminReviews />} />

            <Route path="profile" element={<AdminProfile />} />
            <Route path="statistics" element={<AdminStatistics />} />

            <Route path="users" element={<AdminUsers />} />

          </Route>

          {/* Public Routes with Navbar/Footer */}
          <Route path="/" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/shop" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Shop />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/product/:id" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProductDetail />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/login" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Login />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/register" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Register />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/about" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <About />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Contact />
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/profile" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><Profile /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/orders" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><Orders /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/bookings" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><Bookings /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/book-tailoring" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><BookingForm /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><Cart /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/wishlist" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><Wishlist /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/reviews" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><Reviews /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />
          <Route path="/add-review/:clothId" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <ProtectedRoute><AddReview /></ProtectedRoute>
              </main>
              <Footer />
              <WhatsAppButton />
            </>
          } />

          // Add these routes
<Route path="/cart" element={
  <ProtectedRoute>
    <Cart />
  </ProtectedRoute>
} />
<Route path="/checkout" element={
  <ProtectedRoute>
    <Checkout />
  </ProtectedRoute>
} />

          <Route path="/change-password" element={
  <ProtectedRoute>
    <ChangePassword />
  </ProtectedRoute>
} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;