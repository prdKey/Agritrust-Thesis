import express from "express"
import {loginWallet, getMe, registerWallet, verifySignature, getNonce, verifySignatures} from "../controllers/Auth.controller.js";
const router = express.Router();

router.post("/wallet-login", loginWallet);
router.post("/wallet-register", registerWallet);
router.get("/me", getMe);
router.post("/nonce", getNonce);
router.post("/verify", verifySignature);
router.post("/verify-sig", verifySignatures)


export default router;