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

    fullName: {
      type: DataTypes.STRING,
      allowNull: true
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

    password: {
      type: DataTypes.STRING,
      allowNull: true
    },

    role: {
      type: DataTypes.ENUM("FARMER", "BUYER", "ADMIN", "LOGISTICS"),
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

    // 🔥 Add nonce for wallet signature login
    nonce: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "users",
    timestamps: true
  }
);

export default User;
