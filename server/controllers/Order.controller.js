import { where } from "sequelize";
import {contract} from "../blockchain/contract.js"
import { User } from "../models/index.js"

// Get all products
export const getRecentBuyerOrders = async (req, res) => {
  try {
    const { walletAddress, count } = req.query; // <-- use query for GET

    if (!walletAddress || !count) {
      return res.status(400).json({ message: "Missing walletAddress or count" });
    }

    // Convert count to number because query params are strings
    const countNum = parseInt(count, 10);

    // Call the smart contract
    const recentOrdersData = await contract.getRecentBuyerOrders(walletAddress, countNum);
  

    // Return result
    console.log({orders: recentOrdersData})
    res.json({ orders: recentOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

