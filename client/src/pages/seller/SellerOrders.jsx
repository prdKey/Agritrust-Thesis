import React, { useEffect, useState } from "react";
import { getOrdersBySeller, confirmShipment} from "../../services/orderService";
import {useUserContext} from "../../context/UserContext"

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useUserContext();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const data = await getOrdersBySeller(); 
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleConfirmShipment = async(orderId) => {
    await confirmShipment(orderId);
    const data = await getOrdersBySeller(); 
    setOrders(data.orders || []);
  }


  if (loading) return <div className="p-6">Loading orders...</div>;
  if (!orders.length) return <div className="p-6">No orders yet.</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg space-y-6">
      <h1 className="text-2xl font-bold mb-4">Orders Received</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Order ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Buyer</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Price</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{order.id}</td>
                <td className="px-4 py-2 text-sm">{order.buyerAddress}</td>
                <td className="px-4 py-2 text-sm">{order.name}</td>
                <td className="px-4 py-2 text-sm">{order.quantity}</td>
                <td className="px-4 py-2 text-sm">{order.totalPrice} AGT</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 1
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === 2
                        ? "bg-blue-100 text-blue-800"
                        : order.status === 3
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status === 1
                      ? "PENDING"
                      : order.status === 2
                      ? "SHIPPED"
                      : order.status === 3
                      ? "DELIVERED"
                      : "UNKNOWN"}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  {order.status === 1 && (
                    <button
                      onClick={() => handleConfirmShipment(order.id)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                    >
                      Mark Shipped
                    </button>
                  )}
                  {order.status === 2 && (
                    <button
                  
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
