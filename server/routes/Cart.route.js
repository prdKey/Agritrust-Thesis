import express from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import {addToCart, getBuyerCarts, updateCartQuantity} from "../controllers/Cart.controller.js"
const router = express.Router();

//private routes
router.get("/", authMiddleware, getBuyerCarts);
router.post("/", authMiddleware, addToCart);
router.put("/", authMiddleware, updateCartQuantity);

export default router;