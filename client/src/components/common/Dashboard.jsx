import DashboardCard from "./DashboardCard.jsx";
import RecentCard from "./RecentCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState} from "react";
import {getRecentBuyerOrders} from "../../Services/orderService.js"

const Dashboard = () => {
  const {user} = useAuth()
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try{
        const data = await getRecentBuyerOrders(user.walletAddress, 5)
        setRecentOrders(data.orders)
      }catch(err)
      {
        console.error("Failed to fetch products:", err);
      }finally{
        setLoading(false)
      }
    }

    fetchRecentOrders();

  }, [user]);


  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Orders"
          value={user.totalOrders}
          description="All purchases you have made on the marketplace"
          icon="🌾"
          bg="bg-green-600"
        />

        <DashboardCard
          title="Active Orders"
          value={user.activeOrders}
          description="Orders currently being processed or shipped"
          icon="📦"
          bg="bg-blue-600"
        />

        <DashboardCard
          title="AGT Spent"
          value={user.agtSpent}
          description="Total AGT tokens spent on completed purchases"
          icon="💰"
          bg="bg-emerald-600"
        />
      </div>

      {/* Bottom Recent Activity Card */}
      <RecentCard
        title="Recent Orders"
        items={recentOrders}
      />
    </div>
  );
};

export default Dashboard;
