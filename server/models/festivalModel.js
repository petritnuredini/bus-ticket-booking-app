const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgresConfig");

const Festival = sequelize.define(
  "Festival",
  {
    FestivalID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EmriFestivalit: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    LlojiiFestivalit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IsDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "Festivals",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  }
);

module.exports = Festival;

