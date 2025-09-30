const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgresConfig");

const Event = sequelize.define(
  "Event",
  {
    EventID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_Festivalit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Festivals",
        key: "FestivalID",
      },
      onDelete: "CASCADE",
    },
    EmriEventit: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    DataEventit: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "Events",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  }
);

module.exports = Event;

