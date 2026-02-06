import { useState } from "react";
import ConnectButton from "../components/common/connectButton";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
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

  // Check if all fields are filled
  const isFormComplete = Object.values(formData).every((v) => v.trim() !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        onClick={() => navigate("/")}
        className="absolute inset-0 bg-black/50"
      />

      {/* Modal */}
      <div className="relative z-60 bg-white shadow-xl rounded-lg w-full max-w-md max-h-[80vh] p-6">
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

        <form>
          <div className="overflow-y-auto max-h-[40vh] p-2 space-y-3">
            {/* Input fields */}
            <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
            <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} pattern="^09\d{9}$" />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
            <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
          </div>

          {/* Connect Button */}
          <div className="flex flex-col justify-center mt-5 space-y-2">
            <ConnectButton
              text="Register Wallet"
              email={formData.email}
              dob={formData.dob}
              firstName={formData.firstName}
              lastName={formData.lastName}
              phone={formData.phone}
              gender={formData.gender}
              disabled={!isFormComplete} // Disable if empty
            />

            <p
              onClick={() => navigate("/login")}
              className="text-xs text-gray-400 font-light text-center hover:underline hover:text-green-600 cursor-pointer"
            >
              Already have an account? Connect your wallet
            </p>

            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms & Conditions
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reusable Input Field Component
function InputField({ label, name, type = "text", value, onChange, pattern }) {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        pattern={pattern}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      />
    </div>
  );
}

// Reusable Select Field Component
function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={name} className="block text-gray-700 font-medium mb-1">{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        required
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
