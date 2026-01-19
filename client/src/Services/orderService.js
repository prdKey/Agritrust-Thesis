import axios from "axios";



const API_URL = "http://localhost:3001/api";
    
export const getRecentBuyerOrders = async (walletAddress, count) => {
    const res = await axios.get(`${API_URL}/orders/recent`,
        {
            params: {walletAddress, count}
        }
    );
    return res.data
}