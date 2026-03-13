import axios from "axios";
import { getToken } from "./tokenService.js";

const API_URL = import.meta.env.VITE_API_URL;
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const getCart = async () => {
  const res = await axios.get(`${API_URL}/carts`, { headers: authHeader() });
  return res.data?.items ?? [];
};

export const addToCart = async (product, quantity = 1) => {
  const res = await axios.post(`${API_URL}/carts`, {
    productId:    product.productId,
    quantity,
    name:         product.name,
    pricePerUnit: product.pricePerUnit,
    imageCID:     product.imageCID,
    category:     product.category,
    stock:        product.stock,
  }, { headers: authHeader() });
  return res.data;
};

export const updateCartItem = async (productId, quantity) => {
  const res = await axios.put(`${API_URL}/carts/${productId}`, { quantity }, { headers: authHeader() });
  return res.data;
};

export const removeCartItem = async (productId) => {
  const res = await axios.delete(`${API_URL}/carts/${productId}`, { headers: authHeader() });
  return res.data;
};

export const clearCart = async () => {
  const res = await axios.delete(`${API_URL}/carts/clear`, { headers: authHeader() });
  return res.data;
};

export const removeBulkCartItems = async (productIds) => {
  const res = await axios.delete(`${API_URL}/carts/bulk`, {
    headers: authHeader(),
    data: { productIds },
  });
  return res.data;
};