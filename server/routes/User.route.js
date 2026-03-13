import express from "express"
import {updateProfile, getSellerStats, getBalance, getAllUsers,getUserById, toggleUserStatus, changeUserRole,
  submitApplication, getMyApplications, getAllApplications, reviewApplication,} from "../controllers/User.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();

router.put("/", authMiddleware, updateProfile)
router.get("/sellerstats/:walletAddress", getSellerStats)
router.get("/balance", authMiddleware, getBalance)
router.get("/", authMiddleware, getAllUsers)
// ── User management (admin only) ─────────────────────────────────────────────
router.get("/",                     authMiddleware, getAllUsers);
router.get("/:id",                  authMiddleware, getUserById);
router.patch("/:id/status",         authMiddleware, toggleUserStatus);
router.patch("/:id/role",           authMiddleware, changeUserRole);

// ── Applications ─────────────────────────────────────────────────────────────
router.post("/applications",                authMiddleware, submitApplication);
router.get("/applications/mine",            authMiddleware, getMyApplications);
router.get("/applications/all",             authMiddleware, getAllApplications);
router.patch("/applications/:id/review",    authMiddleware, reviewApplication);

export default router;