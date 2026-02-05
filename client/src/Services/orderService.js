import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
    
export const getRecentBuyerOrders = async (walletAddress, count) => {
    const res = await axios.get(`${API_URL}/orders/recent`,
        {
            params: {walletAddress, count}
        }
    );
    return res.data
}