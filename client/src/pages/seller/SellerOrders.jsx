import { useState } from "react";

export default function SellerOrders() {
  const [orders, setOrders] = useState([
    { id: 1, product: "Product A", buyer: "0x123...abc", status: "Pending" },
    { id: 2, product: "Product B", buyer: "0x456...def", status: "Refund Requested" },
    { id: 3, product: "Product C", buyer: "0x789...ghi", status: "Shipped" },
  ]);

  const [search, setSearch] = useState("");

  const shipOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Shipped" } : o))
    );
  };

  const approveRefund = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Refunded" } : o))
    );
  };

  const rejectRefund = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "Shipped" } : o))
    );
  };

  // Filter orders based on search input
  const filteredOrders = orders.filter((order) =>
    order.id.toString().includes(search)
  );

  return (
    <div className="min-h-screen rounded-lg bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Orders</h1>

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Buyer</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.product}</td>
                  <td className="py-3 px-4">{order.buyer}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${
                        order.status === "Shipped"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Refund Requested"
                          ? "bg-red-100 text-red-800"
                          : order.status === "Refunded"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    {order.status === "Pending" && (
                      <button
                        onClick={() => shipOrder(order.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Ship
                      </button>
                    )}
                    {order.status === "Refund Requested" && (
                      <>
                        <button
                          onClick={() => approveRefund(order.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                          Approve Refund
                        </button>
                        <button
                          onClick={() => rejectRefund(order.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Reject Refund
                        </button>
                      </>
                    )}
                    {(order.status === "Shipped" || order.status === "Refunded") && (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
