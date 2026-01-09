import User from "../models/User.model.js";

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