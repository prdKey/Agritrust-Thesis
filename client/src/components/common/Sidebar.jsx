import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { name: "Dashboard", path: "/seller/dashboard", icon: "🏠" },
  { name: "My Accout", path: "/seller/account", icon: "👤" },
  { name: "My Purchase", path: "/seller/purchase", icon: "📦" },
  { name: "My Products", path: "/seller/products", icon: "🛒" },
  { name: "Notifications", path: "/seller/notifications", icon: "📋" },
  { name: "Settings", path: "/seller/setting", icon: "⚙️" },
];

const Sidebar = () => {

  return (
    <div className="w-64 rounded-lg bg-white shadow-md p-4 flex flex-col gap-2">
        {tabs.map((tab) => (
            <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors
                ${isActive ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                cursor-pointer
            `
            }
            >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.name}</span>
            </NavLink>
        ))}
    </div>
  );
};

export default Sidebar;
