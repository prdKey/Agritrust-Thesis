import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  removeBulkCartItems,
} from "../controllers/Cart.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",                authMiddleware, getCart);
router.post("/",               authMiddleware, addToCart);
router.put("/:productId",      authMiddleware, updateCartItem);
router.delete("/bulk",         authMiddleware, removeBulkCartItems);
router.delete("/clear",        authMiddleware, clearCart);
router.delete("/:productId",   authMiddleware, removeCartItem);

export default router;