import { createContext, useContext, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import {useAuth} from "./AuthContext.jsx";
const API_URL = "http://localhost:3001";


const WalletContext = createContext();


export const WalletProvider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const { loginWithJwt } = useAuth();


    const connectToWallet = async () => {
        if (!window.ethereum) return alert("MetaMask required");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        console.log("0");
        const nonceRes = await axios.post(
            `${API_URL}/auth/nonce`,
            { walletAddress: address },
        );

        const signature = await signer.signMessage(
            `AgriTrust Login: ${nonceRes.data.nonce}`,
            { walletAddress: address }
        );
        console.log("1");
        const loginRes = await axios.post(
            `${API_URL}/auth/verify`,
            { walletAddress: address, signature }
        );  
        console.log("2");
        const { token } = loginRes.data;

        loginWithJwt(token);

        console.log("Wallet connected:", address);

        setProvider(provider);
        setAccount(address);
    };


    return (
        <WalletContext.Provider value={{ account, provider, connectToWallet }}>
        {children}
        </WalletContext.Provider>
    );
};


export const useWallet = () => useContext(WalletContext);