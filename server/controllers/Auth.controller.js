import User from "../models/User.model.js";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

const generateNonce = () => Math.floor(Math.random() * 1000000).toString();

export const loginWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });
    let user = await User.findOne({ where: { walletAddress } });
    console.log("Found user for wallet address:", user);
    if (!user) { return res.status(404).json({ error: "User not found! Register first" }); }
    user.nonce = generateNonce();
    await user.save();
    res.json({ nonce: user.nonce });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const registerWallet = async (req, res) => {
  try {
    const { walletAddress, lastName, firstName, email, mobileNumber} = req.body;
    if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });
    let user = await User.findOne({ where: { walletAddress } });
    if (user) { return res.status(400).json({ error: "User already exists! Proceed to login" }); }
    user = await User.create({
      walletAddress,
      lastName,
      firstName,
      email,
      mobileNumber,
      nonce: generateNonce(),
    });
    res.json({ nonce: user.nonce });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifySignature = async (req, res) => {
  console.log("Verifying signature with request body:", req.body);
  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature) return res.status(400).json({ error: "Missing fields" });

  const user = await User.findOne({ where: { walletAddress } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const message = `AgriTrust Login: ${user.nonce}`;
  const signerAddress = ethers.verifyMessage(message, signature);
  if (signerAddress.toLowerCase() === walletAddress.toLowerCase()) {
    // Reset nonce after successful login
    user.nonce = generateNonce();
    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Here you can generate a JWT token or session
    return res.json({ message: "Login successful", token, user});
  }

  res.status(401).json({ error: "Invalid signature" });
};

export const getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};