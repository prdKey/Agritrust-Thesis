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
      allowNull: false
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    middleName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },

    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.ENUM("USER","SELLER", "ADMIN", "LOGISTICS"),
      allowNull: false,
      defaultValue: "USER"
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
