import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "testagritrust",
  "root",
  "Filipinas1.",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql"
  }
);

export default sequelize;
