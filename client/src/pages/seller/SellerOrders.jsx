import React, { useEffect, useState } from "react";
import { getOrdersBySeller, confirmShipment } from "../../services/orderService";
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

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useUserContext();

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

  const handleConfirmShipment = async (orderId) => {
    setLoading(true);
    await confirmShipment(orderId);
    const data = await getOrdersBySeller(); 
    setOrders(data.orders || []);
    setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900">Orders Received</h1>
        <p className="text-gray-600 mt-2">Manage and track your incoming orders</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto mb-6">
        {STATUS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {activeTab === "all" 
              ? "Your received orders will appear here" 
              : `No orders with status "${STATUS.find(s => s.id === activeTab)?.label}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
            >
              {/* Landscape Layout */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Panel */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">#{order.id}</p>
                      </div>
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
                          <p className="text-xs text-gray-500">You Earn</p>
                          <p className="text-lg font-bold text-green-600">{order.productPrice} AGT</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="flex-1 p-5">
                  <div className="space-y-4">
                    {/* Buyer Info */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Buyer Information</p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">{order.buyerName || "Unknown"}</span>
                          {order.buyerMobile && (
                            <a href={`tel:${order.buyerMobile}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                              📞 {order.buyerMobile}
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {formatAddress(order.buyerLocation)}
                        </p>
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Product Price</p>
                          <p className="font-semibold text-gray-900">{order.productPrice} AGT</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total (Buyer Paid)</p>
                          <p className="font-semibold text-blue-600">{order.totalPrice} AGT</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Per Unit</p>
                          <p className="font-semibold text-gray-900">{order.pricePerUnit} AGT</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {order.status === 1 && (
                        <button
                          onClick={() => handleConfirmShipment(order.id)}
                          disabled={loading}
                          className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Mark as Shipped
                        </button>
                      )}

                      {order.status === 2 && (
                        <div className="text-sm text-blue-600 font-medium">Waiting for logistics pickup</div>
                      )}

                      {(order.status === 3 || order.status === 4) && (
                        <div className="text-sm text-gray-600 font-medium">Order in transit</div>
                      )}

                      {order.status === 5 && (
                        <div className="text-sm text-teal-600 font-medium">Waiting for buyer confirmation</div>
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
                                <span>Total:</span>
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
                              {order.location && (
                                <div className="pt-2 border-t">
                                  <span className="text-gray-600 block mb-1">Current Location:</span>
                                  <p className="font-medium break-words">{order.location}</p>
                                </div>
                              )}
                              {order.logisticsName && (
                                <div className="pt-2 border-t">
                                  <span className="text-gray-600 block mb-1">Logistics Provider:</span>
                                  <p className="font-medium">{order.logisticsName}</p>
                                  {order.logisticsMobile && (
                                    <a href={`tel:${order.logisticsMobile}`} className="text-blue-600 hover:text-blue-800">
                                      📞 {order.logisticsMobile}
                                    </a>
                                  )}
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