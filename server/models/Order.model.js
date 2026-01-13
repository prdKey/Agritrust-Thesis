import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    productId: {
      type: DataTypes.INTEGER,  // ✅ Must be INTEGER to FK to products.id
      allowNull: false
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    unit: {
      type: DataTypes.ENUM("KG", "SACK", "BOX", "PIECE"),
      defaultValue: "KG"
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    imageCID: {
      type: DataTypes.STRING,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM("None", "Paid", "Shipped", "Completed", "Disputed", "Refunded"),
      defaultValue: "None"
    },
  },
  {
    tableName: "orders",
    timestamps: true
  }
);

export default Order;
