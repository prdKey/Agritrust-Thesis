import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrdersByBuyer, confirmReceipt } from "../../services/orderService";
import { useUserContext } from "../../context/UserContext";

const STATUS = [
  { id: "all", label: "All" },
  { id: 1, label: "Paid" },
  { id: 2, label: "Shipped" },
  { id: 3, label: "Picked Up" },
  { id: 4, label: "Out for Delivery" },
  { id: 5, label: "Delivered" },
  { id: 6, label: "Completed" },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const data = await getOrdersByBuyer(); 
        setOrders(data.orders || []);
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
      setLoading(true);
      await confirmReceipt(orderId);
      const data = await getOrdersByBuyer(); 
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      alert("Failed to confirm receipt");
    } finally {
      setLoading(false);
    }
  };

  const handleTrackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      1: { label: "PAID", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      2: { label: "SHIPPED", color: "bg-blue-100 text-blue-800 border-blue-200" },
      3: { label: "PICKED UP", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
      4: { label: "OUT FOR DELIVERY", color: "bg-purple-100 text-purple-800 border-purple-200" },
      5: { label: "DELIVERED", color: "bg-teal-100 text-teal-800 border-teal-200" },
      6: { label: "COMPLETED", color: "bg-green-100 text-green-800 border-green-200" },
      7: { label: "DISPUTED", color: "bg-red-100 text-red-800 border-red-200" },
      8: { label: "REFUNDED", color: "bg-orange-100 text-orange-800 border-orange-200" },
      9: { label: "CANCELLED", color: "bg-gray-200 text-gray-600 border-gray-300" },
      10: { label: "CANCELLED", color: "bg-gray-200 text-gray-600 border-gray-300" },
    };

    const config = statusConfig[status] || { label: "UNKNOWN", color: "bg-gray-100 text-gray-800 border-gray-200" };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === 0) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatAddress = (location) => {
    if (!location) return "N/A";
    return `#${location.houseNumber}, ${location.street}, ${location.barangay}, ${location.city}`;
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = (activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab))
    .slice()
    .sort((a, b) => b.id - a.id);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Purchase</h1>
        <p className="text-gray-600 mt-2">Track and manage your orders</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto mb-6">
        {STATUS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-green-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {activeTab === "all" 
              ? "You haven't made any purchases yet" 
              : `No orders with status "${STATUS.find(s => s.id === activeTab)?.label}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
            >
              {/* Landscape Layout */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Panel */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-5 lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">#{order.id}</p>
                    </div>
                    
                    <div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Product</p>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{order.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.category}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="text-lg font-bold text-gray-900">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Paid</p>
                          <p className="text-lg font-bold text-green-600">{order.totalPrice} AGT</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 p-5">
                  <div className="space-y-4">
                    {/* Seller Info */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Seller Information</p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">{order.sellerName || "Unknown"}</span>
                          {order.sellerMobile && (
                            <a href={`tel:${order.sellerMobile}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              📞 {order.sellerMobile}
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {formatAddress(order.sellerLocation)}
                        </p>
                      </div>
                    </div>

                    {/* Logistics Info (if assigned) */}
                    {order.logisticsName && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Logistics Provider</p>
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900">{order.logisticsName}</span>
                            {order.logisticsMobile && (
                              <a href={`tel:${order.logisticsMobile}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                📞 {order.logisticsMobile}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {/* Track Order Button */}
                      {order.status >= 2 && order.status <= 5 && (
                        <button
                          onClick={() => handleTrackOrder(order.id)}
                          className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Track Order
                        </button>
                      )}

                      {order.status === 5 && (
                        <button
                          onClick={() => handleConfirmReceipt(order.id)}
                          disabled={loading}
                          className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Confirm Receipt
                        </button>
                      )}

                      {order.status === 1 && (
                        <div className="text-sm text-yellow-600 font-medium">Awaiting shipment</div>
                      )}

                      {order.status === 2 && (
                        <div className="text-sm text-blue-600 font-medium">Waiting for logistics pickup</div>
                      )}

                      {(order.status === 3 || order.status === 4) && (
                        <div className="text-sm text-purple-600 font-medium">Order in transit</div>
                      )}

                      {order.status === 6 && (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Order completed
                        </div>
                      )}

                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="ml-auto px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-gray-300"
                      >
                        <span className="font-medium">
                          {expandedOrderId === order.id ? "Hide" : "View"} Details
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedOrderId === order.id ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* Price Breakdown */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Price Breakdown</h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Product:</span>
                                <span className="font-semibold">{order.productPrice} AGT</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Platform:</span>
                                <span className="font-medium">{order.platformFee} AGT</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Logistics:</span>
                                <span className="font-medium">{order.logisticsFee} AGT</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total Paid:</span>
                                <span className="text-green-600">{order.totalPrice} AGT</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Timeline</h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Created:</span>
                                <span className="font-medium">{formatTimestamp(order.createdAt)}</span>
                              </div>
                              {order.confirmAt > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Shipped:</span>
                                  <span className="font-medium">{formatTimestamp(order.confirmAt)}</span>
                                </div>
                              )}
                              {order.pickedUpAt > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Picked Up:</span>
                                  <span className="font-medium">{formatTimestamp(order.pickedUpAt)}</span>
                                </div>
                              )}
                              {order.outForDeliveryAt > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Out:</span>
                                  <span className="font-medium">{formatTimestamp(order.outForDeliveryAt)}</span>
                                </div>
                              )}
                              {order.deliveredAt > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Delivered:</span>
                                  <span className="font-medium">{formatTimestamp(order.deliveredAt)}</span>
                                </div>
                              )}
                              {order.completedAt > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Completed:</span>
                                  <span className="font-medium">{formatTimestamp(order.completedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Additional Info</h4>
                            <div className="text-xs space-y-1.5">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Product ID:</span>
                                <span className="font-medium">#{order.productId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Per Unit:</span>
                                <span className="font-medium">{order.pricePerUnit} AGT</span>
                              </div>
                              {order.location && (
                                <div className="pt-2 border-t">
                                  <span className="text-gray-600 block mb-1">Current Location:</span>
                                  <p className="font-medium break-words">{order.location}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}