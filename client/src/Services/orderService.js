import axios from "axios";
import { getToken } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL;
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});
    
export const getOrdersBySeller = async () => {
    const res = await axios.get(`${API_URL}/orders/seller`,
        {
            headers: authHeader(),
        }
    );
    return res.data
}

export const getOrdersByBuyer = async () => {
    const res = await axios.get(`${API_URL}/orders/buyer`,
        {
            headers: authHeader(),
        }
    )

    return res.data
}

export const confirmReceipt = async (orderId) =>{
    const res = await axios.put(`${API_URL}/orders/confirm-receipt`, {orderId},
        {
            headers: authHeader(),
        }
    )

    return res.data
}
export const buyProduct = async (productId, quantity) =>
{
    
    const res = await axios.post(`${API_URL}/orders/checkout`, {productId, quantity},
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}

export const confirmShipment = async(orderId) =>
{
    const res = await axios.put(`${API_URL}/orders/confirm-shipment`, {orderId},
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}

export const getOrdersByLogistics = async () =>
{
    const res = await axios.get(`${API_URL}/orders/logistics`,
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}

export const pickupOrder = async (orderId, location) =>
{
    const res = await axios.put(`${API_URL}/orders/pickup-order`, {orderId, location},
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}

export const confirmDelivery = async (orderId, location) =>
{
    const res = await axios.put(`${API_URL}/orders/confirm-delivery`, {orderId, location},
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}

export const getAvailableOrders = async () =>
{
    const res = await axios.get(`${API_URL}/orders/available-orders`,
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}

export const acceptOrder = async (orderId) =>
{
    const res = await axios.put(`${API_URL}/orders/accept-order`, {orderId},
        {
            headers: authHeader(),
        }
    );
    
    return res.data
}