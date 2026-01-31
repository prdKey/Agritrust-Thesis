import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";

export default function SellerPanel() {

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path:"dashboard"},
    { name: "Products", icon: Package, path:"products" },
    { name: "Orders", icon: ShoppingCart, path:"orders" },
    { name: "Analytics", icon: BarChart3, path:"analytics" },
    { name: "Settings", icon: Settings, path:"" },
  ];

  return (
    <div className="w-full mt-0 md:mt-6 mx-auto ">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar menuItems={menu}/>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet/>
        </main>
      </div>
    </div>

    

  );
}

