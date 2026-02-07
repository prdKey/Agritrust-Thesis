import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { getAvailableOrders, acceptOrder } from "../../services/orderService.js";

export default function LogisticAvailableOrders() {
  const { user } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const data = await getAvailableOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch available orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleAcceptOrder = async (orderId) => {
    await acceptOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  if (loading) return <div className="p-6">Loading available orders...</div>;
  if (!orders.length) return <div className="p-6">No available orders.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Available Orders</h1>

      {/* Grid for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
            {/* Order header */}
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-sm truncate">Order #{order.id}</h2>
            </div>

            {/* Order details */}
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Product:</span> {order.name}
              </p>
              <p>
                <span className="font-medium">Seller:</span>{" "}
                <span className="block truncate w-full">{order.sellerAddress}</span>
              </p>
              <p>
                <span className="font-medium">Buyer:</span>{" "}
                <span className="block truncate w-full">{order.buyerAddress}</span>
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {order.quantity}
              </p>
              <p>
                <span className="font-medium">Total Price:</span> {order.totalPrice} AGT
              </p>
            </div>

            {/* Action button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleAcceptOrder(order.id)}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-500 w-full sm:w-auto"
              >
                Accept Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
