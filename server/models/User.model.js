import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },

    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },

    walletAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    nonce: {                    // ✅ REQUIRED
      type: DataTypes.STRING,
      allowNull: false
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true
    },

    role: {
      type: DataTypes.ENUM("SELLER", "BUYER", "ADMIN", "LOGISTICS"),
      allowNull: false,
      defaultValue: "BUYER"
    },

    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    status: {
      type: DataTypes.ENUM("ACTIVE", "SUSPENDED"),
      defaultValue: "ACTIVE"
    },
  },
  {
    tableName: "users",
    timestamps: true
  }
);

export default User;
