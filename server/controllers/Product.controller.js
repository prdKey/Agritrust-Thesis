import {contract, productManagerContract, orderManagerContract} from "../blockchain/contract.js"
import { User } from "../models/index.js"   
import { parseUnits, formatUnits } from "ethers";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the smart contract
    const data = await productManagerContract.getAllActiveProducts();

    // Fetch all users from your database
    const users = await User.findAll();

    // Map products with the owner's address
    const products = data.map((p) => {
      // Find the owner by wallet address
      const owner = users.find(
        u => u.walletAddress.toLowerCase() === p.sellerAddress.toLowerCase()
      );
      return {
        id: Number(p.id),
        sellerName: owner ? owner.firstName + " " + owner.lastName : "Unknown", 
        sellerAddress: p.sellerAddress,   // blockchain wallet
        imageCID: p.imageCID,
        name: p.name,
        category: p.category,
        pricePerUnit: Number(formatUnits(p.pricePerUnit, 18)), // BigInt -> number
        stock: Number(p.stock),                // BigInt -> number
        active: p.active,
        ownerAddress: owner ? owner.address : "Unknown" // physical address
      };
    });
    res.json({ products });
  } catch (err) {
    console.error(err);
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
        pricePerUnit: Number(formatUnits(p.pricePerUnit, 18)),  // BigInt -> string
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
      productId: Number(productRaw.id),
      sellerAddress: productRaw.sellerAddress,
      name: productRaw.name,
      imageCID: productRaw.imageCID,
      category: productRaw.category,
      pricePerUnit: Number(formatUnits(productRaw.pricePerUnit, 18)),
      stock: Number(productRaw.stock),
      active: productRaw.active
    };
    res.status(201).json({product});
  } catch (err) {
    console.error(err);
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
      parseUnits(pricePerUnit.toString(), 18), // Convert to Wei
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
        pricePerUnit: Number(formatUnits(p.pricePerUnit, 18)),  // BigInt -> string (convert back from Wei)
        stock: Number(p.stock),      // BigInt -> string
        active: p.active
      }));

    res.json({products});
  }
  catch (err) {
    console.error(err);
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
      parseUnits(pricePerUnit.toString(), 18),
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
        pricePerUnit: Number(formatUnits(p.pricePerUnit, 18)),  // BigInt -> string
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

