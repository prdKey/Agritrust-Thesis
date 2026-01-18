import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Load ABI
const abiPath = path.resolve(
  "C:/Users/prado/OneDrive/Documents/4TH YEAR FILES/Agritrust/contracts/AgriMarketplaceEscrowABI.json"
);
const AgritrustABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.BACKEND_PRIVATE_KEY, provider);

export const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  AgritrustABI,
  wallet
);
