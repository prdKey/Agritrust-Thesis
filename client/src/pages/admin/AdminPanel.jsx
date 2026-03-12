import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  AlertTriangle,
  Settings
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar.jsx";

export default function AdminPanel() {

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
    { name: "User Management", icon: Users, path: "users" },
    { name: "Applications", icon: Users, path: "applications" }, 
    { name: "Product Management", icon: Package, path: "products" },
    { name: "Orders", icon: ShoppingCart, path: "orders" },
    { name: "Disputes", icon: AlertTriangle, path: "disputes" },
    { name: "Reports & Analytics", icon: BarChart3, path: "reports" },
    { name: "Settings", icon: Settings, path: "settings" },
  ];

  return (
    <div className="w-full flex mt-0 md:mt-6 mx-auto">
      <div className="w-full flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <Sidebar 
          menuItems={menu} 
          title={"Admin Panel"} 
        />

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
}