import React, { useEffect, useState } from "react";
import { getOrdersByBuyer, confirmReceipt } from "../../services/orderService.js";
import { useUserContext } from "../../context/UserContext.jsx";

const STATUS = [
  { id: "all", label: "All" },
  { id: 1, label: "Pending" },
  { id: 2, label: "Shipped" },
  { id: 3, label: "Out for delivery" },
  { id: 4, label: "Delivered" },
  { id: 5, label: "Completed" },
];

export default function Orders() {
  const { user } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const res = await getOrdersByBuyer();
        setOrders(res.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleConfirmReceipt = async (orderId) => {
    const ok = window.confirm("Confirm that you received this order?");
    if (!ok) return;

    try {
      await confirmReceipt(orderId);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 5 } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to confirm receipt");
    }
  };

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  if (loading) return <div className="p-4">Loading orders...</div>;
  if (!orders.length) return <div className="p-4">No orders yet.</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen space-y-4">
      <h1 className="text-xl font-bold mb-2 text-green-800">My Orders</h1>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto mb-4">
        {STATUS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-green-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Cards */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4 space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold text-sm">Order #{order.id}</h2>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === 1
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === 2
                    ? "bg-blue-100 text-blue-800"
                    : order.status === 3
                    ? "bg-indigo-100 text-indigo-800"
                    : order.status === 4
                    ? "bg-green-100 text-green-800"
                    : order.status === 5
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status === 1
                  ? "PENDING"
                  : order.status === 2
                  ? "SHIPPED"
                  : order.status === 3
                  ? "OUT FOR DELIVERY"
                  : order.status === 4
                  ? "DELIVERED"
                  : order.status === 5
                  ? "COMPLETED"
                  : "UNKNOWN"}
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Product:</span> {order.name}
              </p>
              <p>
                <span className="font-medium">Seller:</span>{" "}
                <span className="truncate max-w-50">{order.sellerAddress}</span>
              </p>
              <p>
                <span className="font-medium">Logistic:</span>{" "}
                <span className="truncate max-w-50">
                  {order.logisticsAddress === "0x0000000000000000000000000000000000000000"
                    ? "Not assigned"
                    : order.logisticsAddress}
                </span>
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {order.quantity}
              </p>
              <p>
                <span className="font-medium">Total Price:</span> {order.totalPrice} AGT
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              {order.status === 4 && (
                <button
                  onClick={() => handleConfirmReceipt(order.id)}
                  className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-500"
                >
                  Confirm Receipt
                </button>
              )}
              {order.status === 1 && (
                <button className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-500">
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="text-gray-500 text-center p-4">No orders in this tab.</div>
        )}
      </div>
    </div>
  );
}
