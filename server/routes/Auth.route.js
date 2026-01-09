import express from "express"
import {requestNonce, verifySignature} from "../controllers/Auth.controller.js";
const router = express.Router();

router.post("/nonce", requestNonce);
router.post("/verify", verifySignature);

export default router;