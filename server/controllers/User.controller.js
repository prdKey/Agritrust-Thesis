import User from "../models/User.model.js";
import { contract } from "../blockchain/contract.js";

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