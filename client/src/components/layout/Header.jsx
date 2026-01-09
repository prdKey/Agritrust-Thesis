import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function Header() {
  const [walletAddress, setWalletAddress] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // Step 1: Get nonce
      const nonceRes = await axios.post("http://localhost:3001/auth/nonce", {
        walletAddress: address,
      });

      const nonce = nonceRes.data.nonce;

      // Step 2: Sign nonce
      const signature = await signer.signMessage(`Login nonce: ${nonce}`);

      // Step 3: Verify signature
      const verifyRes = await axios.post("http://localhost:3001/auth/verify", {
        walletAddress: address,
        signature,
      });

      if (verifyRes.data.token) {
        // Store JWT in localStorage
        localStorage.setItem("jwtToken", verifyRes.data.token);
        setLoggedIn(true);
        alert("Logged in successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <nav className="min-w-screen bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">AgriTrust</h1>
          <ul className="flex space-x-6 text-gray-700 font-medium">
            <button onClick={connectWallet} className="bg-green-600 text-white py-1 px-3 rounded-2xl hover:bg-green-700">Connect Wallet</button>
          </ul>
        </div>
      </nav>
    </header>
  );
}
