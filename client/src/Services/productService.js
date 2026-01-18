import axios from "axios";
import { getToken } from "../../../shared/auth/tokenService.js";


const API_URL = "http://localhost:3001/api";
    
export const getAllProducts = async () => {
    const res = await axios.get(`${API_URL}/products`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });
    

    return res.data
}    