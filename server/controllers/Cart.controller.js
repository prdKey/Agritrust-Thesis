import { User } from "../models/index.js";
import { cartManagerContract } from "../blockchain/contract.js";
import { parseUnits, formatUnits } from "ethers";

/**
 * GET buyer cart
 */
export const getBuyerCarts = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    
    const dataRaw = await cartManagerContract.getBuyerCart(walletAddress);
    const carts = dataRaw.map((data) => ({
      id: Number(data.id),
      productId: Number(data.productId),
      buyerAddress: data.buyerAddress,
      sellerAddress: data.sellerAddress,
      name: data.name,
      category: data.category,
      stock: Number(data.stock),
      quantity: Number(data.quantity),
      pricePerUnit: Number(formatUnits(data.pricePerUnit, 18)),
      totalPrice: Number(formatUnits(data.totalPrice, 18)),
      imageCID: data.imageCID
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
    const walletAddress = req.user.walletAddress;

    const tx = await cartManagerContract.addToCart(
      id,
      walletAddress,
      quantity
    );

    await tx.wait(); // ⏳ wait for confirmation

    const dataRaw = await cartManagerContract.getBuyerCart(walletAddress);

    const carts = dataRaw.map((data) => ({
      id: Number(data.id),
      productId: Number(data.productId),
      quantity: Number(data.quantity),
      totalPrice: Number(formatUnits(data.totalPrice, 18)),
      pricePerUnit: Number(formatUnits(data.pricePerUnit, 18)),
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
      pricePerUnit: Number(formatUnits(data.pricePerUnit, 18)),
      totalPrice: Number(formatUnits(data.totalPrice, 18)),
      exists: data.exists,
    }));

    res.status(200).json({ carts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const walletAddress = req.user.walletAddress;
    const tx = await cartManagerContract.removeFromCart(
      productId, walletAddress
    );
    await tx.wait(); // ⏳ wait for confirmation

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
      pricePerUnit: Number(formatUnits(data.pricePerUnit, 18)),
      totalPrice: Number(formatUnits(data.totalPrice, 18)),
      exists: data.exists,
    }));

    res.status(200).json({ carts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};  
