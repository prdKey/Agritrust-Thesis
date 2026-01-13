import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";

const Seller = () => {
  return (
    <div className="flex h-full p-6">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content (nested routes render here) */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Seller;
