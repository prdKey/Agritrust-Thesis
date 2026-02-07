// pages/buyer/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import MetricCard from "../../components/common/MetricCard";
import { ShoppingCart, Clock, CheckCircle, Package } from "lucide-react";
import { useUserContext } from "../../context/UserContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getOrdersByBuyer } from "../../services/orderService.js";

export default function Dashboard() {
  const { user } = useUserContext();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shipped: 0,
    completed: 0,
  });
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const res = await getOrdersByBuyer();
        const orders = res.orders || [];

        // Calculate stats
        const total = orders.length;
        const pending = orders.filter((o) => o.status === 1).length;
        const shipped = orders.filter((o) => o.status === 2 || o.status === 3 || o.status === 4).length;
        const completed = orders.filter((o) => o.status === 5).length;

        setStats({ total, pending, shipped, completed });

        // Prepare bar chart by product
        const productMap = {};
        orders.forEach((o) => {
          if (!productMap[o.name]) productMap[o.name] = 0;
          productMap[o.name] += 1;
        });

        const chartData = Object.entries(productMap).map(([name, count]) => ({
          name,
          orders: count,
        }));

        setBarData(chartData);
      } catch (err) {
        console.error("Failed to fetch buyer orders:", err);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="min-h-screen rounded-lg bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 ">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total Orders"
          value={stats.total}
          icon={ShoppingCart}
          color="bg-green-600"
        />
        <MetricCard
          title="Pending Orders"
          value={stats.pending}
          icon={Clock}
          color="bg-yellow-500"
        />
        <MetricCard
          title="Shipped Orders"
          value={stats.shipped}
          icon={Package}
          color="bg-blue-500"
        />
        <MetricCard
          title="Completed Orders"
          value={stats.completed}
          icon={CheckCircle}
          color="bg-gray-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-2xl shadow h-80">
          <h3 className="text-gray-700 font-semibold mb-4">Orders by Product</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#16a34a" /> {/* green-600 */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Optional: You can add more charts here */}
      </div>
    </div>
  );
}
