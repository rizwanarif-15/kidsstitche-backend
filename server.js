const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { sequelize, testConnection } = require("./src/config/database");
const apiRoutes = require("./src/routes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:4173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching frontend origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev/testing
    },
    credentials: true,
  })
);

// Body parsers - generous limits for base64 image uploads from admin panel
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Request logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Root welcome route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Kidstiches E-Commerce API (Neon PostgreSQL + Sequelize)",
    documentation: "/api/health",
    endpoints: {
      products: "/api/products",
      orders: "/api/orders",
      dashboard: "/api/dashboard/stats",
    },
  });
});

// API Routes
app.use("/api", apiRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server and Sync Neon Database
const startServer = async () => {
  try {
    console.log("--------------------------------------------------");
    console.log("🚀 Starting Kidstiches Backend (MVC Architecture)...");
    console.log("--------------------------------------------------");

    // Test Neon DB connection
    await testConnection();

    // Sync database models with Neon PostgreSQL
    // (alter: true automatically creates/updates tables without dropping data)
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
      console.log("🔄 Synchronizing database tables with Neon...");
      await sequelize.sync({ alter: true });
      console.log("✅ All Sequelize models synchronized with Neon PostgreSQL.");
    } else {
      console.log("⚠️ Running in offline/local mode. To connect Neon, set DATABASE_URL in .env");
    }

    app.listen(PORT, () => {
      console.log(`🌐 Server is running on: http://localhost:${PORT}`);
      console.log(`📦 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
      console.log("--------------------------------------------------");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();

module.exports = app;
