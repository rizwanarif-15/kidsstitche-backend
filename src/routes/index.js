const express = require("express");
const router = express.Router();

const productRoutes = require("./productRoutes");
const orderRoutes = require("./orderRoutes");
const dashboardRoutes = require("./dashboardRoutes");

router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Kidstiches E-Commerce API",
    database: "Neon PostgreSQL",
  });
});

router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
