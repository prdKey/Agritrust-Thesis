import express from "express"
import {updateProfile} from "../controllers/User.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.put("/", authMiddleware, updateProfile)

export default router;