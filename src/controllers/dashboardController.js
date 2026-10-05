const { Product, Order } = require("../models");

// @desc    Get dashboard metrics & summary
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    // Calculate total revenue from non-cancelled orders
    const orders = await Order.findAll({
      attributes: ["total", "status"],
    });

    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

    const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

    // Recent 5 orders
    const recentOrders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrdersCount,
        recentOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
