import React, { useEffect, useState } from "react";
import { getOrdersByBuyer, getOrdersBySeller, resolveDispute, getDisputedOrders} from "../../services/orderService";
import { useUserContext } from "../../context/UserContext";
import axios from "axios";
import {
  AlertTriangle, CheckCircle, XCircle, RefreshCw,
  Loader2, ChevronDown, ChevronUp, Scale, User, Package
} from "lucide-react";

const fmtTime = (ts) => (!ts || ts === 0) ? "N/A" : new Date(ts * 1000).toLocaleString();
const fmtAddr = (loc) => {
  if (!loc) return "N/A";
  if (typeof loc === "string") return loc;
  return `#${loc.houseNumber}, ${loc.street}, ${loc.barangay}, ${loc.city}`;
};

export default function AdminDisputes() {
  const { user }  = useUserContext();
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedId, setExpandedId]       = useState(null);
  const [modal, setModal]                 = useState(null); // { order, refundBuyer }

  const fetchDisputed = async () => {
    setLoading(true);
    try {
      // Fetch all disputed orders via admin endpoint
      const res = await getDisputedOrders();
      setOrders(res.data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDisputed(); }, [user]);

  const handleResolve = async (orderId, refundBuyer) => {
    setModal(null);
    setActionLoading(orderId);
    try {
      await resolveDispute(orderId, refundBuyer);
      await fetchDisputed();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to resolve dispute");
    } finally {
      setActionLoading(null);
    }
  };

  // ── Confirm Modal ────────────────────────────────────────────────────────
  const ResolveModal = () => {
    if (!modal) return null;
    const { order, refundBuyer } = modal;
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${refundBuyer ? "bg-blue-100" : "bg-green-100"}`}>
            {refundBuyer
              ? <XCircle className="w-7 h-7 text-blue-600" />
              : <CheckCircle className="w-7 h-7 text-green-600" />
            }
          </div>

          <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
            {refundBuyer ? "Refund Buyer" : "Rule in Seller's Favor"}
          </h3>
          <p className="text-sm text-gray-500 text-center mb-5">
            {refundBuyer
              ? `Buyer will receive a full refund of ${parseFloat(order.totalPrice).toFixed(2)} AGT. Order will be marked Refunded.`
              : `Funds will be distributed normally — seller gets ${parseFloat(order.productPrice).toFixed(2)} AGT, logistics gets ${parseFloat(order.logisticsFee).toFixed(2)} AGT. Order will be marked Completed.`
            }
          </p>

          {/* Parties summary */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Buyer</p>
              <p className="text-sm font-semibold text-gray-900">{order.buyerName}</p>
              <p className="text-xs text-blue-700 font-bold mt-1">
                {refundBuyer ? `+${parseFloat(order.totalPrice).toFixed(2)} AGT` : "No refund"}
              </p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 border border-green-200 text-center">
              <p className="text-xs text-gray-500 mb-1">Seller</p>
              <p className="text-sm font-semibold text-gray-900">{order.sellerName}</p>
              <p className="text-xs text-green-700 font-bold mt-1">
                {refundBuyer ? "No payment" : `+${parseFloat(order.productPrice).toFixed(2)} AGT`}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 text-sm">
              Cancel
            </button>
            <button
              onClick={() => handleResolve(order.id, refundBuyer)}
              className={`flex-1 py-2.5 text-white rounded-xl font-semibold text-sm ${refundBuyer ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              Confirm Resolution
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ResolveModal />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Scale className="w-8 h-8 text-red-500" /> Dispute Resolution
          </h1>
          <p className="text-gray-600 mt-1">
            {orders.length} disputed order{orders.length !== 1 ? "s" : ""} awaiting resolution
          </p>
        </div>
        <button onClick={fetchDisputed} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-500">No disputed orders at the moment.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(order => {
            const isExpanded = expandedId === order.id;
            const isActing   = actionLoading === order.id;

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border-2 border-red-100 overflow-hidden">
                {/* Red top accent */}
                <div className="h-1.5 bg-gradient-to-r from-red-400 via-orange-400 to-red-500" />

                <div className="flex flex-col lg:flex-row">
                  {/* Left panel */}
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-5 lg:w-72 border-b lg:border-b-0 lg:border-r border-red-100 flex-shrink-0">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order ID</p>
                          <p className="text-3xl font-bold text-gray-900">#{order.id}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold border bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> DISPUTED
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Product</p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">{order.name}</p>
                        <p className="text-xs text-gray-500">{order.category} · ×{order.quantity}</p>
                      </div>

                      {/* Escrow summary */}
                      <div className="bg-white/70 rounded-xl p-3 border border-red-100 space-y-1.5 text-xs">
                        <p className="font-semibold text-gray-700 mb-2">Escrowed Funds</p>
                        <div className="flex justify-between"><span className="text-gray-500">Product</span><span className="font-medium">{parseFloat(order.productPrice).toFixed(2)} AGT</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Platform fee</span><span className="font-medium">{parseFloat(order.platformFee).toFixed(4)} AGT</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Logistics</span><span className="font-medium">{parseFloat(order.logisticsFee).toFixed(2)} AGT</span></div>
                        <div className="flex justify-between border-t pt-1.5 font-bold"><span>Total</span><span className="text-red-600">{parseFloat(order.totalPrice).toFixed(2)} AGT</span></div>
                      </div>

                      <p className="text-xs text-gray-400">Opened: {fmtTime(order.createdAt)}</p>
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="flex-1 p-5 space-y-4">
                    {/* Parties */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5 flex items-center gap-1">
                          <User className="w-3 h-3" /> Buyer
                        </p>
                        <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                          <p className="text-sm font-bold text-gray-900">{order.buyerName || "Unknown"}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{fmtAddr(order.buyerLocation)}</p>
                          {order.buyerMobile && <a href={`tel:${order.buyerMobile}`} className="text-xs text-blue-600 font-medium mt-1 block">📞 {order.buyerMobile}</a>}
                          <p className="text-xs text-gray-400 mt-1 font-mono break-all">{order.buyerAddress}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5 flex items-center gap-1">
                          <Package className="w-3 h-3" /> Seller
                        </p>
                        <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                          <p className="text-sm font-bold text-gray-900">{order.sellerName || "Unknown"}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{fmtAddr(order.sellerLocation)}</p>
                          {order.sellerMobile && <a href={`tel:${order.sellerMobile}`} className="text-xs text-green-600 font-medium mt-1 block">📞 {order.sellerMobile}</a>}
                          <p className="text-xs text-gray-400 mt-1 font-mono break-all">{order.sellerAddress}</p>
                        </div>
                      </div>
                    </div>

                    {/* Logistics (if assigned) */}
                    {order.logisticsName && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">Logistics</p>
                        <div className="bg-purple-50 rounded-xl p-3 border border-purple-200 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{order.logisticsName}</p>
                            {order.logisticsMobile && <a href={`tel:${order.logisticsMobile}`} className="text-xs text-purple-600 font-medium">📞 {order.logisticsMobile}</a>}
                          </div>
                          <p className="text-xs text-purple-700 font-bold">{parseFloat(order.logisticsFee).toFixed(2)} AGT fee</p>
                        </div>
                      </div>
                    )}

                    {/* Resolution buttons */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5" /> Choose Resolution
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Refund buyer */}
                        <button
                          onClick={() => setModal({ order, refundBuyer: true })}
                          disabled={isActing}
                          className="flex flex-col items-center gap-1.5 p-4 bg-white border-2 border-blue-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 text-left group"
                        >
                          <XCircle className="w-7 h-7 text-blue-500 group-hover:text-blue-600" />
                          <p className="font-bold text-gray-900 text-sm">Refund Buyer</p>
                          <p className="text-xs text-gray-500 text-center">Full {parseFloat(order.totalPrice).toFixed(2)} AGT returned to buyer</p>
                          {isActing && <Loader2 className="w-4 h-4 animate-spin text-blue-500 mt-1" />}
                        </button>

                        {/* Rule for seller */}
                        <button
                          onClick={() => setModal({ order, refundBuyer: false })}
                          disabled={isActing}
                          className="flex flex-col items-center gap-1.5 p-4 bg-white border-2 border-green-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-50 text-left group"
                        >
                          <CheckCircle className="w-7 h-7 text-green-500 group-hover:text-green-600" />
                          <p className="font-bold text-gray-900 text-sm">Rule for Seller</p>
                          <p className="text-xs text-gray-500 text-center">Distribute normally — seller, platform & logistics paid</p>
                          {isActing && <Loader2 className="w-4 h-4 animate-spin text-green-500 mt-1" />}
                        </button>
                      </div>
                    </div>

                    {/* Toggle details */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {isExpanded ? "Hide" : "View"} Timeline
                    </button>

                    {/* Expanded timeline */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-900 text-sm mb-3">Order Timeline</h4>
                          <div className="space-y-1.5 text-xs">
                            {[
                              ["Created",          order.createdAt],
                              ["Shipped",          order.confirmAt],
                              ["Picked Up",        order.pickedUpAt],
                              ["Out for Delivery", order.outForDeliveryAt],
                              ["Delivered",        order.deliveredAt],
                            ].map(([label, ts]) => (
                              <div key={label} className="flex justify-between gap-2">
                                <span className="text-gray-500 flex-shrink-0">{label}:</span>
                                <span className="font-medium">{fmtTime(ts)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}