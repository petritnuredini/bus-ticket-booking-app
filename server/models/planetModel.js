const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgresConfig');

const Planet = sequelize.define('Planet', {
  PlanetId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'PlanetId' // Ensure column name matches exam requirements
  },
  
  Name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    },
    field: 'Name'
  },
  
  Type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    },
    field: 'Type'
  },
  
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'IsDeleted'
  }
}, {
  tableName: 'planets',
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      fields: ['Name']
    },
    {
      fields: ['Type']
    },
    {
      fields: ['IsDeleted']
    }
  ]
});

// Instance methods
Planet.prototype.softDelete = function() {
  this.IsDeleted = true;
  return this.save();
};

Planet.prototype.restore = function() {
  this.IsDeleted = false;
  return this.save();
};

// Class methods
Planet.findActive = function(options = {}) {
  return this.findAll({
    ...options,
    where: {
      ...options.where,
      IsDeleted: false
    }
  });
};

Planet.findByName = function(name, includeDeleted = false) {
  const whereClause = { Name: name };
  if (!includeDeleted) {
    whereClause.IsDeleted = false;
  }
  
  return this.findOne({
    where: whereClause
  });
};

module.exports = Planet;
