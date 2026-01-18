// shared/auth/authService.js

import axios from "axios";
import { saveToken, removeToken} from "./tokenService";

const API = "http://localhost:3001/api";

export const loginWithWallet = async (walletAddress) => {
  const res = await axios.post(`${API}/auth/wallet-login`, { walletAddress });
  return res.data.nonce;         
};

export const verifySignature = async (walletAddress, signature) => {
    const res = await axios.post(`${API}/auth/verify`, { walletAddress, signature });
    saveToken(res.data.token);  
    return res.data;
}

export const registerWithWallet = async (walletAddress = "", firstName = "", lastName = "", email = "prado@gmail.com", mobileNumber = "0687688") => {
  const res = await axios.post(`${API}/auth/wallet-register`, { walletAddress, firstName, lastName, email, mobileNumber });
  return res.data.nonce;
};

export const logout = () => {
  removeToken();
};
