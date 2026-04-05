const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

// Import routes
const authRoutes = require("./routes/authRoutes");
const clothesRoutes = require("./routes/clothRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

dotenv.config();
const app = express();
app.use(express.json());

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

    // ===== Seed default admin here =====
    try {
      const existingAdmin = await Admin.findOne({ username: "admin" });
      if (!existingAdmin) {
        const defaultAdmin = new Admin({
  username: "admin",
  password: "admin123" // plain password
});               
        await defaultAdmin.save();
        console.log("✅ Default admin created: username=admin, password=admin123");
      }
    } catch (err) {
      console.error("Error creating default admin:", err.message);
    }
  })
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));