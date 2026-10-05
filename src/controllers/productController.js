const { Op } = require("sequelize");
const { Product } = require("../models");

// Helper to create a URL-safe slug from title
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// @desc    Get all products with search, category filtering, and sorting
// @route   GET /api/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, q, sort, limit = 100, page = 1 } = req.query;
    const where = {};

    if (category && category.toLowerCase() !== "all") {
      where.category = { [Op.iLike]: `%${category}%` };
    }

    if (q && q.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q.trim()}%` } },
        { description: { [Op.iLike]: `%${q.trim()}%` } },
        { category: { [Op.iLike]: `%${q.trim()}%` } },
      ];
    }

    let order = [["createdAt", "DESC"]];
    if (sort === "price_asc") order = [["price", "ASC"]];
    if (sort === "price_desc") order = [["price", "DESC"]];
    if (sort === "title_asc") order = [["title", "ASC"]];

    const parsedLimit = Math.max(1, parseInt(limit, 10));
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parsedLimit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      order,
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

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ where: { slug } });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with slug "${slug}" not found`,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id "${id}" not found`,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const {
      title,
      category,
      price,
      compareAt,
      image,
      images,
      badge,
      description,
      stockQuantity,
      slug: customSlug,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title and price are required fields",
      });
    }

    // Determine unique slug
    let baseSlug = customSlug ? slugify(customSlug) : slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;

    while (await Product.findOne({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = await Product.create({
      title,
      slug: finalSlug,
      category: category || "All",
      price: parseFloat(price) || 0,
      compareAt: compareAt ? parseFloat(compareAt) : null,
      image: image || "",
      images: Array.isArray(images) ? images : [],
      badge: badge || null,
      description: description || "",
      stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity, 10) : 50,
      inStock: stockQuantity === undefined || parseInt(stockQuantity, 10) > 0,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id "${id}" not found`,
      });
    }

    const {
      title,
      category,
      price,
      compareAt,
      image,
      images,
      badge,
      description,
      stockQuantity,
      slug,
      inStock,
    } = req.body;

    // Check slug uniqueness if slug is updated
    if (slug && slug !== product.slug) {
      const existing = await Product.findOne({ where: { slug } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Slug "${slug}" is already taken`,
        });
      }
      product.slug = slugify(slug);
    }

    if (title !== undefined) product.title = title;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = parseFloat(price);
    if (compareAt !== undefined) product.compareAt = compareAt ? parseFloat(compareAt) : null;
    if (image !== undefined) product.image = image;
    if (images !== undefined) product.images = Array.isArray(images) ? images : [];
    if (badge !== undefined) product.badge = badge;
    if (description !== undefined) product.description = description;
    if (stockQuantity !== undefined) {
      product.stockQuantity = parseInt(stockQuantity, 10);
      product.inStock = product.stockQuantity > 0;
    }
    if (inStock !== undefined) product.inStock = Boolean(inStock);

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id "${id}" not found`,
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct categories
// @route   GET /api/products/categories
exports.getCategories = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      attributes: ["category"],
      group: ["category"],
    });

    const categories = ["All", ...products.map((p) => p.category).filter(Boolean)];
    const unique = Array.from(new Set(categories));

    res.json({
      success: true,
      data: unique,
    });
  } catch (error) {
    next(error);
  }
};
