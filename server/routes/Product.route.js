import express from "express"
import {
    getAllProducts,
    getProductOwner,
    getProductsByUser,
    getProductById,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/Product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

//private routes
router.get("/my", authMiddleware, getMyProducts);
router.post("/my", authMiddleware, createProduct);
router.put("/my/:id", authMiddleware, updateProduct);
router.delete("/my/:id", authMiddleware, deleteProduct);

//public routes
router.get("/", getAllProducts);
router.get("/:id/owner", getProductOwner);
router.get("/user/:userId", getProductsByUser);
router.get("/:id", getProductById);

export default router;