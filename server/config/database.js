import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "testagritrust",
  "root",
  "Filipinas1.",
  {
    host: "localhost",
    dialect: "mysql"
  }
);

export default sequelize;
