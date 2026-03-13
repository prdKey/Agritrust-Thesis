import Cart from "../models/Cart.js";
import { Op } from "sequelize";

/* GET /api/carts — get all cart items of logged-in user */
export const getCart = async (req, res) => {
  try {
    const items = await Cart.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* POST /api/carts — add item or increment quantity if already in cart */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, name, pricePerUnit, imageCID, category, stock } = req.body;
    if (!productId || !name || pricePerUnit == null) {
      return res.status(400).json({ error: "productId, name, and pricePerUnit are required" });
    }

    const [item, created] = await Cart.findOrCreate({
      where: { userId: req.user.id, productId },
      defaults: {
        userId: req.user.id,
        productId,
        quantity,
        name,
        pricePerUnit,
        imageCID,
        category,
        stock,
      },
    });

    if (!created) {
      // Already in cart — increment quantity (cap at stock)
      const newQty = Math.min(item.quantity + quantity, stock ?? item.stock);
      await item.update({ quantity: newQty, stock: stock ?? item.stock });
    }

    res.status(created ? 201 : 200).json({ item, created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* PUT /api/carts/:productId — update quantity */
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const item = await Cart.findOne({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    if (!item) return res.status(404).json({ error: "Cart item not found" });

    const capped = Math.min(quantity, item.stock);
    await item.update({ quantity: capped });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE /api/carts/:productId — remove single item */
export const removeCartItem = async (req, res) => {
  try {
    const deleted = await Cart.destroy({
      where: { userId: req.user.id, productId: req.params.productId },
    });
    if (!deleted) return res.status(404).json({ error: "Cart item not found" });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE /api/carts — clear entire cart */
export const clearCart = async (req, res) => {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* DELETE /api/carts/bulk — remove selected items (after checkout) */
export const removeBulkCartItems = async (req, res) => {
  try {
    const { productIds } = req.body; // array of productIds
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "productIds array is required" });
    }
    await Cart.destroy({
      where: { userId: req.user.id, productId: { [Op.in]: productIds } },
    });
    res.json({ message: "Items removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};