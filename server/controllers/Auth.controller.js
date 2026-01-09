import User from "../models/User.model.js";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

const generateNonce = () => Math.floor(Math.random() * 1000000).toString();

export const requestNonce = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ error: "Wallet address required" });
    let user = await User.findOne({ where: { walletAddress } });

    if (!user) {
        user = await User.create({
        walletAddress,
        nonce: generateNonce(),
        });
    } else {
        user.nonce = generateNonce();
        await user.save();
    }

    res.json({ nonce: user.nonce });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifySignature = async (req, res) => {
  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature) return res.status(400).json({ error: "Missing fields" });

  const user = await User.findOne({ where: { walletAddress } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const message = `Login nonce: ${user.nonce}`;
  const signerAddress = ethers.verifyMessage(message, signature);

  if (signerAddress.toLowerCase() === walletAddress.toLowerCase()) {
    // Reset nonce after successful login
    user.nonce = generateNonce();
    await user.save();

    const token = jwt.sign(
      { walletAddress: user.walletAddress, id: user.id},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Here you can generate a JWT token or session
    return res.json({ message: "Login successful", token });
  }

  res.status(401).json({ error: "Invalid signature" });
};
