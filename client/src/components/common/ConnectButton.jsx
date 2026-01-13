import { useState } from "react";
import { useWallet } from "../../context/WalletContext.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function WalletLogin() {
  const navigate = useNavigate();
  const { isAuthenticated, logout} = useAuth();
  const [loading, setLoading] = useState(false);
  const { connectToWallet } = useWallet();

  const handleClick = async () => {
    if (isAuthenticated) {
      logout();
    } else {
      try {
        setLoading(true);
        await connectToWallet();
        navigate("/market");
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      } finally {
        setLoading(false); 
      }
    };
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 rounded ${
        isAuthenticated ? "bg-red-600" : "bg-green-600"
      } text-white`}
    >
      {loading
        ? "Connecting..."
        : isAuthenticated
        ? "Disconnect Wallet"
        : "Connect Wallet"}
    </button>
  );
}
