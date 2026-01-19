import {useState, useEffect} from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { FaHome, FaUser, FaBox, FaShoppingCart, FaBell, FaCog } from "react-icons/fa";


export default function Sidebar() {
  const [active, setActive] = useState("Dashboard")
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> , path: "dashboard"},
    { name: "Profile", icon: <FaUser /> , path: "profile"},
    { name: "My Purchase", icon: <FaShoppingCart />, path: "purchase" },
    { name: "Notifications", icon: <FaBell /> , path: "notifications"},
    { name: "Settings", icon: <FaCog /> , path: "settings"},
  ];

  useEffect(()=>{
    if (location.pathname === "/user") {
      setActive("Dashboard");
    }
  },[location.pathname])

  return (
    <div className="w-full md:w-64 bg-white shadow-md p-4 rounded-lg space-y-2">
      {menuItems.map((item) => (
        <div
          onClick={() => {
            setActive(item.name)
            navigate(item.path)
          }}
          key={item.name}
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
            active === item.name ? "bg-green-500 text-white" : "text-gray-700 hover:bg-gray-100"
          }`}
        >
     
          <span>{item.icon}</span>
          <span className="font-medium">{item.name}</span>
        </div>
      ))}
    </div>
  );
}
