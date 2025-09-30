const sequelize = require("./postgresConfig");

// Import models to ensure they are registered with Sequelize
const DailyBus = require("../models/dailyBusModel");
const Festival = require("../models/festivalModel");
const Event = require("../models/eventModel");

// Set up Festival-Event relationship
Festival.hasMany(Event, {
  foreignKey: "ID_Festivalit",
  as: "events",
  onDelete: "CASCADE",
});
Event.belongsTo(Festival, {
  foreignKey: "ID_Festivalit",
  as: "festival",
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
  models: {
    DailyBus,
    Festival,
    Event,
  },
};
