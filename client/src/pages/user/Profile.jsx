import { useState } from 'react';
import { useUserContext } from "../../context/UserContext.jsx";
import { User, Mail, Phone, Calendar, MapPin, Wallet, Camera, Edit2, X, Save } from "lucide-react";

export default function Profile() {
  const { user } = useUserContext();

  // Form state
  const [form, setForm] = useState({
    walletAddress: user?.walletAddress || "",
    firstName: user?.firstName || "",
    middleName: user?.middleName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth || "",
    address: user?.address || {
      houseNumber: "",
      street: "",
      barangay: "",
      city: "",
      postalCode: ""
    },
    profileImage: null,
  });

  const [backup, setBackup] = useState({ ...form });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, profileImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => {
    setBackup({ ...form });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({ ...backup });
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: Call API to update profile
    alert("Profile saved!");
    setIsEditing(false);
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    const { houseNumber, street, barangay, city, postalCode } = address;
    return `#${houseNumber} ${street}, ${barangay}, ${city}, ${postalCode}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          {/* Profile Picture Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera size={20} className="text-green-600" />
              Profile Picture
            </h2>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={imagePreview || (user?.profileImage ? user.profileImage : "https://upload.wikimedia.org/wikipedia/commons/7/7c/User_icon_2.svg")}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-4 border-green-500 object-cover shadow-lg"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-green-600 p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors shadow-lg">
                    <Camera size={18} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <h3 className="mt-4 text-xl font-bold text-gray-900">
                {form.firstName} {form.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user?.role || "User"}</p>
              
              {isEditing && (
                <p className="text-xs text-gray-400 text-center mt-4">
                  Click the camera icon to upload a new photo
                  <br />
                  Max size: 1MB • Format: JPEG, PNG
                </p>
              )}
            </div>
          </div>

          {/* Wallet Info Card */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Wallet size={20} className="text-green-600" />
              Blockchain Wallet
            </h2>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Wallet Address</p>
              <p className="font-mono text-sm text-gray-900 break-all">
                {form.walletAddress}
              </p>
            </div>
            
            <p className="text-xs text-gray-500 mt-3 flex items-start gap-2">
              <span className="text-yellow-600">⚠️</span>
              <span>Your wallet address cannot be changed. It's permanently linked to your account.</span>
            </p>
          </div>
        </div>

        {/* Right Column - Personal Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Personal Information
            </h2>

            <div className="space-y-6">
              {/* Name Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={form.middleName}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={form.mobileNumber}
                    disabled={!isEditing}
                    onChange={handleChange}
                    placeholder="09XXXXXXXXX"
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    disabled={!isEditing}
                    onChange={handleChange}
                    className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <div className="flex items-center gap-6 pt-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          disabled={!isEditing}
                          checked={form.gender === g}
                          onChange={handleChange}
                          className="w-4 h-4 accent-green-600 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <span className={`text-sm ${!isEditing ? 'text-gray-600' : 'text-gray-900'}`}>
                          {g}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-purple-600" />
                  Address Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      House Number
                    </label>
                    <input
                      type="text"
                      name="houseNumber"
                      value={form.address.houseNumber}
                      disabled={!isEditing}
                      onChange={handleAddressChange}
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={form.address.street}
                      disabled={!isEditing}
                      onChange={handleAddressChange}
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Barangay
                    </label>
                    <input
                      type="text"
                      name="barangay"
                      value={form.address.barangay}
                      disabled={!isEditing}
                      onChange={handleAddressChange}
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.address.city}
                      disabled={!isEditing}
                      onChange={handleAddressChange}
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={form.address.postalCode}
                      disabled={!isEditing}
                      onChange={handleAddressChange}
                      className={`w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        !isEditing ? "bg-gray-100 cursor-not-allowed text-gray-600" : ""
                      }`}
                    />
                  </div>
                </div>

                {!isEditing && form.address && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Complete Address:</p>
                    <p className="text-sm text-gray-600">{formatAddress(form.address)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}