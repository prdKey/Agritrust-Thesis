import {contract, productManagerContract, orderManagerContract} from "../blockchain/contract.js"
import { User } from "../models/index.js"   

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    
    const data = await productManagerContract.getAllActiveProducts()


    const products = data.map((p) => ({
      id: Number(p.id),         // BigInt -> string
      sellerAddress: p.sellerAddress,
      imageCID: p.imageCID,
      name: p.name,
      category: p.category,
      pricePerUnit: Number(p.pricePerUnit),  // BigInt -> string
      stock: Number(p.stock),      // BigInt -> string
      active: p.active
    }))
    console.log({products})
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsBySeller = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const productsRaw = await productManagerContract.getProductsBySeller(user.walletAddress)
    const products = productsRaw.map((p) => ({
        id: Number(p.id),         // BigInt -> string
        sellerAddress: p.sellerAddress,
        imageCID: p.imageCID,
        name: p.name,
        category: p.category,
        pricePerUnit: Number(p.pricePerUnit),  // BigInt -> string
        stock: Number(p.stock),      // BigInt -> string
        active: p.active
      }));
    res.json({products});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const getProductById = async (req, res) => {
  try {
    const productRaw = await productManagerContract.getProduct(req.params.id);
    if (productRaw.seller === "0x0000000000000000000000000000000000000000") {
      
      return res.status(404).json({ message: "Product not found" });
    }
    // Convert BigNumbers to string for JSON
    const product = {
      id: Number(productRaw.id),
      sellerAddress: productRaw.sellerAddress,
      name: productRaw.name,
      imageCID: productRaw.imageCID,
      category: productRaw.category,
      pricePerUnit: Number(productRaw.pricePerUnit),
      stock: Number(productRaw.stock),
      active: productRaw.active
    };
    res.status(201).json({product});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const createProduct = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    const { name, stock, category ,pricePerUnit, imageCID } = req.body;

    const tx = await productManagerContract.listProduct(
      name,
      imageCID,
      category,
      pricePerUnit,
      stock,
      walletAddress
    )
    await tx.wait();
    
    const productsRaw = await productManagerContract.getProductsBySeller(walletAddress)

    const products = productsRaw.map((p) => ({
        id: Number(p.id),      // BigInt -> string
        sellerAddress: p.sellerAddress,
        imageCID: p.imageCID,
        name: p.name,
        category: p.category,
        pricePerUnit: Number(p.pricePerUnit),  // BigInt -> string
        stock: Number(p.stock),      // BigInt -> string
        active: p.active
      }));

    res.json({products});
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress;
    const { id, name, stock, category, pricePerUnit, imageCID } = req.body;
    const tx = await productManagerContract.updateProduct(
      id,
      name,
      imageCID,
      category,
      pricePerUnit,
      stock,
      walletAddress
    )
    await tx.wait();
    const productsRaw = await productManagerContract.getProductsBySeller(walletAddress)

    const products = productsRaw.map((p) => ({
        id: Number(p.id),    // BigInt -> string
        sellerAddress: p.sellerAddress,
        imageCID: p.imageCID,
        name: p.name,
        category: p.category,
        pricePerUnit: Number(p.pricePerUnit),  // BigInt -> string
        stock: Number(p.stock),      // BigInt -> string
        active: p.active
      }));
      
    res.json({products});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export const deleteProduct = async (req, res) => {
  try {
    const walletAddress = req.user.walletAddress
    const id = req.params.id
    const tx = await productManagerContract.deleteProduct(
      id,
      walletAddress
    )
    await tx.wait();
    const productsRaw = await productManagerContract.getProductsBySeller(walletAddress)

    const products = productsRaw.map((p) => ({
        id: Number(p.id),       // BigInt -> string
        sellerAddress: p.sellerAddress,
        imageCID: p.imageCID,
        name: p.name,
        category: p.category,
        pricePerUnit: Number(p.pricePerUnit),  // BigInt -> string
        stock: Number(p.stock),      // BigInt -> string
        active: p.active
      }));
      
    res.json({products});
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}

