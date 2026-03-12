import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";
import UpdateLocation from "./UpdateLocation.jsx";

export default function SellerPanel() {

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path:"dashboard"},
    { name: "Available Orders", icon: Package, path:"available-orders" },
    { name: "Orders To Deliver", icon: ShoppingCart, path:"orders" },
    { name: "Analytics", icon: BarChart3, path:"analytics" },
    { name: "Settings", icon: Settings, path:"settings" },
  ];

  return (
    <div className="w-full flex mt-0 md:mt-6 mx-auto ">
         <UpdateLocation/>
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar menuItems={menu} title={"Logistic Panel"}/>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet/>
        </main>
      </div>
    </div>
  );
}

