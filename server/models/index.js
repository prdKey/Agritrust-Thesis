import sequelize from "../config/database.js";
import User from "./User.model.js";
import Product from "./Product.model.js";
import Order from "./Order.model.js";

// User → Product (one-to-many)
User.hasMany(Product, { foreignKey: "userId", as: "products" });
Product.belongsTo(User, { foreignKey: "userId", as: "seller" });

// User → Order (buyer)
User.hasMany(Order, { foreignKey: "buyerId", as: "purchases" });
Order.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });

// User → Order (seller)
User.hasMany(Order, { foreignKey: "sellerId", as: "sales" });
Order.belongsTo(User, { foreignKey: "sellerId", as: "seller" });

// Product → Order (optional)
Product.hasMany(Order, { foreignKey: "productId", sourceKey: "id", as: "orders" });
Order.belongsTo(Product, { foreignKey: "productId", targetKey: "id", as: "product" });

export { sequelize, User, Product, Order };
