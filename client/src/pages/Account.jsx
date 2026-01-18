// AccountPage.jsx
import Sidebar  from "../components/common/Sidebar.jsx";
import { Outlet } from "react-router-dom";

function Account() {
  

  return (
      <div className="w-full m-6 mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-green-600">My Profile</h1>
        <p className="text-gray-500 mb-4">Manage and protect your account</p>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar/>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
            <Outlet/>
          </div>
        </div>
      </div>
  );
}

export default Account;
