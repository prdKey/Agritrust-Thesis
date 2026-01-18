import express from "express"
import {loginWallet, getMe, registerWallet, verifySignature} from "../controllers/Auth.controller.js";
const router = express.Router();

router.post("/wallet-login", loginWallet);
router.post("/wallet-register", registerWallet);
router.get("/me", getMe);
router.post("/verify", verifySignature);


export default router;