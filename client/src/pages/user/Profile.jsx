import { useState } from 'react';
import { useUserContext } from "../../context/UserContext.jsx";

export default function Profile() {

  const { user } = useUserContext();

  // ✅ Always call hooks, provide safe defaults
  const [username, setUsername] = useState(user.walletAddress);
  const [name, setName] = useState(`${user.firstName} ${user.lastName}`)
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [gender, setGender] = useState(user.gender);
  const [dob, setDob] = useState(user.dob);
  

  const handleSave = (e) => {
    e.preventDefault();
    alert("Profile saved!");
  };
  return (
    <>
      <form onSubmit={handleSave} className="h-full rounded-lg bg-gray-100 p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Wallet Address</label>
                <input
                  type="text"
                  disabled={true}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border text-gray-400 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <p className="text-gray-400 text-sm mt-1">Wallet address can't be changed.</p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
                <div className="flex items-center gap-2">
                  <input
                    type="tel"
                    value={phone}
                    pattern="^09\d{9}$"
                    placeholder="09XXXXXXXXX"
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Gender</label>
                <div className="flex items-center gap-4">
                  {["Male", "Female", "Other"].map((g) => (
                    <label key={g} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={(e) => setGender(e.target.value)}
                        className="accent-green-500"
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <button type="button" className="text-green-600 font-medium hover:underline">
                    Change
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <p className="text-gray-400 text-sm mt-1">File size: maximum 1 MB. File extension: .JPEG, .PNG</p>
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save
              </button>
            </form>
    </>
  )
}
