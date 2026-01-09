import sequelize from "../config/database.js";
import User from "./User.model.js";
import Product from "./Product.model.js";

// One-to-Many: User -> Product
User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: "userId", as: "user" });

export { sequelize, User, Product };
