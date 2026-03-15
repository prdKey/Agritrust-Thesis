import axios from "axios";
import { ethers } from "ethers";
import { getToken } from "./tokenService";

const API_URL               = import.meta.env.VITE_API_URL;
const ORDER_MANAGER_ADDRESS = import.meta.env.VITE_ORDER_MANAGER_ADDRESS;
const TOKEN_ADDRESS         = import.meta.env.VITE_TOKEN_ADDRESS;
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const TOKEN_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

// ── Approve via MetaMask (FREE on SKALE — sFUEL has no monetary value) ────────
const approveAGT = async (amountInAGT) => {
  if (!window.ethereum) throw new Error("MetaMask not found");

  const provider  = new ethers.BrowserProvider(window.ethereum);
  const signer    = await provider.getSigner();
  const owner     = await signer.getAddress();
  const token     = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
  const amountWei = ethers.parseEther(String(amountInAGT));

  // Skip if allowance already sufficient
  const allowance = await token.allowance(owner, ORDER_MANAGER_ADDRESS);
  if (allowance >= amountWei) return;

  const tx = await token.approve(ORDER_MANAGER_ADDRESS, amountWei);
  await tx.wait();
};

// ── buyProduct — approve first (free on SKALE), then backend executes ─────────
export const buyProduct = async (productId, quantity, deliveryAddress, totalPrice) => {
  // Approve on frontend (user pays sFUEL — free on SKALE)
  console.log(totalPrice)
  await approveAGT(totalPrice);

  // Backend calls buyProduct on-chain
  const res = await axios.post(
    `${API_URL}/orders/checkout`,
    { productId, quantity, deliveryAddress },
    { headers: authHeader() }
  );
  return res.data;
};

export const getOrdersBySeller = async () => {
  const res = await axios.get(`${API_URL}/orders/seller`, { headers: authHeader() });
  return res.data;
};

export const getOrdersByBuyer = async () => {
  const res = await axios.get(`${API_URL}/orders/buyer`, { headers: authHeader() });
  return res.data;
};

export const confirmReceipt = async (orderId) => {
  const res = await axios.put(`${API_URL}/orders/confirm-receipt`, { orderId }, { headers: authHeader() });
  return res.data;
};

export const confirmShipment = async (orderId) => {
  const res = await axios.put(`${API_URL}/orders/confirm-shipment`, { orderId }, { headers: authHeader() });
  return res.data;
};

export const getOrdersByLogistics = async () => {
  const res = await axios.get(`${API_URL}/orders/logistics`, { headers: authHeader() });
  return res.data;
};

export const pickupOrder = async (orderId, location) => {
  const res = await axios.put(`${API_URL}/orders/pickup-order`, { orderId, location }, { headers: authHeader() });
  return res.data;
};

export const confirmDelivery = async (orderId, location) => {
  const res = await axios.put(`${API_URL}/orders/confirm-delivery`, { orderId, location }, { headers: authHeader() });
  return res.data;
};

export const getAvailableOrders = async () => {
  const res = await axios.get(`${API_URL}/orders/available-orders`, { headers: authHeader() });
  return res.data;
};

export const acceptOrder = async (orderId) => {
  const res = await axios.put(`${API_URL}/orders/accept-order`, { orderId }, { headers: authHeader() });
  return res.data;
};

export const updateOrderLocation = async (orderId, location) => {
  const res = await axios.put(`${API_URL}/orders/update-location`, { orderId, location }, { headers: authHeader() });
  return res.data;
};

export const markOutForDelivery = async (orderId) => {
  const res = await axios.put(`${API_URL}/orders/mark-out-for-delivery`, { orderId }, { headers: authHeader() });
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await axios.get(`${API_URL}/orders/${orderId}`, { headers: authHeader() });
  return res.data;
};

export const cancelOrderBySeller = async (orderId) => {
  const res = await axios.put(`${API_URL}/orders/cancel-by-seller`, { orderId }, { headers: authHeader() });
  return res.data;
};

export const cancelOrderByBuyer = async (orderId) => {
  const res = await axios.put(`${API_URL}/orders/cancel-by-buyer`, { orderId }, { headers: authHeader() });
  return res.data;
};

export const openDispute = async (orderId) => {
  const res = await axios.put(`${API_URL}/orders/open-dispute`, { orderId }, { headers: authHeader() });
  return res.data;
};

export const resolveDispute = async (orderId, refundBuyer) => {
  const res = await axios.put(`${API_URL}/orders/resolve-dispute`, { orderId, refundBuyer }, { headers: authHeader() });
  return res.data;
};

export const getDisputedOrders = async () => {
  const res = await axios.get(`${API_URL}/orders/disputed`, { headers: authHeader() });
  return res.data;
};

export const getAllOrders = async () => {
  const res = await axios.get(`${API_URL}/orders/all`, { headers: authHeader() });
  return res.data;
};