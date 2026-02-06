import express from "express"
import {getOrdersBySeller, buyProduct, confirmShipment} from "../controllers/Order.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", authMiddleware ,getOrdersBySeller);
router.post("/", authMiddleware, buyProduct);
router.put("/", authMiddleware, confirmShipment)


export default router;