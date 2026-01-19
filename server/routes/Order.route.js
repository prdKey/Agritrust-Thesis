import express from "express"
import {getRecentBuyerOrders} from "../controllers/Order.controller.js";
const router = express.Router();

router.get("/recent", getRecentBuyerOrders);


export default router;