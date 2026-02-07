import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { getOrdersByLogistics, pickupOrder, confirmDelivery } from "../../services/orderService.js";

export default function LogisticOrders() {
  const { user } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const orderStatus = [
    "None",
    "Paid",
    "Shipped",
    "Out for delivery",
    "Delivered",
    "Completed",
    "Disputed",
    "Refunded",
  ];

  // Only Pangasinan addresses (sample towns/cities)
  const pangasinanAddresses = [
    "Alaminos",
    "Agno",
    "Anda",
    "Asingan",
    "Balungao",
    "Bani",
    "Basista",
    "Bautista",
    "Bayambang",
    "Binalonan",
    "Binmaley",
    "Bolinao",
    "Bugallon",
    "Burgos",
    "Calasiao",
    "Dasol",
    "Infanta",
    "Labrador",
    "Laoac",
    "Lingayen",
    "Mabini",
    "Malasiqui",
    "Manaoag",
    "Mangaldan",
    "Mangatarem",
    "Mapandan",
    "Natividad",
    "Pozorrubio",
    "Rosales",
    "San Carlos",
    "San Fabian",
    "San Jacinto",
    "San Manuel",
    "San Nicolas",
    "San Quintin",
    "Santa Barbara",
    "Santa Maria",
    "Santo Tomas",
    "Sison",
    "Sual",
    "Tayug",
    "Umingan",
    "Urbiztondo",
    "Villasis",
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const data = await getOrdersByLogistics(user.walletAddress);
        // Add a field for selected location for each order
        const ordersWithLocation = (data.orders || []).map((o) => ({
          ...o,
          selectedLocation: "",
        }));
        setOrders(ordersWithLocation);
      } catch (err) {
        console.error("Failed to fetch logistics orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handlePickup = async (orderId, location) => {
    if (!location) return alert("Select a location first");
    await pickupOrder(orderId, user.walletAddress, location);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 3 } : o))
    );
  };

  const handleDeliver = async (orderId, location) => {
    if (!location) return alert("Select a location first");
    await confirmDelivery(orderId, user.walletAddress, location);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 4 } : o))
    );
  };

  if (loading) return <div className="p-6">Loading your orders...</div>;
  if (!orders.length) return <div className="p-6">No assigned orders.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <h1 className="text-2xl font-bold mb-4 text-green-800">My Logistics Orders</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-sm truncate">Order #{order.id}</h2>
              <span
                className={`px-2 py-1 text-xs rounded-full font-semibold ${
                  order.status === 3
                    ? "bg-blue-100 text-blue-800"
                    : order.status === 4
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {orderStatus[order.status]}
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1 mb-2">
              <p>
                <span className="font-medium">Product:</span> {order.name}
              </p>
              <p>
                <span className="font-medium">Buyer:</span>{" "}
                <span className="block truncate w-full">{order.buyerAddress}</span>
              </p>
              <p>
                <span className="font-medium">Quantity:</span> {order.quantity}
              </p>
            </div>

            {/* Dropdown for Pangasinan addresses */}
            <select
              value={order.selectedLocation}
              onChange={(e) => {
                order.selectedLocation = e.target.value;
                setOrders([...orders]);
              }}
              className="mb-2 border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select Location (Pangasinan)</option>
              {pangasinanAddresses.map((addr) => (
                <option key={addr} value={addr}>
                  {addr}
                </option>
              ))}
            </select>

            <div className="flex space-x-2">
              {order.status === 2 && (
                <button
                  onClick={() => handlePickup(order.id, order.selectedLocation)}
                  className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                >
                  Pick Up
                </button>
              )}
              {order.status === 3 && (
                <button
                  onClick={() => handleDeliver(order.id, order.selectedLocation)}
                  className="flex-1 px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-500"
                >
                  Deliver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
