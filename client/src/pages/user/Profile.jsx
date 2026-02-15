import { useState } from 'react';
import { useUserContext } from "../../context/UserContext.jsx";

export default function Profile() {
  const { user } = useUserContext();

  // 🔹 Form state
  const [form, setForm] = useState({
    walletAddress: user.walletAddress,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    dob: user.dob,
    profileImage: null, // store selected file
  });

  const [backup, setBackup] = useState({ ...form });
  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, profileImage: file }));
  };

  // 🔹 Edit / Cancel / Save logic
  const handleEdit = () => {
    setBackup({ ...form }); // save current values
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({ ...backup }); // restore previous values
    setIsEditing(false);
  };

  const handleSave = () => {
    // TODO: replace with API call
    alert("Profile saved!");
    setIsEditing(false);
  };

  return (
    <div className="h-screen bg-gray-100 p-6 rounded-lg  mx-auto">
      <h1 className="text-3xl font-bold mb-6 ">Profile</h1>
      {/* Profile Icon */}
      <div className="flex  mb-6">
        <img
          src={form.profileImage ? URL.createObjectURL(form.profileImage) : "https://upload.wikimedia.org/wikipedia/commons/7/7c/User_icon_2.svg"}
          alt="Profile Icon"
          className="h-20 w-20 rounded-full border-2 border-green-500 object-cover"
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-4 overflow-auto">

        {/* Wallet Address */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Wallet Address</label>
          <input
            type="text"
            name="walletAddress"
            value={form.walletAddress}
            disabled
            className="w-full border text-gray-400 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <p className="text-gray-400 text-sm mt-1">Wallet address can't be changed.</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
              !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
              !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            disabled={!isEditing}
            onChange={handleChange}
            pattern="^(09|\+639)\d{9}$"
            placeholder="09XXXXXXXXX"
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
              !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Gender</label>
          <div className="flex items-center gap-4">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  disabled={!isEditing}
                  checked={form.gender === g}
                  onChange={handleChange}
                  className="accent-green-500"
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            disabled={!isEditing}
            onChange={handleChange}
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
              !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            disabled={!isEditing}
            onChange={handleImageChange}
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
              !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
          <p className="text-gray-400 text-sm mt-1">
            File size: maximum 1 MB. File extension: .JPEG, .PNG
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-6 ">
        {!isEditing ? (
          <button
            type="button"
            onClick={handleEdit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
