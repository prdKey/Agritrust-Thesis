import DashboardCard from "./DashboardCard.jsx";
import RecentCard from "./RecentCard.jsx";

const SellerDashboard = () => {
  const recentOrders = [
    { label: "Order #1021 – Rice", date: "Jan 12, 2026", status: "Completed" },
    { label: "Order #1020 – Corn", date: "Jan 11, 2026", status: "Pending" },
    { label: "Order #1019 – Wheat", date: "Jan 10, 2026", status: "Shipped" },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Products Listed"
          value="24"
          description="Total products you are selling"
          icon="🌾"
          bg="bg-green-600"
        />

        <DashboardCard
          title="Orders Received"
          value="18"
          description="Orders from buyers"
          icon="📦"
          bg="bg-blue-600"
        />

        <DashboardCard
          title="Total Earnings"
          value="1,250 AGT"
          description="Earnings from completed sales"
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

export default SellerDashboard;
