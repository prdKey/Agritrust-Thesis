import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, Bell} from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";

export default function SellerPanel() {

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path:"dashboard"},
    { name: "Seller Products", icon: Package, path:"products" },
    { name: "Orders Received", icon: ShoppingCart, path:"orders" },
    { name: "Notifications", icon:  Bell, path: "notifications"},
    { name: "Analytics", icon: BarChart3, path:"analytics" },
    { name: "Settings", icon: Settings, path:"" },
  ];

  return (
    <div className="w-full flex mt-0 md:mt-6 mx-auto ">
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Sidebar menuItems={menu} title={"Seller Panel"}/>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet/>
        </main>
      </div>
    </div>

    

  );
}

