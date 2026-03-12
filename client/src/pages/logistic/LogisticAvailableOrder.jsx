import React, { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext.jsx";
import { getAvailableOrders, acceptOrder } from "../../services/orderService.js";

export default function LogisticAvailableOrders() {
  const { user } = useUserContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
    setLoading(true);
    await acceptOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    setLoading(false);
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === 0) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading available orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Available Orders</h1>
        <p className="text-gray-600 mt-2">Accept orders for delivery</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No available orders</h3>
          <p className="text-gray-500">Check back later for new delivery opportunities</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
            >
              {/* Landscape Layout */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Panel - Order Info */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-5 lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">#{order.id}</p>
                      </div>
                    </div>
                    
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-100 text-blue-800 border-blue-200">
                        READY FOR PICKUP
                      </span>
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
                          <p className="text-xs text-gray-500">Total Value</p>
                          <p className="text-lg font-bold text-green-600">{order.totalPrice} AGT</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Details & Actions */}
                <div className="flex-1 p-5">
                  <div className="space-y-4">
                    {/* Buyer and Seller Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Buyer</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{order.buyerName}</p>
                        <p className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                          #{order.buyerLocation.houseNumber}, {order.buyerLocation.street}, {order.buyerLocation.barangay}, {order.buyerLocation.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Seller</p>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{order.sellerName}</p>
                        <p className="text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded border border-gray-200">
                          #{order.sellerLocation.houseNumber}, {order.sellerLocation.street}, {order.sellerLocation.barangay}, {order.sellerLocation.city}
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
                          <p className="text-xs text-gray-500 mb-1">Your Fee</p>
                          <p className="font-semibold text-green-600">{order.logisticsFee} AGT</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Per Unit</p>
                          <p className="font-semibold text-gray-900">{order.pricePerUnit} AGT</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        disabled={loading}
                        onClick={() => handleAcceptOrder(order.id)}
                        className="px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Accept Order
                      </button>

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
                                <span className="text-gray-600">Platform Fee:</span>
                                <span className="font-medium">{order.platformFee} AGT</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Logistics Fee:</span>
                                <span className="font-medium text-green-600">{order.logisticsFee} AGT</span>
                              </div>
                              <div className="flex justify-between border-t pt-2 font-semibold">
                                <span>Total:</span>
                                <span className="text-green-600">{order.totalPrice} AGT</span>
                              </div>
                            </div>
                          </div>

                          {/* Order Timeline */}
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
                              <div className="pt-2 border-t">
                                <span className="text-gray-600 block mb-1">Buyer Address:</span>
                                <p className="font-medium font-mono break-all text-gray-900">{order.buyerAddress}</p>
                              </div>
                              <div className="pt-2 border-t">
                                <span className="text-gray-600 block mb-1">Seller Address:</span>
                                <p className="font-medium font-mono break-all text-gray-900">{order.sellerAddress}</p>
                              </div>
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