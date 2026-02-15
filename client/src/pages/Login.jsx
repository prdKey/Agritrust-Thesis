import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext.jsx";
import { getNonce, verifySignature } from "../services/authService.js";

export default function Login() {
  const { login, user } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 🔹 Connect MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return null;
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  };

  // 🔹 Handle Wallet Login
  const handleLogin = async () => {
    setLoading(true);
    try {
      const walletAddress = await connectWallet();
      if (!walletAddress) return;

      // Get nonce from server
      let nonce;
      try {
        nonce = await getNonce(walletAddress); // Axios request
      } catch (err) {
        // Properly read backend error message
        const message = err.response?.data?.message || err.message;
        alert(message); // <-- will show "Please register your wallet first!"
        return;
      }

      // Sign message
      const messageToSign = `Sign this message to authenticate: ${nonce}`;
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [messageToSign, walletAddress],
      });

      // Verify signature and get user
      const loggedInUser = await verifySignature(walletAddress, signature);
      login(loggedInUser);

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.log(err.data?.message || err.message);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Overlay */}
      <div
        onClick={() => navigate("/")}
        className="absolute inset-0 bg-black/50"
      />

      {/* Modal */}
      <div className="relative z-50 bg-white shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt="MetaMask"
            className="h-16 w-16"
          />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-500 mb-6">
          {user
            ? `Logged in as ${user.firstName}`
            : "Connect your wallet to continue."}
        </p>

        {/* Wallet Connect Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full p-2 rounded-lg text-white mb-4 transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Processing..." : user ? "Reconnect Wallet" : "Connect Wallet"}
        </button>

        {/* Register link */}
        <div className="flex justify-center mt-2">
          <p
            onClick={() => navigate("/register")}
            className="text-xs text-gray-400 font-light cursor-pointer hover:underline transition-colors hover:text-green-600"
          >
            New User? Register your wallet
          </p>
        </div>

        {/* Footer T&C */}
        <p className="text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  );
}
