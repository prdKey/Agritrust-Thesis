import express from "express"
import {updateProfile, getSellerStats, getBalance} from "../controllers/User.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.put("/", authMiddleware, updateProfile)
router.get("/sellerstats/:walletAddress", getSellerStats)
router.get("/balance", authMiddleware, getBalance)

export default router;