const { sequelize, Product } = require("../models");

const sampleProducts = [
  {
    title: "Embroidered Floral Lawn Frock",
    slug: "embroidered-floral-lawn-frock",
    category: "Girls",
    price: 2499,
    compareAt: 2999,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=800",
    ],
    badge: "Bestseller",
    description: "Premium breathable stitched cotton lawn frock with delicate hand embroidery, perfect for festive summer occasions.",
    stockQuantity: 45,
  },
  {
    title: "Classic White Cotton Kurta Pajama",
    slug: "classic-white-cotton-kurta-pajama",
    category: "Boys",
    price: 2199,
    compareAt: 2500,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=800",
    ],
    badge: "Eid Special",
    description: "Crisp, lightweight stitched white cotton kurta set with neat neckline detailing for young boys.",
    stockQuantity: 60,
  },
  {
    title: "Pastel Pink Ruffle Party Dress",
    slug: "pastel-pink-ruffle-party-dress",
    category: "Girls",
    price: 3199,
    compareAt: 3899,
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    ],
    badge: "New",
    description: "Charming pastel pink party wear stitched with delicate net frills and soft cotton inner lining.",
    stockQuantity: 30,
  },
  {
    title: "Casual Denim dungaree Set",
    slug: "casual-denim-dungaree-set",
    category: "Toddlers",
    price: 1899,
    compareAt: 2200,
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    images: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800",
    ],
    badge: "Trending",
    description: "Comfortable soft stretch denim dungaree paired with a striped cotton inner shirt.",
    stockQuantity: 50,
  },
];

async function seed() {
  try {
    console.log(" Connecting to database for seeding...");
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log(" Seeding initial products...");
    for (const item of sampleProducts) {
      await Product.findOrCreate({
        where: { slug: item.slug },
        defaults: item,
      });
    }

    console.log(" Seed completed successfully! Sample products are in your database.");
    process.exit(0);
  } catch (error) {
    console.error(" Seed failed:", error);
    process.exit(1);
  }
}

seed();
