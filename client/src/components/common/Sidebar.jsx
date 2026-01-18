import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null); // which main menu is open

  const menus = [
    {
      title: "My Account",
      links: [
        { name: "Profile", path: "profile" },
        { name: "Banks & Cards", path: "banks-cards" },
        { name: "Addresses", path: "addresses" },
      ],
    },
    {
      title: "My Purchase",
      links: [
        { name: "All", path: "/purchase/all" },
        { name: "To Pay", path: "/purchase/to-pay" },
        { name: "To Ship", path: "/purchase/to-ship" },
        { name: "To Receive", path: "/purchase/to-receive" },
        { name: "Completed", path: "/purchase/completed" },
        { name: "Cancelled", path: "/purchase/cancelled" },
        { name: "Return / Refund", path: "/purchase/return-refund" },
      ],
    },
    {
      title: "Notifications",
      links: [{ name: "Notification Settings", path: "/notifications" }],
    },
    {
      title: "Settings",
      links: [
        { name: "Change Password", path: "/change-password" },
        { name: "Privacy Settings", path: "/privacy-settings" },
      ],
    },
  ];

  const toggleMenu = (title) => {
    if (openMenu === title) setOpenMenu(null);
    else setOpenMenu(title);
  };

  return (
    <div className="w-full md:w-1/4 bg-green-50 p-4 rounded-lg space-y-2">
      {menus.map((menu) => (
        <div key={menu.title}>
          {/* Main header */}
          <div
            className="flex justify-between items-center font-semibold text-green-700 cursor-pointer p-2 hover:bg-green-100 rounded"
            onClick={() => toggleMenu(menu.title)}
          >
            {menu.title}
          </div>

          {/* Sub-items */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openMenu === menu.title ? "max-h-80 mt-2" : "max-h-0"
            }`}
          >
            <ul className="space-y-1 text-gray-700 pl-4">
              {menu.links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="block cursor-pointer hover:text-green-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
