import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { Package, ShoppingCart, Coins, BarChart3} from "lucide-react";
import MetricCard from "../../components/common/MetricCard";
import { useEffect, useState } from "react";
import { getSellerStats } from "../../services/statsService";
import { useAuth } from "../../context/AuthContext";

const barData = [
  { name: "Product A", sales: 400 },
  { name: "Product B", sales: 300 },
  { name: "Product C", sales: 500 },
];

const COLORS = ["#3b82f6", "#22c55e", "#ef4444"];

export default function SellersDashboard() {
  const {user} = useAuth();
  const [stats, setStats] = useState({});

  useEffect(() =>
    {
      const fetchData = async () => {
        const data = await getSellerStats(user.walletAddress)
        setStats(data.stats)
      };

      fetchData();
    }, [user.walletAddress]);

  return (
    <div className="min-h-screen rounded-lg bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard title={"Products"} value={stats.totalProducts} icon={Package} color={"bg-blue-500"}/>
        <MetricCard title={"Sales"} value={stats.totalRevenue} icon={Coins} color={"bg-green-500"}/>
        <MetricCard title={"Orders"} value={stats.completedOrders} icon={ShoppingCart} color={"bg-purple-500"}/>
        <MetricCard title={"Performance"} value={"65%"} icon={BarChart3} color={"bg-red-500"}/>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-2xl shadow h-80">
          <h3 className="text-gray-700 font-semibold mb-4">Sales by Product</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
