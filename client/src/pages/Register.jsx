import { useState } from "react";
import { registerWithWallet } from "../auth/authService.js";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const connectWalletAndLogin = async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");
    setLoading(true);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const data = await registerWithWallet(
        address,
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.gender,
        formData.dob
      );
      alert(data.message);
    } catch (err) {
      alert("Registration failed: " + (err?.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    connectWalletAndLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div onClick={()=> navigate("/")} className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div  className="relative z-50 bg-white shadow-xl rounded-lg w-full max-w-md max-h-[80vh] p-6">
         {/* Header */}
        <div className="flex flex-col justify-center items-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt="MetaMask"
            className="h-16 w-16"
          />
          <h1 className="text-2xl font-bold mb-2 text-center">Welcome</h1>
          <p className="text-gray-500 text-center">
            Register your wallet to continue.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
        >
          {/* Input Fields*/}
          <div className="overflow-y-auto max-h-[40vh] scroll p-2">
            {/* First Name */}
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Last Name */}
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="example@email.com"
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="^09\d{9}$"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="09XXXXXXXXX"
                required
              />
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="mb-3">
              <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex flex-col justify-center mt-5">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              {loading ? "Registering..." : "Register Wallet"}
            </button>
            <p  
              onClick={() => navigate("/login")}
              className="text-xs text-gray-400 font-light text-center m-2 hover:underline hover:text-green-600 cursor-pointer"
            >
              Already have an account? Connect your wallet
            </p>
            <p className="text-xs text-gray-400 mt-2 text-center">
              By continuing, you agree to our Terms & Conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
