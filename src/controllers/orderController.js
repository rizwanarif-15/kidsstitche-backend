const { Order } = require("../models");

// @desc    Create new order (from checkout page)
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      apartment,
      city,
      postalCode,
      items,
      subtotal,
      shippingFee = 0,
      total,
      notes,
    } = req.body;

    if (!lastName || !email || !phone || !address || !city) {
      return res.status(400).json({
        success: false,
        message: "Missing required customer shipping fields",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const customerName = firstName ? `${firstName.trim()} ${lastName.trim()}` : lastName.trim();

    // Generate unique order number (e.g., KS-10492)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `KS-${Date.now().toString().slice(-4)}${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      customerName,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      apartment: apartment ? apartment.trim() : null,
      city: city.trim(),
      postalCode: postalCode ? postalCode.trim() : null,
      items,
      subtotal: parseFloat(subtotal) || 0,
      shippingFee: parseFloat(shippingFee) || 0,
      total: parseFloat(total) || 0,
      status: "pending",
      paymentMethod: "Cash on Delivery (COD)",
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (for admin dashboard)
// @route   GET /api/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const where = {};

    if (status && status !== "all") {
      where.status = status;
    }

    const parsedLimit = Math.max(1, parseInt(limit, 10));
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parsedLimit;

    const { count, rows } = await Order.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parsedLimit,
      offset,
    });

    res.json({
      success: true,
      total: count,
      page: parseInt(page, 10),
      totalPages: Math.ceil(count / parsedLimit),
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with id "${id}" not found`,
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with id "${id}" not found`,
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
