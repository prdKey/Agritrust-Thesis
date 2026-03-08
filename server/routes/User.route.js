import express from "express"
import {updateProfile, getSellerStats, getBalance, getAllUsers} from "../controllers/User.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.put("/", authMiddleware, updateProfile)
router.get("/sellerstats/:walletAddress", getSellerStats)
router.get("/balance", authMiddleware, getBalance)
router.get("/", authMiddleware, getAllUsers)

export default router;