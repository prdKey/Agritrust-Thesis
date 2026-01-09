import express from "express"
import {updateProfile} from "../controllers/User.controller.js";
const router = express.Router();

router.put("/", updateProfile)

export default router;