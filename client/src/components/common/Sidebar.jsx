import { useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { X, Menu, LogOut} from "lucide-react";
import { useEffect } from "react";
import { useUserContext } from "@/context/UserContext";

export default function Sidebar({ menuItems, title}) {
  const {logout} = useUserContext(); 
  const location = useLocation();
  const locationTrim = location.pathname.split("/")
  const path = locationTrim[2] || "dashboard";
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false); // Mobile menu state
  const navigate = useNavigate();
  useEffect(()=>
  {
    setActive(path)
  },[path])



  return (
    <>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-15 left-0 z-1 h-165 rounded-lg bg-white shadow-lg transition-transform duration-300 p-4
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-64 w-64`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-green-600">{title}</h1>
          <button
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-150">
          {/* Menu Items */}
          <div className="flex flex-col mt-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActive(item.path);
                  navigate(item.path);
                  setOpen(false); // Close sidebar on mobile after navigation
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer w-full text-left transition-colors duration-200
                  ${active === item.path
                    ? "bg-green-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
          <button onClick={logout} className="cursor-pointer mt-auto p-2 bg-red-200 font-bold flex items-center gap-2 text-red-500 rounded-lg text-left"><LogOut/>Logout</button>
        </div>
      </aside>

      {/* Mobile menu button */}
  
      <div className="flex h-15 w-full items-center gap-3 p-4 bg-white shadow md:hidden">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="font-semibold">Dashboard</h2>
      </div>
    
    </>
  );
}
