import axios from "axios";
import { getToken } from "../auth/tokenService.js";


const API_URL = "http://localhost:3001/api";
    
export const getAllProducts = async () => {
    const res = await axios.get(`${API_URL}/products`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    return res.data
}

export const getProductsByUser = async () =>
{
    const res = await axios.get(`${API_URL}/products/user`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
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