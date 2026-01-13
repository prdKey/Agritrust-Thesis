import ProfileTab from "./Profile";
import AddressTab from "./Address";
import {NavLink, Outlet } from "react-router-dom";

const MyAccount = () => {

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b mb-6">
        {["profile", "address"].map((tab) => (
          <NavLink
            key={tab}
            to={tab}
            className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors
                ${isActive ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                cursor-pointer
            `
            }
            >
            <span>{tab}</span>
            </NavLink>
        ))}
      </div>

        {/* Tab Content */}
        <main className="flex-1 bg-gray-100 overflow-auto">
            <Outlet />
        </main>

    </div>
  );
};

export default MyAccount;
