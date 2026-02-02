const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgresConfig');

const Satellite = sequelize.define('Satellite', {
  SatelliteId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'SatelliteId' // Ensure column name matches exam requirements
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
  
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'IsDeleted'
  },
  
  PlanetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'planets',
      key: 'PlanetId'
    },
    field: 'PlanetId'
  }
}, {
  tableName: 'satellites',
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      fields: ['Name']
    },
    {
      fields: ['PlanetId']
    },
    {
      fields: ['IsDeleted']
    },
    {
      fields: ['PlanetId', 'IsDeleted'] // Composite index for efficient queries
    }
  ]
});

// Instance methods
Satellite.prototype.softDelete = function() {
  this.IsDeleted = true;
  return this.save();
};

Satellite.prototype.restore = function() {
  this.IsDeleted = false;
  return this.save();
};

// Class methods
Satellite.findActive = function(options = {}) {
  return this.findAll({
    ...options,
    where: {
      ...options.where,
      IsDeleted: false
    }
  });
};

Satellite.findByPlanet = function(planetId, includeDeleted = false) {
  const whereClause = { PlanetId: planetId };
  if (!includeDeleted) {
    whereClause.IsDeleted = false;
  }
  
  return this.findAll({
    where: whereClause
  });
};

Satellite.findByPlanetName = function(planetName, includeDeleted = false) {
  const Planet = require('./planetModel');
  
  return this.findAll({
    include: [{
      model: Planet,
      where: { Name: planetName },
      required: true
    }],
    where: includeDeleted ? {} : { IsDeleted: false }
  });
};

// Soft delete all satellites of a planet by planet name
Satellite.softDeleteByPlanetName = async function(planetName) {
  const Planet = require('./planetModel');
  
  // Find the planet first
  const planet = await Planet.findByName(planetName);
  if (!planet) {
    throw new Error(`Planet with name "${planetName}" not found`);
  }
  
  // Update all satellites of this planet
  return this.update(
    { IsDeleted: true },
    {
      where: {
        PlanetId: planet.PlanetId,
        IsDeleted: false
      }
    }
  );
};

module.exports = Satellite;
