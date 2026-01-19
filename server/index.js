import express from "express";
import { sequelize } from "./models/index.js";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

//Routes
import productRoute from "./routes/Product.route.js"
import authRoute from "./routes/Auth.route.js"
import userRoute from "./routes/User.route.js"
import orderRoute from "./routes/Order.route.js"

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/products", productRoute)
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/orders", orderRoute)

// Sync database & start server
sequelize.sync({ alter: true }).then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});
