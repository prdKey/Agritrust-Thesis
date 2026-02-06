import axios from "axios";
import { getToken } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL;
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});
    
export const getOrdersBySeller = async () => {
    const res = await axios.get(`${API_URL}/orders`,
        {
            headers: authHeader(),
        }
    );
    return res.data
}

export const buyProduct = async (productId, quantity) =>
{
    
    const res = await axios.post(`${API_URL}/orders`, {productId, quantity},
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}

export const confirmShipment = async(orderId) =>
{
    const res = await axios.put(`${API_URL}/orders`, {orderId},
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}