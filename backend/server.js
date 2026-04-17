const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // ✅ ADD THIS - for serving static files
const Admin = require("./models/Admin");

// Import routes
const authRoutes = require("./routes/authRoutes");
const clothesRoutes = require("./routes/clothRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());

// ✅ IMPORTANT: Serve static files from uploads folder
// This makes images accessible at http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    try {
      // Check if admin exists by email
      const existingAdmin = await Admin.findOne({ 
        email: "admin@universaldressmaking.com"
      });
      
      if (!existingAdmin) {
        const defaultAdmin = new Admin({
          username: "admin",
          email: "admin@universaldressmaking.com",
          password: "admin123"
        });
        
        await defaultAdmin.save();
        console.log("✅ Default admin created:");
        console.log("   📧 Email: admin@universaldressmaking.com");
        console.log("   🔑 Password: admin123");
      } else {
        console.log("ℹ️ Admin already exists:", existingAdmin.email);
      }
    } catch (err) {
      console.error("Error creating default admin:", err.message);
    }
  })
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));