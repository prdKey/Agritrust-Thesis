import User from "../models/User.model.js";
import { tokenContract } from "../blockchain/contract.js";
import { formatUnits } from "ethers";
import Application from "../models/Application.js";


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email} = req.body;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.fullName = name || user.fullName;
    user.email = email || user.email;
    await user.save();
    res.json({ message: "Profile updated successfully", user });
    }
        catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getSellerStats = async (req, res) =>{
  const walletAddress = req.params.walletAddress

  try{
    const data = await contract.getSellerStats(walletAddress)
    console.log(data.totalOrders)
    const stats = {
      totalProducts: Number(data.totalProducts),
      activeProducts: Number(data.activeOrders),
      totalOrders: Number(data.totalOrders),
      activeOrders: Number(data.activeOrders),
      completedOrders: Number(data.completedOrders),
      totalRevenue: Number(data.totalRevenue)
    }
    res.json({stats})
  } catch (err){
    return res.status(400).json({ message: "Missing walletAddress or Invalid walletAddress" });
  }
}

export const getBalance = async (req, res) => {
  try {
    
    const walletAddress = req.user.walletAddress;
    const balance = await tokenContract.balanceOf(walletAddress);
    res.json({ balance: Number(formatUnits(balance, 18)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* ── USER MANAGEMENT ────────────────────────────────────────────────────────── */

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: [] },
      order: [["createdAt", "DESC"]],
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    await user.update({ status: newStatus });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["USER", "SELLER", "ADMIN", "LOGISTICS"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({ role });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ── APPLICATIONS ────────────────────────────────────────────────────────────── */

// User submits application
export const submitApplication = async (req, res) => {
  try {
    const { roleApplying } = req.body;
    if (!["SELLER", "LOGISTICS"].includes(roleApplying)) {
      return res.status(400).json({ error: "roleApplying must be SELLER or LOGISTICS" });
    }

    // Check if user already has a pending application
    const existing = await Application.findOne({
      where: { userId: req.user.id, status: "PENDING" },
    });
    if (existing) {
      return res.status(409).json({ error: "You already have a pending application." });
    }

    // Check if user already has this role
    const user = await User.findByPk(req.user.id);
    if (user.role === roleApplying) {
      return res.status(409).json({ error: `You are already a ${roleApplying}.` });
    }

    const application = await Application.create({
      userId: req.user.id,
      roleApplying,
    });

    res.status(201).json({ application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User checks their own application status
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: get all applications
export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query; // optional filter: ?status=PENDING
    const where = status ? { status } : {};

    const applications = await Application.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["id", "firstName", "lastName", "email", "walletAddress", "role"] }],
    });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: approve or reject application
export const reviewApplication = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "status must be APPROVED or REJECTED" });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: User }],
    });
    if (!application) return res.status(404).json({ error: "Application not found" });
    if (application.status !== "PENDING") {
      return res.status(409).json({ error: "Application already reviewed" });
    }

    await application.update({
      status,
      adminNotes: adminNotes || null,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });

    // If approved — promote the user's role
    if (status === "APPROVED") {
      await application.User.update({ role: application.roleApplying });
    }

    res.json({ application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};