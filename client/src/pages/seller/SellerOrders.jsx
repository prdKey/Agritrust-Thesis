import React, { useEffect, useState } from "react";
import { getOrdersBySeller, confirmShipment, cancelOrderBySeller, openDispute } from "../../services/orderService";
import { useUserContext } from "../../context/UserContext";
import {
  Package, CheckCircle, XCircle, AlertTriangle,
  ChevronDown, ChevronUp, Loader2, RefreshCw, Truck
} from "lucide-react";

const STATUS_TABS = [
  { id: "all", label: "All" },
  { id: 1,     label: "Paid" },
  { id: 2,     label: "Shipped" },
  { id: 3,     label: "Picked Up" },
  { id: 4,     label: "Out for Delivery" },
  { id: 5,     label: "Delivered" },
  { id: 6,     label: "Completed" },
  { id: 7,     label: "Disputed" },
  { id: 9,     label: "Cancelled" },
];

const STATUS_CONFIG = {
  1:  { label: "PAID",             color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  2:  { label: "SHIPPED",          color: "bg-blue-100 text-blue-800 border-blue-200" },
  3:  { label: "PICKED UP",        color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  4:  { label: "OUT FOR DELIVERY", color: "bg-purple-100 text-purple-800 border-purple-200" },
  5:  { label: "DELIVERED",        color: "bg-teal-100 text-teal-800 border-teal-200" },
  6:  { label: "COMPLETED",        color: "bg-green-100 text-green-800 border-green-200" },
  7:  { label: "DISPUTED",         color: "bg-red-100 text-red-800 border-red-200" },
  8:  { label: "REFUNDED",         color: "bg-orange-100 text-orange-800 border-orange-200" },
  9:  { label: "CANCELLED",        color: "bg-gray-200 text-gray-600 border-gray-300" },
  10: { label: "CANCELLED",        color: "bg-gray-200 text-gray-600 border-gray-300" },
};

const fmtTime = (ts) => (!ts || ts === 0) ? null : new Date(ts * 1000).toLocaleString();
const fmtAddr = (loc) => {
  if (!loc) return "N/A";
  if (typeof loc === "string") return loc;
  return `#${loc.houseNumber}, ${loc.street}, ${loc.barangay}, ${loc.city}`;
};

export default function SellerOrders() {
  const { user } = useUserContext();
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedId, setExpandedId]       = useState(null);
  const [activeTab, setActiveTab]         = useState("all");
  const [modal, setModal]                 = useState(null); // { type, order }

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const data = await getOrdersBySeller();
      setOrders(data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [user]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleConfirmShipment = async (orderId) => {
    setModal(null); setActionLoading(orderId);
    try {
      await confirmShipment(orderId);
      await fetchOrders();
    } catch (e) { alert(e.response?.data?.error || "Failed to confirm shipment"); }
    finally { setActionLoading(null); }
  };

  const handleCancelOrder = async (orderId) => {
    setModal(null); setActionLoading(orderId);
    try {
      await cancelOrderBySeller(orderId);
      await fetchOrders();
    } catch (e) { alert(e.response?.data?.error || "Failed to cancel order"); }
    finally { setActionLoading(null); }
  };

  const handleOpenDispute = async (orderId) => {
    setModal(null); setActionLoading(orderId);
    try {
      await openDispute(orderId);
      await fetchOrders();
    } catch (e) { alert(e.response?.data?.error || "Failed to open dispute"); }
    finally { setActionLoading(null); }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const cfg = STATUS_CONFIG[status] || { label: "UNKNOWN", color: "bg-gray-100 text-gray-800 border-gray-200" };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>{cfg.label}</span>;
  };

  const filteredOrders = (activeTab === "all" ? orders : orders.filter(o => o.status === activeTab))
    .slice().sort((a, b) => b.id - a.id);

  // ── Modal ──────────────────────────────────────────────────────────────────
  const ConfirmModal = () => {
    if (!modal) return null;
    const { type, order } = modal;
    const configs = {
      ship: {
        icon: <Truck className="w-12 h-12 text-blue-500 mx-auto mb-3" />,
        title: "Confirm Shipment",
        body: `Mark Order #${order.id} as shipped? This will notify the buyer and make the order available for logistics pickup.`,
        confirmLabel: "Yes, Mark as Shipped",
        confirmClass: "bg-blue-600 hover:bg-blue-700",
        onConfirm: () => handleConfirmShipment(order.id),
      },
      cancel: {
        icon: <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />,
        title: "Cancel Order",
        body: `Cancel Order #${order.id}? The buyer will receive a full refund of ${parseFloat(order.totalPrice).toFixed(2)} AGT. Stock will be restored.`,
        confirmLabel: "Yes, Cancel Order",
        confirmClass: "bg-red-600 hover:bg-red-700",
        onConfirm: () => handleCancelOrder(order.id),
      },
      dispute: {
        icon: <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />,
        title: "Open Dispute",
        body: `Open a dispute for Order #${order.id}? The platform admin will review. Funds stay in escrow until resolved.`,
        confirmLabel: "Open Dispute",
        confirmClass: "bg-amber-600 hover:bg-amber-700",
        onConfirm: () => handleOpenDispute(order.id),
      },
    };
    const cfg = configs[type];
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
          {cfg.icon}
          <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{cfg.title}</h3>
          <p className="text-sm text-gray-600 text-center mb-6">{cfg.body}</p>
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={cfg.onConfirm} className={`flex-1 py-2.5 text-white rounded-xl font-semibold text-sm ${cfg.confirmClass}`}>{cfg.confirmLabel}</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ConfirmModal />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Received</h1>
          <p className="text-gray-600 mt-1">Manage and track your incoming orders</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
        {STATUS_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-200"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500 text-sm">{activeTab === "all" ? "Your received orders will appear here" : "No orders with this status"}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const isExpanded  = expandedId === order.id;
            const isActing    = actionLoading === order.id;
            const canShip     = order.status === 1;
            const canCancel   = order.status === 1;
            const canDispute  = [2, 3, 4, 5].includes(order.status);

            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden">
                <div className="flex flex-col lg:flex-row">

                  {/* Left panel */}
                  <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 flex-shrink-0">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order ID</p>
                        <p className="text-2xl font-bold text-gray-900">#{order.id}</p>
                      </div>
                      {getStatusBadge(order.status)}
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Product</p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5 leading-tight">{order.name}</p>
                        <p className="text-xs text-gray-500">{order.category}</p>
                      </div>
                      <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-2">
                        <div><p className="text-xs text-gray-500">Qty</p><p className="font-bold text-gray-900">{order.quantity}</p></div>
                        <div><p className="text-xs text-gray-500">You Earn</p><p className="font-bold text-green-600 text-sm">{parseFloat(order.productPrice).toFixed(2)} AGT</p></div>
                      </div>
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="flex-1 p-5 space-y-4">
                    {/* Buyer info */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Buyer</p>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{order.buyerName || "Unknown"}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{fmtAddr(order.buyerLocation)}</p>
                        </div>
                        {order.buyerMobile && <a href={`tel:${order.buyerMobile}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium flex-shrink-0 ml-3">📞 {order.buyerMobile}</a>}
                      </div>
                    </div>

                    {/* Logistics */}
                    {order.logisticsName && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Logistics Provider</p>
                        <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">{order.logisticsName}</p>
                          {order.logisticsMobile && <a href={`tel:${order.logisticsMobile}`} className="text-xs text-green-600 font-medium flex-shrink-0 ml-3">📞 {order.logisticsMobile}</a>}
                        </div>
                      </div>
                    )}

                    {/* Price summary strip */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 grid grid-cols-3 gap-3 text-sm">
                      <div><p className="text-xs text-gray-500 mb-0.5">You Earn</p><p className="font-semibold text-green-600">{parseFloat(order.productPrice).toFixed(2)} AGT</p></div>
                      <div><p className="text-xs text-gray-500 mb-0.5">Buyer Paid</p><p className="font-semibold text-blue-600">{parseFloat(order.totalPrice).toFixed(2)} AGT</p></div>
                      <div><p className="text-xs text-gray-500 mb-0.5">Per Unit</p><p className="font-semibold text-gray-900">{parseFloat(order.pricePerUnit).toFixed(2)} AGT</p></div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {canShip && (
                        <button onClick={() => setModal({ type: "ship", order })} disabled={isActing}
                          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                          {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />} Mark as Shipped
                        </button>
                      )}
                      {canCancel && (
                        <button onClick={() => setModal({ type: "cancel", order })} disabled={isActing}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
                          {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />} Cancel Order
                        </button>
                      )}
                      {canDispute && (
                        <button onClick={() => setModal({ type: "dispute", order })} disabled={isActing}
                          className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors disabled:opacity-50">
                          {isActing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <AlertTriangle className="w-3.5 h-3.5" />} Open Dispute
                        </button>
                      )}

                      {/* Status messages */}
                      {order.status === 2  && <span className="text-sm text-blue-600 font-medium self-center">📦 Waiting for logistics pickup</span>}
                      {(order.status === 3 || order.status === 4) && <span className="text-sm text-purple-600 font-medium self-center">🚚 Order in transit</span>}
                      {order.status === 5  && <span className="text-sm text-teal-600 font-medium self-center">🕐 Awaiting buyer confirmation</span>}
                      {order.status === 6  && <span className="text-sm text-green-600 font-semibold self-center flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Completed — payment released</span>}
                      {order.status === 7  && <span className="text-sm text-red-600 font-medium self-center">⚖️ Under dispute review</span>}
                      {order.status === 8  && <span className="text-sm text-orange-600 font-medium self-center">↩️ Refunded to buyer</span>}
                      {(order.status === 9 || order.status === 10) && <span className="text-sm text-gray-500 font-medium self-center">❌ Cancelled</span>}

                      <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                        className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors border border-gray-300">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        {isExpanded ? "Hide" : "Details"}
                      </button>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 pt-4 grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 text-sm mb-3">Price Breakdown</h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between"><span className="text-gray-500">Product (you earn)</span><span className="font-semibold text-green-600">{parseFloat(order.productPrice).toFixed(2)} AGT</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Platform fee</span><span>{parseFloat(order.platformFee).toFixed(4)} AGT</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Logistics fee</span><span>{parseFloat(order.logisticsFee).toFixed(2)} AGT</span></div>
                            <div className="flex justify-between border-t pt-2 font-semibold"><span>Total (escrow)</span><span className="text-blue-600">{parseFloat(order.totalPrice).toFixed(2)} AGT</span></div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-900 text-sm mb-3">Timeline</h4>
                          <div className="space-y-1.5 text-xs">
                            {[
                              ["Created",          order.createdAt],
                              ["Shipped",          order.confirmAt],
                              ["Picked Up",        order.pickedUpAt],
                              ["Out for Delivery", order.outForDeliveryAt],
                              ["Delivered",        order.deliveredAt],
                              ["Completed",        order.completedAt],
                              ["Cancelled",        order.cancelledAt],
                            ].filter(([, ts]) => ts && ts > 0).map(([label, ts]) => (
                              <div key={label} className="flex justify-between gap-2">
                                <span className="text-gray-500 flex-shrink-0">{label}:</span>
                                <span className="font-medium text-right">{fmtTime(ts)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                          <h4 className="font-semibold text-gray-900 text-sm mb-3">Details</h4>
                          <div className="text-xs space-y-2">
                            <div className="flex justify-between"><span className="text-gray-500">Product ID</span><span className="font-medium">#{order.productId}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Order ID</span><span className="font-medium">#{order.id}</span></div>
                            {order.location && (
                              <div className="pt-2 border-t">
                                <p className="text-gray-500 mb-1">Current Location</p>
                                <p className="font-medium break-words">{order.location}</p>
                              </div>
                            )}
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