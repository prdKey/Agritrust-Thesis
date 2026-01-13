const ProfileTab = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="input"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="input"
        />
        <input
          type="text"
          placeholder="Wallet Address"
          disabled
          className="input bg-gray-100 cursor-not-allowed"
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="input"
        />
      </div>

      <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded">
        Save Changes
      </button>
    </div>
  );
};

export default ProfileTab;
