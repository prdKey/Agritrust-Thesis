import express from "express"
import {
    getAllProducts,
    getProductOwner,
    getProductsByUser,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/Product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

//private routes
router.post("/my", authMiddleware, createProduct);
router.put("/my/:id", authMiddleware, updateProduct);
router.delete("/my/:id", authMiddleware, deleteProduct);

//public routes
router.get("/", getAllProducts);
router.get("/:id/owner", getProductOwner);
router.get("/user/:userId", getProductsByUser);
router.get("/:id", getProductById);

export default router;