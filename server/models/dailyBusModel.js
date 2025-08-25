const { DataTypes } = require('sequelize');
const sequelize = require('../config/postgresConfig');

const DailyBus = sequelize.define('DailyBus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Route Information
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  
  busNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  
  from: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  to: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    }
  },
  
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // Default Schedule
  defaultDeparture: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Default departure time (HH:MM:SS format)'
  },
  
  defaultArrival: {
    type: DataTypes.TIME,
    allowNull: false,
    comment: 'Default arrival time (HH:MM:SS format)'
  },
  
  // Active Days (JSON array of day numbers: 0=Sunday, 1=Monday, ..., 6=Saturday)
  activeDays: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [1, 2, 3, 4, 5, 6], // Monday to Saturday by default
    validate: {
      isValidDays(value) {
        if (!Array.isArray(value)) {
          throw new Error('Active days must be an array');
        }
        if (value.length === 0) {
          throw new Error('At least one active day must be selected');
        }
        const validDays = [0, 1, 2, 3, 4, 5, 6];
        for (let day of value) {
          if (!validDays.includes(day)) {
            throw new Error('Invalid day number. Use 0-6 (0=Sunday, 6=Saturday)');
          }
        }
      }
    }
  },
  
  // Schedule Variations (JSON object for day-specific times)
  // Format: { "0": { "departure": "10:00:00", "arrival": "14:00:00" } } for Sunday
  scheduleVariations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Day-specific schedule overrides. Key: day number (0-6), Value: {departure, arrival}'
  },
  
  // Status Management
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
    allowNull: false
  },
  
  // Additional Information
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Effective Date Range
  effectiveFrom: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date from which this schedule becomes effective'
  },
  
  effectiveTo: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date until which this schedule is effective'
  }
}, {
  tableName: 'daily_buses',
  timestamps: true, // Adds createdAt and updatedAt
  indexes: [
    {
      fields: ['busNumber']
    },
    {
      fields: ['from', 'to']
    },
    {
      fields: ['status']
    }
  ]
});

// Instance methods
DailyBus.prototype.getScheduleForDay = function(dayNumber) {
  // Check if day is active
  if (!this.activeDays.includes(dayNumber)) {
    return null;
  }
  
  // Check for day-specific variations
  if (this.scheduleVariations && this.scheduleVariations[dayNumber]) {
    return {
      departure: this.scheduleVariations[dayNumber].departure,
      arrival: this.scheduleVariations[dayNumber].arrival
    };
  }
  
  // Return default schedule
  return {
    departure: this.defaultDeparture,
    arrival: this.defaultArrival
  };
};

DailyBus.prototype.isActiveOnDay = function(dayNumber) {
  return this.activeDays.includes(dayNumber);
};

module.exports = DailyBus;
