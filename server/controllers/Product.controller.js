import { Product, User } from "../models/index.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get owner of a product
export const getProductOwner = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const owner = await product.getUser(); // thanks to Sequelize associations
    res.json(owner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsByUser = async (req, res) => {
  try {
  const user = await User.findByPk(req.params.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  const products = await user.getProducts(); // thanks to Sequelize associations
  res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.findAll({ where: { userId } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, origin, description, quantity, unit, price, ipfsHash, blockchainHash} = req.body;
    const product = await Product.create({ name, origin, description, quantity, unit, price, ipfsHash, blockchainHash, userId });
    res.status(201).json(product);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.userId !== userId) return res.status(403).json({ message: "Forbidden. You can only update your own products." });
    const { name, origin, description, quantity, unit, price, ipfsHash, blockchainHash } = req.body;
    await product.update({ name, origin, description, quantity, unit, price, ipfsHash, blockchainHash });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.userId !== userId) return res.status(403).json({ message: "Forbidden. You can only delete your own products." });
    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}
