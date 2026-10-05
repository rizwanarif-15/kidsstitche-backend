const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "[WARNING] DATABASE_URL is not set in .env! Please set your Neon PostgreSQL connection string."
  );
}

// Configure Sequelize for Neon (PostgreSQL with SSL)
const sequelize = new Sequelize(databaseUrl || "postgres://localhost:5432/neondb", {
  dialect: "postgres",
  protocol: "postgres",
  logging: process.env.NODE_ENV === "development" ? (msg) => console.log(`[SQL] ${msg}`) : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Neon serverless pooler
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(" [Neon DB] Connected successfully to Neon PostgreSQL database.");
  } catch (error) {
    console.error(" [Neon DB Error] Could not connect to database:", error.message);
    console.info("💡 Tip: Verify your DATABASE_URL in the .env file with your Neon connection string.");
  }
};

module.exports = {
  sequelize,
  testConnection,
};
