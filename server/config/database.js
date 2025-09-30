const sequelize = require("./postgresConfig");

// Import models to ensure they are registered with Sequelize
const DailyBus = require("../models/dailyBusModel");
const Group = require("../models/groupModel");
const Member = require("../models/memberModel");

// Set up model associations
const models = { DailyBus, Group, Member };

// Initialize associations if they exist
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Test PostgreSQL connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to PostgreSQL database:", error);
  }
};

// Initialize database (create tables if they don't exist)
const initializeDatabase = async () => {
  try {
    // This will create all tables defined in models
    await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
    console.log("PostgreSQL Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing PostgreSQL database:", error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase,
  models,
};
