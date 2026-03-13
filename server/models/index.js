import sequelize from "../config/database.js";
import User from "./User.model.js";
import Address from "./Address.js";
import Application from "./Application.js";

User.hasMany(Application, { foreignKey: "userId", onDelete: "CASCADE", sourceKey: "id" });
Application.belongsTo(User, { foreignKey: "userId", targetKey: "id", constraints: false })

// Explicitly pass the correct table name to avoid Sequelize pluralization issues
User.hasMany(Address, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  sourceKey: "id",
});

Address.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
  constraints: false, // ← disables auto FK generation in CREATE TABLE
});

export { sequelize, User, Address, Application};