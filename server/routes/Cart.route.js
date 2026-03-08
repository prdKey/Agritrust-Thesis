import express from "express"
import authMiddleware from "../middleware/auth.middleware.js";
import {addToCart, getBuyerCarts, updateCartQuantity, removeFromCart} from "../controllers/Cart.controller.js"
const router = express.Router();

//private routes
router.get("/", authMiddleware, getBuyerCarts);
router.post("/", authMiddleware, addToCart);
router.put("/", authMiddleware, updateCartQuantity);
router.delete("/:productId", authMiddleware, removeFromCart);

export default router;