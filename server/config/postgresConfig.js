const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance for PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || "bus_booking_daily",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
