import { useState } from "react";
import {registerWithWallet } from "../../../shared/auth/authService.js";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

export default function Register() {
    
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

        const data = await registerWithWallet(address, formData.firstName, formData.lastName, formData.email, formData.phone, formData.gender, formData.dob);
        alert(data.message)
        } catch (err) {
        alert("Registration failed: " + err.response.data.message);
        } finally {
        setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        connectWalletAndLogin()
    };
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-6">
    
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md"
      >
        <div className="flex justify-center mb-4">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                alt="MetaMask"
                className="h-16 w-16"
            />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome</h1>
        <p className="text-gray-500 mb-6 text-center">
            Register your wallet to continue.
        </p>

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">First Name</label>
          <div className="flex items-center gap-2">
            <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            />
          </div>
          
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Last Name</label>
          <div className="flex items-center gap-2">
            <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            />
          </div>
          
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <div className="flex items-center gap-2">
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="example@email.com"
            required
            />
          </div>
          
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <div className="flex items-center gap-2">
            <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            pattern="^09\d{9}$"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="09XXXXXXXXX"
            required
            />
          </div>
          
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Gender</label>
          <div className="flex items-center gap-2">
            <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="cursor-pointer flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            </select>
          </div>
          
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
          <div className="flex items-center gap-2">
            <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="cursor-pointer flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
            />
          </div>
          
        </div>

        {/* Submit Button */}
        <div className="w-full flex justify-center">
            <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
            {loading ? "Registering..." : "Register Wallet"}
            </button>
        </div>
        <div className="flex justify-center mt-2">
            <Link
                to="/login"
                className="text-xs text-gray-400 font-light cursor-pointer hover:underline transition-colors hover:text-green-600"
            >
                Already have an account? Connect your wallet
            </Link>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">
          By continuing, you agree to our Terms & Conditions
        </p>
      </form>
    </div>
  )
}
