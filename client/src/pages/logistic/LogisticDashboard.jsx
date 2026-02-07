// pages/logistics/LogisticsDashboard.jsx
import React, { useEffect, useState } from "react";
import MetricCard from "../../components/common/MetricCard";
import { Truck, Package, Clock, CheckCircle } from "lucide-react";
import { useUserContext } from "../../context/UserContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const sampleBarData = [
  { name: "Product A", deliveries: 12 },
  { name: "Product B", deliveries: 8 },
  { name: "Product C", deliveries: 20 },
];

export default function LogisticsDashboard() {
  const { user } = useUserContext();
  const [stats, setStats] = useState({});
  const [barData, setBarData] = useState(sampleBarData);

  

  return (
    <div className="min-h-screen rounded-lg bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Logistics Dashboard</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title={"Assigned Deliveries"}
          value={stats.assigned || 0}
          icon={Truck}
          color={"bg-blue-500"}
        />
        <MetricCard
          title={"Pending Pickups"}
          value={stats.pendingPickup || 0}
          icon={Clock}
          color={"bg-yellow-500"}
        />
        <MetricCard
          title={"Completed Deliveries"}
          value={stats.completed || 0}
          icon={CheckCircle}
          color={"bg-green-500"}
        />
        <MetricCard
          title={"In Transit"}
          value={stats.inTransit || 0}
          icon={Package}
          color={"bg-purple-500"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-2xl shadow h-80">
          <h3 className="text-gray-700 font-semibold mb-4">Deliveries by Product</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
