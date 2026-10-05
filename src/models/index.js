const { sequelize } = require("../config/database");
const Product = require("./Product");
const Order = require("./Order");

// Model associations can be placed here as needed

module.exports = {
  sequelize,
  Product,
  Order,
};
