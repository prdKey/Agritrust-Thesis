import axios from "axios";
import { getToken } from "../auth/tokenService.js";


const API_URL = import.meta.env.VITE_API_URL;
    
export const getAllProducts = async () => {
    const res = await axios.get(`${API_URL}/products/`);
    return res.data
}

export const getProductsByUser = async (id) =>
{
    console.log(id)
    const res = await axios.get(`${API_URL}/products/user/${id}`);
    return res.data
}

export const listProduct = async (productData) => {
    const res = await axios.post(`${API_URL}/products/`, productData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    )
    return res.data;
};

export const updateProduct = async (productData) =>
{
    const res = await axios.put(`${API_URL}/products/`, productData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    )
    return res.data;
}

export const deleteProduct = async (id) =>
{
    const res = await axios.delete(`${API_URL}/products/${id}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    )

    return res.data
}

export const getProductById = async (id) =>
{
    const res = await axios.get(`${API_URL}/products/${id}`)

    return res.data
}

export const buyProduct = async (productData) =>
{   
    
    const res = await axios.post(`${API_URL}/products/checkout`, productData,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    )
    return res.data;
}