const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

// Import routes
const authRoutes = require("./routes/authRoutes");

dotenv.config();
const app = express();
app.use(express.json());

// Mount routes
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");

    // ===== Seed default admin here =====
    try {
      const existingAdmin = await Admin.findOne({ username: "admin" });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const defaultAdmin = new Admin({ username: "admin", password: hashedPassword });
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