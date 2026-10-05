# 🚀 Kidstiches E-Commerce Backend (MVC + Sequelize ORM + Neon PostgreSQL)

A complete, production-ready REST API built with **Node.js, Express, Sequelize ORM, and Neon PostgreSQL**.

---

## 📁 MVC Project Architecture

```
backend/
├── package.json              # Project dependencies and npm scripts
├── .env.example              # Environment variables template
├── .env                      # Local environment configuration
├── server.js                 # Express server entry point & Neon DB sync
├── src/
│   ├── config/
│   │   └── database.js       # Sequelize configuration with Neon SSL enabled
│   ├── models/
│   │   ├── index.js          # Model exports & database setup
│   │   ├── Product.js        # Product schema (slug, price, images, categories)
│   │   └── Order.js          # Customer orders (shipping info, items, totals, COD)
│   ├── controllers/
│   │   ├── productController.js  # CRUD logic for products
│   │   ├── orderController.js    # Logic for customer orders
│   │   └── dashboardController.js# Summary statistics for admin
│   ├── routes/
│   │   ├── index.js          # API router entry (/api)
│   │   ├── productRoutes.js  # /api/products
│   │   ├── orderRoutes.js    # /api/orders
│   │   └── dashboardRoutes.js# /api/dashboard
│   ├── middlewares/
│   │   └── errorHandler.js   # Centralized error handling
│   └── seeders/
│       └── seed.js           # Populates initial demo products in Neon DB
└── README.md
```

---

## ⚡ Step-by-Step Setup Guide

### Step 1: Install Dependencies
Open a terminal inside the `backend` folder and run:
```bash
npm install
```

---

### Step 2: Connect your Neon Database
1. Go to [https://console.neon.tech](https://console.neon.tech) and create or open your project.
2. On your Neon dashboard, copy the **Connection string** (looks like):
   ```text
   postgresql://neondb_owner:npg_xxxx@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Open the `.env` file in this `backend` folder and paste your connection string:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://your_user:your_password@your_host/neondb?sslmode=require
   ```

---

### Step 3: Seed Demo Products (Optional but Recommended)
Run the seeder script to populate initial sample products into your Neon database:
```bash
npm run seed
```

---

### Step 4: Start the Backend Server
To run in development mode with auto-reload:
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```

The server will start on: **`http://localhost:5000`**

---

## 🔌 API Endpoints Reference

### 🛍️ Products (`/api/products`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products (supports `?category=`, `?q=`, `?sort=`) |
| `GET` | `/api/products/slug/:slug` | Get single product by URL slug |
| `GET` | `/api/products/:id` | Get single product by UUID |
| `POST` | `/api/products` | Add new product (from Admin Panel) |
| `PUT` | `/api/products/:id` | Update product details or stock |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/products/categories` | Get list of distinct product categories |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Create customer order (from Checkout page) |
| `GET` | `/api/orders` | List all orders (for Admin Dashboard) |
| `GET` | `/api/orders/:id` | Get single order details |
| `PATCH` | `/api/orders/:id/status` | Update order status (`pending`, `shipped`, `delivered`, etc.) |

### 📊 Admin Dashboard (`/api/dashboard`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Total products, total revenue, pending orders, recent orders |

---

## 📱 Connecting Frontend (`Kidstiches`) to this Backend

Instead of using `localStorage`, your frontend can simply fetch data from this backend API:

```javascript
// Example: Fetch products from backend
const response = await fetch("http://localhost:5000/api/products");
const data = await response.json();
console.log(data.data); // Array of products from Neon PostgreSQL!
```

Jab aapka backend chalega, to chahe aap **laptop** se product add karein ya **mobile** se, data direct **Neon Database** me save hoga aur har device par real-time show hoga!
