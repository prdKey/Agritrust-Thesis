import express from "express"
import {
    getOrdersBySeller,
    getAllOrders,
    buyProduct, confirmShipment, 
    getOrdersByBuyer, 
    getAvailableOrders,
    getOrdersByLogistics,
    acceptOrder,
    pickupOrder,
    confirmDelivery,
    confirmReceipt,
    updateOrderLocation,
    getOrderById,
    markOutForDelivery,
    cancelOrderBySeller,
    cancelOrderByBuyer,
    openDispute,
    resolveDispute,
    getDisputedOrders
} from "../controllers/Order.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/seller", authMiddleware ,getOrdersBySeller);
router.get("/all", authMiddleware, getAllOrders);
router.post("/checkout", authMiddleware, buyProduct);
router.put("/confirm-shipment", authMiddleware, confirmShipment);
router.get("/buyer", authMiddleware, getOrdersByBuyer );
router.get("/available-orders", authMiddleware, getAvailableOrders)
router.get("/logistics", authMiddleware, getOrdersByLogistics)
router.put("/accept-order", authMiddleware, acceptOrder)
router.put("/pickup-order", authMiddleware, pickupOrder)
router.put("/confirm-delivery", authMiddleware, confirmDelivery)
router.put("/confirm-receipt", authMiddleware, confirmReceipt)
router.put("/update-location", authMiddleware, updateOrderLocation)
router.get("/:orderId", authMiddleware, getOrderById)
router.put("/mark-out-for-delivery", authMiddleware, markOutForDelivery)
router.put("/cancel-by-seller", authMiddleware, cancelOrderBySeller)
router.put("/cancel-by-buyer", authMiddleware, cancelOrderByBuyer)
router.get("/disputed", authMiddleware, getDisputedOrders)
router.put("/open-dispute", authMiddleware, openDispute)
router.put("/resolve-dispute", authMiddleware, resolveDispute)

export default router;