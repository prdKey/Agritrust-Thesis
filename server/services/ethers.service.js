import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABI manually
const abiPath = path.join(__dirname, "../abis/AgriMarketplaceEscrow.json");
const AgriMarketplaceABI = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// Provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Backend wallet (pays gas)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract instance
const marketplaceContract = new ethers.Contract(
  process.env.MARKETPLACE_ADDRESS,
  AgriMarketplaceABI,
  signer
);

export { marketplaceContract };
