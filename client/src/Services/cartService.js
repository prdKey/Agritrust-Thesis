import axios from "axios";
import { getToken } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL;


const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});

export const getBuyerCarts = async () => {
  const res = await axios.get(`${API_URL}/carts`, {
    headers: authHeader(),
  });
  return res.data;
};

export const addToCart = async (data) => {
  const res = await axios.post(`${API_URL}/carts`, data, {
    headers: authHeader(),
  });
  return res.data;
};

export const updateCartQuantity = async (data) => {
  const res = await axios.put(`${API_URL}/carts`, data, {
    headers: authHeader(),
  });
  return res.data;
};

export const removeFromCart = async (productId) => {
  console.log(`Removing product ${productId} from cart`);
  const res = await axios.delete(`${API_URL}/carts/${productId}`, {
    headers: authHeader(),
  });
  return res.data;
}
