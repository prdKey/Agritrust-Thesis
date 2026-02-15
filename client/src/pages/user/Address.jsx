import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext.jsx";
import { getPangasinanCities, getBarangaysByCity } from "../../services/addressService.js";

export default function AddressForm() {
  const { user } = useUserContext();

  const [form, setForm] = useState({
    houseNumber: user?.address?.houseNumber || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    barangay: user?.address?.barangay || "",
    postalCode: user?.address?.postalCode || "",
  });

  const [backup, setBackup] = useState({ ...form });
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await getPangasinanCities();
        setCities(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error(err);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    const loadBarangays = async () => {
      if (!form.city) return;
      const selectedCity = cities.find((c) => c.name === form.city);
      if (!selectedCity) return;
      try {
        const res = await getBarangaysByCity(selectedCity.code);
        setBarangays(res.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error(err);
      }
    };
    loadBarangays();
  }, [form.city, cities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 New logic: edit just switches mode
  const handleEdit = () => {
    setBackup({ ...form }); // save current values
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm({ ...backup }); // restore previous values
    setIsEditing(false);
  };

  // 🔹 Save function called directly, not through form submit
  const handleSave = () => {
    // TODO: call API to save
    alert("Address saved!");
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg space-y-6">
        <h1 className="text-3xl font-bold mb-6 ">My Address</h1>
      {/* House / Unit Number */}
      <input
        type="text"
        name="houseNumber"
        value={form.houseNumber}
        onChange={handleChange}
        disabled={!isEditing}
        className={`w-full border  border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          !isEditing ? "bg-gray-200 cursor-not-allowed  text-gray-400" : " text-black"
        }`}
        placeholder="House Number"
      />

      {/* Street */}
      <input
        type="text"
        name="street"
        value={form.street}
        onChange={handleChange}
        disabled={!isEditing}
        className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          !isEditing ? "bg-gray-200 cursor-not-allowed  text-gray-400" : " text-black"
        }`}
        placeholder="Street"
      />

      {/* City */}
      <select
        name="city"
        value={form.city}
        onChange={(e) => {
          handleChange(e);
          setForm((prev) => ({ ...prev, barangay: "" }));
        }}
        disabled={!isEditing}
        className={`w-full border  border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          !isEditing ? "bg-gray-200 cursor-not-allowed  text-gray-400" : " text-black"
        }`}
      >
        <option disabled={true}  value="">Select City</option>
        {cities.map((c) => (
          <option key={c.code} value={c.name}>{c.name}</option>
        ))}
      </select>

      {/* Barangay */}
      <select
        name="barangay"
        value={form.barangay}
        onChange={handleChange}
        disabled={!isEditing || !form.city}
        className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          !isEditing ? "bg-gray-200 cursor-not-allowed  text-gray-400" : " text-black"
        }`}
      >
        <option disabled={true} value="">Select Barangay</option>
        {barangays.map((b) => (
          <option key={b.code} value={b.name}>{b.name}</option>
        ))}
      </select>

      {/* Postal Code */}
      <input
        type="text"
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        disabled={!isEditing}
        className={`w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          !isEditing ? "bg-gray-200 cursor-not-allowed  text-gray-400" : " text-black"
        }`}
        placeholder="Postal Code"
      />

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
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
              type="button" // 🔹 Save is now also type="button"
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
