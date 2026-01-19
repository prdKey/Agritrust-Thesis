import User from "../models/User.model.js";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import {contract} from "../blockchain/contract.js"

const generateNonce = () => Math.floor(Math.random() * 1000000).toString();

export const loginWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) return res.status(400).json({ message: "Wallet address required" });
    let user = await User.findOne({ where: { walletAddress } });
    
    if (!user) { return res.status(404).json({ message: "User not found! Register first" }); }
    user.nonce = generateNonce();
    await user.save();
    res.json({ nonce: user.nonce, message: "Login Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const registerWallet = async (req, res) => {
  try {
    const { walletAddress, firstName, lastName, email, phone, gender, dob} = req.body;
    if (!walletAddress) return res.status(400).json({ message: "Wallet address required" });
    let user = await User.findOne({ where: { walletAddress } });
    if (user) { return res.status(400).json({ message: "User already exists! Proceed to login" }); }
    user = await User.create({
      walletAddress,
      lastName,
      firstName,
      email,
      phone,
      gender,
      dob,
      nonce: generateNonce(),
    });
    res.status(200).json({message: "Registered Successfully"});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifySignature = async (req, res) => {[]
  const { walletAddress, signature } = req.body;
  if (!walletAddress || !signature) return res.status(400).json({ message: "Missing fields" });

  const userData = await User.findOne({ where: { walletAddress } });
  if (!userData) return res.status(404).json({ message: "User not found" });

  const message = `AgriTrust Login: ${userData.nonce}`;
  const signerAddress = ethers.verifyMessage(message, signature);
  if (signerAddress.toLowerCase() === walletAddress.toLowerCase()) {
    // Reset nonce after successful login
    userData.nonce = generateNonce();
    await userData.save();
    // fetch userStat
    const userStat = await contract.getBuyerStats(walletAddress)

    const user = 
    {
      ...userData.dataValues,
      totalOrders: Number(userStat.totalOrders),
      activeOrders: Number(userStat.activeOrders),
      agtSpent: Number(userStat.agtSpent)
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // Here you can generate a JWT token or session
    return res.status(200).json({ message: "Login successful", token, user: user});
  }

  res.status(401).json({ message: "Invalid signature" });
};

export const getMe = async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
   
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await User.findByPk(decoded.id);
    
    if (!userData) return res.status(401).json({ message: "Unauthorized" });
    
    const userStat = await contract.getBuyerStats(userData.walletAddress)
   
 
    const user = 
    {
      ...userData.dataValues,
      totalOrders: Number(userStat.totalOrders),
      activeOrders: Number(userStat.activeOrders),
      agtSpent: Number(userStat.agtSpent)
    }
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};