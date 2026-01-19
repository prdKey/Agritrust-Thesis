import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const {logout} = useAuth();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>

     

      {/* Logout Button */}
      <button
        onClick={logout}
        className="cursor-pointer w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}


