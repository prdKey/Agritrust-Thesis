import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    origin: {
      type: DataTypes.STRING,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },

    unit: {
      type: DataTypes.ENUM("KG", "SACK", "BOX", "PIECE"),
      defaultValue: "KG"
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    ipfsHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    blockchainHash: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("AVAILABLE", "OUT_OF_STOCK"),
      defaultValue: "AVAILABLE"
    },

    userId: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    tableName: "products",
    timestamps: true
  }
);

export default Product;
