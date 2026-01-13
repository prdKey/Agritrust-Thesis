import React from "react";
import { Route } from "react-router-dom";
import Seller from "../pages/seller/Seller.jsx";

export default function SellerRoute() {
  return (
    <>

        <Route index element={<div>Home</div>} /> {/* /seller */}
        <Route path="dashboard" element={<div>Dashboard</div>} />
        <Route path="profile" element={<div>Profile</div>} />
        <Route path="setting" element={<div>Setting</div>} />
        <Route path="purchase" element={<div>Purchase</div>} />
        <Route path="notifications" element={<div>Notifications</div>} />

    </>
  );
}
