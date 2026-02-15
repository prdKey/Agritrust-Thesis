

export default function Settings() {
  return (
    <div className="h-full rounded-lg bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 ">Settings</h1>
     

      {/* Logout Button */}
      <button
        
        className="cursor-pointer w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}


