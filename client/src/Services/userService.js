import axios from "axios";
import { getToken } from "./tokenService";

const API_URL = import.meta.env.VITE_API_URL;
const authHeader = () => ({
  Authorization: `Bearer ${getToken()}`,
});
    
export const getBalance = async () => {
    const res = await axios.get(`${API_URL}/user/balance`,
        {
            headers: authHeader(),
        }
    );
    return res.data
}

export const getAllUsers = async () => {
    const res = await axios.get(`${API_URL}/users/`,
        {
            headers: authHeader(),
        }
    );
    return res.data.users;
}

