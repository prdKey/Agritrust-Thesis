import DashboardCard from "../../components/common/DashboardCard.jsx";

import { useUserContext } from "../../context/UserContext.jsx";

const Dashboard = () => {
  const {user} = useUserContext();

  if (!user) return null; // prevent render

  return (
    <div className="h-full rounded-lg bg-gray-100 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Orders"
          value={user.totalOrders ?? 0}
          description="All purchases you have made on the marketplace"
          icon="🌾"
          bg="bg-green-600"
        />

        <DashboardCard
          title="Active Orders"
          value={user.activeOrders ?? 0}
          description="Orders currently being processed or shipped"
          icon="📦"
          bg="bg-blue-600"
        />

        <DashboardCard
          title="AGT Spent"
          value={user.agtSpent ?? 0}
          description="Total AGT tokens spent on completed purchases"
          icon="💰"
          bg="bg-emerald-600"
        />
      </div>

      
    </div>
  );
};

export default Dashboard;
