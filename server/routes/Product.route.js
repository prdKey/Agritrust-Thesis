import express from "express"
import {
    getAllProducts,
    getProductOwner,
    getProductsBySeller,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    buyProduct
} from "../controllers/Product.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

//private routes
router.post("/", authMiddleware, createProduct);
router.put("/", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.post("/checkout", authMiddleware, buyProduct);

//public routes
router.get("/", getAllProducts);
router.get("/:id/owner", getProductOwner);
router.get("/user/:id",getProductsBySeller);
router.get("/:id", getProductById);

export default router;