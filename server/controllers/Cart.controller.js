import { User } from "../models/index.js";
import { cartManagerContract } from "../blockchain/contract.js";

/**
 * GET buyer cart
 */
export const getBuyerCarts = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const dataRaw = await cartManagerContract.getBuyerCart(user.walletAddress);
    const carts = dataRaw.map((data) => ({
      id: Number(data.id),
      productId: Number(data.productId),
      buyer: data.buyer,
      seller: data.seller,
      name: data.name,
      category: data.category,
      stock: Number(data.stock),
      quantity: Number(data.quantity),
      pricePerUnit: Number(data.pricePerUnit),
      totalPrice: Number(data.totalPrice),
      exists: data.exists,
    }));

    res.status(200).json({ carts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADD to cart
 */
export const addToCart = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const user = await User.findByPk(req.user.id);

    const tx = await cartManagerContract.addToCart(
      id,
      user.walletAddress,
      quantity
    );

    await tx.wait(); // ⏳ wait for confirmation

    const dataRaw = await cartManagerContract.getBuyerCart(user.walletAddress);

    const carts = dataRaw.map((data) => ({
      id: Number(data.id),
      productId: Number(data.productId),
      quantity: Number(data.quantity),
      totalPrice: Number(data.totalPrice),
      pricePerUnit: Number(data.pricePerUnit),
      stock: Number(data.stock),
      exists: data.exists,
    }));

    res.status(200).json({ carts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE cart quantity
 */
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findByPk(req.user.id);

    if (quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const tx = await cartManagerContract.updateCartQuantity(
      productId,
      user.walletAddress,
      quantity
    );

    await tx.wait(); // ⏳ wait for blockchain

    const dataRaw = await cartManagerContract.getBuyerCart(user.walletAddress);

    const carts = dataRaw.map((data) => ({
      id: Number(data.id),
      productId: Number(data.productId),
      buyer: data.buyer,
      seller: data.seller,
      name: data.name,
      category: data.category,
      stock: Number(data.stock),
      quantity: Number(data.quantity),
      pricePerUnit: Number(data.pricePerUnit),
      totalPrice: Number(data.totalPrice),
      exists: data.exists,
    }));

    res.status(200).json({ carts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
