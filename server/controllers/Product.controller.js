import { where } from "sequelize";
import {contract} from "../blockchain/contract.js"
import { User } from "../models/index.js"

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const count = await contract.productCount();
    const products = [];
    for (let i = 1; i <= Number(count); i++) {
      const product = await contract.products(i);

      // Skip deleted / empty products
      if (product.seller === "0x0000000000000000000000000000000000000000") {
        continue;
      }
      const user = await User.findOne({where: {walletAddress: product.seller}});
      products.push({
        id: Number(product.id),
        sellerName: user.firstName + " " + user.lastName,
        sellerAddress: product.seller,
        name: product.name,
        imageCID: product.imageCID,
        category: product.category,
        pricePerUnit: Number(product.pricePerUnit),
        stock: Number(product.stock),
        active: product.active
      });
    }
    
    res.json({ products });
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
  
  const productsRaw = await contract.getProductsBySeller(user.walletAddress)

  const products = productsRaw.map((p) => ({
      id: Number(p[0]),
      sellerName: user.firstName +" "+ user.lastName,            // BigInt -> string
      sellerAddress: p[1],
      name: p[2],
      description: p[3],
      category: p[4],
      pricePerUnit: Number(p[5]),  // BigInt -> string
      quantity: Number(p[6]),      // BigInt -> string
      available: p[7]
    }));

  console.log(products)
  res.json({products});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getProductById = async (req, res) => {
  try {
    const productRaw = await contract.products(req.params.id);
    if (!product || product.seller === "0x0000000000000000000000000000000000000000") {
      return res.status(404).json({ message: "Product not found" });
    }
    const user = await User.findOne({where: {walletAddress: product.seller}});
    // Convert BigNumbers to string for JSON
    const product = {
      id: Number(productRaw.id),
      sellerName: user.firstName + " " + user.lastName,
      sellerAddress: productRaw.seller,
      name: productRaw.name,
      imageCID: productRaw.imageCID,
      category: productRaw.category,
      pricePerUnit: Number(productRaw.pricePerUnit),
      stock: Number(productRaw.stock),
      active: productRaw.active
    };
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const products = await Product.findAll({ where: { sellerId } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const createProduct = async (req, res) => {
  try {
    const userId = 1;
    const { name, description, quantity, unit, price, imageCID } = req.body;

    const seller = await User.findByPk(userId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const product = await Product.create({ name, description, quantity, unit, price, imageCID, userId});
    res.status(201).json(product);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId !== sellerId) return res.status(403).json({ message: "Forbidden. You can only update your own products." });
    const { name, sellerName, description, quantity, unit, price, imageCID } = req.body;
    const seller = await User.findByPk(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    await product.update({ name, sellerName, description, quantity, unit, price, imageCID });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export const deleteProduct = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.sellerId !== sellerId) return res.status(403).json({ message: "Forbidden. You can only delete your own products." });
    
    const seller = await User.findByPk(sellerId);
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}
