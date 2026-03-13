import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";
import { buyProduct } from "../../services/orderService.js";
import { getAddresses } from "../../services/addressService.js";
import { removeBulkCartItems } from "../../services/cartService.js";
import {
  ShoppingBag, MapPin, Wallet, Truck, ChevronRight, ChevronLeft,
  CheckCircle, Loader2, Tag, X, Lock, Zap, Clock,
  Plus, Minus, Trash2, AlertCircle, Home, Briefcase
} from "lucide-react";
import axios from "axios";
import { getToken } from "../../services/tokenService.js";

const API_URL = import.meta.env.VITE_API_URL;
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const STEPS = [
  { id: 0, label: "Cart",    icon: ShoppingBag },
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Review",  icon: CheckCircle },
];

const DELIVERY_OPTIONS = [
  { id: "standard",  label: "Standard Delivery", eta: "3–5 days",      icon: Truck },
  { id: "express",   label: "Express Delivery",  eta: "1–2 days",      icon: Zap },
  { id: "scheduled", label: "Scheduled",          eta: "Choose a date", icon: Clock },
];

const LABEL_ICON = { Home, Work: Briefcase, Other: MapPin };

// Format address object → single readable line
const fmtAddr = (a) =>
  [a.houseNumber, a.street, a.barangay, a.city, a.zipCode]
    .filter(Boolean).join(", ");

export default function CheckoutPage() {
  const { user }   = useUserContext();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [step, setStep]               = useState(0);
  const [cartItems, setCartItems]     = useState([]);
  const [addresses, setAddresses]     = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [delivery, setDelivery]       = useState("standard");
  const [couponCode, setCouponCode]   = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [note, setNote]               = useState("");
  const [loading, setLoading]         = useState(true);

  const [submitting, setSubmitting]   = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ done: 0, total: 0 });
  const [submitError, setSubmitError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  // ── Load cart items + addresses ───────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const passedItems = location.state?.items;
    if (!passedItems || passedItems.length === 0) {
      navigate("/cart");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setCartItems(passedItems);

        const addrs = await getAddresses(); // already returns [] on failure
        setAddresses(addrs);
        const def = addrs.find(a => a.isDefault);
        if (def) setSelectedAddress(def.id);
      } catch (err) {
        console.error("Failed to load checkout:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // ── Cart helpers ──────────────────────────────────────────────────────────
  const updateQty = (productId, delta) =>
    setCartItems(prev =>
      prev.map(i => i.productId === productId
        ? { ...i, quantity: Math.max(1, i.quantity + delta) }
        : i)
    );
  const removeItem = (productId) =>
    setCartItems(prev => prev.filter(i => i.productId !== productId));

  // ── Coupon ────────────────────────────────────────────────────────────────
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(""); setCouponLoading(true);
    try {
      const res = await axios.post(`${API_URL}/coupons/validate`, { code: couponCode }, { headers: authHeader() });
      setAppliedCoupon(res.data.coupon);
    } catch (err) {
      setCouponError(err.response?.data?.error || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
    }
  };

  // ── Pricing ───────────────────────────────────────────────────────────────
  const subtotal     = cartItems.reduce((s, i) => s + (Number(i.pricePerUnit) * i.quantity), 0);
  const discount     = appliedCoupon
    ? appliedCoupon.type === "percent" ? (subtotal * appliedCoupon.value) / 100 : appliedCoupon.value
    : 0;
  const platformFee  = subtotal * 0.0005;
  const logisticsFee = cartItems.length * 50;
  const total        = Math.max(0, subtotal + platformFee + logisticsFee - discount);
  const totalQty     = cartItems.reduce((s, i) => s + i.quantity, 0);

  const selectedAddr  = addresses.find(a => a.id === selectedAddress);
  const deliveryOpt   = DELIVERY_OPTIONS.find(d => d.id === delivery);

  // ── Place order — pass deliveryAddress to backend ─────────────────────────
  const placeOrder = async () => {
    if (!selectedAddr) {
      setSubmitError("Please select a delivery address.");
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    setSubmitProgress({ done: 0, total: cartItems.length });

    // Build a clean delivery address snapshot (in case address is later edited)
    const deliveryAddress = {
      addressId:   selectedAddr.id,
      name:        selectedAddr.name,
      phone:       selectedAddr.phone,
      fullAddress: fmtAddr(selectedAddr),
      houseNumber: selectedAddr.houseNumber,
      street:      selectedAddr.street,
      barangay:    selectedAddr.barangay,
      city:        selectedAddr.city,
      zipCode:     selectedAddr.zipCode,
    };

    const orderIds = [];
    try {
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        const data = await buyProduct(item.productId, item.quantity, deliveryAddress);
        orderIds.push(data.order?.id || data.orderId || i + 1);
        setSubmitProgress({ done: i + 1, total: cartItems.length });
      }
      // Remove purchased items from cart
      const purchasedProductIds = cartItems.map(i => i.productId);
      try { await removeBulkCartItems(purchasedProductIds); } catch (_) {}

      setOrderSuccess({ orderIds, total });
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to place order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Orders Placed!</h1>
          <p className="text-gray-500 mb-1">
            {orderSuccess.orderIds.length} order{orderSuccess.orderIds.length > 1 ? "s" : ""} confirmed
          </p>
          <p className="text-sm text-gray-400 mb-2">{orderSuccess.total.toFixed(2)} AGT · held in escrow until delivery</p>
          {selectedAddr && (
            <p className="text-xs text-gray-400 mb-6 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3" /> Delivering to {selectedAddr.name} — {fmtAddr(selectedAddr)}
            </p>
          )}
          <div className="space-y-2 mb-8">
            {orderSuccess.orderIds.map((id, i) => (
              <div key={id} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl text-sm">
                <span className="text-gray-500 text-xs">{cartItems[i]?.name}</span>
                <span className="font-mono text-xs text-green-600 font-semibold">Order #{id}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/user/purchase")} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
              View Orders
            </button>
            <button onClick={() => navigate("/")} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Shop More
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Step progress */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone   = i < step;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isDone ? "bg-green-600" : isActive ? "bg-green-600 ring-4 ring-green-100" : "bg-gray-100"}`}>
                      {isDone ? <CheckCircle className="w-5 h-5 text-white" /> : <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />}
                    </div>
                    <span className={`text-xs mt-1 font-medium hidden sm:block ${isActive ? "text-green-600" : isDone ? "text-green-500" : "text-gray-400"}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${isDone ? "bg-green-500" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main content ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* STEP 0 — Cart */}
            {step === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    Cart ({totalQty} item{totalQty !== 1 ? "s" : ""})
                  </h2>
                </div>
                {cartItems.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {cartItems.map(item => (
                      <div key={item.productId} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                        <img
                          src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${item.imageCID}`}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.category} · Product #{item.productId}</p>
                          <p className="text-green-600 font-bold text-sm mt-0.5">{Number(item.pricePerUnit).toFixed(2)} AGT / unit</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.productId, -1)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="w-6 text-center font-semibold text-gray-900 text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.productId, 1)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-bold text-gray-900 text-sm">{(Number(item.pricePerUnit) * item.quantity).toFixed(2)} AGT</p>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 transition-colors ml-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {/* Delivery options */}
                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/40">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" /> Delivery Method
                  </p>
                  <div className="space-y-2">
                    {DELIVERY_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${delivery === opt.id ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                          <input type="radio" name="delivery" value={opt.id} checked={delivery === opt.id} onChange={() => setDelivery(opt.id)} className="accent-green-600" />
                          <Icon className={`w-4 h-4 ${delivery === opt.id ? "text-green-600" : "text-gray-400"}`} />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                            <p className="text-xs text-gray-400">{opt.eta}</p>
                          </div>
                          <span className="text-xs text-gray-400 italic">50 AGT fixed</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1 — Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" /> Delivery Address
                  </h2>
                  <button
                    onClick={() => navigate("/addresses/new", { state: { from: "/checkout" } })}
                    className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Add New
                  </button>
                </div>

                <div className="p-6 space-y-3">
                  {addresses.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium mb-1">No saved addresses yet</p>
                      <p className="text-xs mb-4">Add an address to continue checkout</p>
                      <button
                        onClick={() => navigate("/addresses/new", { state: { from: "/checkout" } })}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    addresses.map(addr => {
                      const LabelIcon = LABEL_ICON[addr.label] || MapPin;
                      const isSelected = selectedAddress === addr.id;
                      return (
                        <label
                          key={addr.id}
                          className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
                        >
                          <input
                            type="radio" name="address" value={addr.id}
                            checked={isSelected}
                            onChange={() => setSelectedAddress(addr.id)}
                            className="accent-green-600 mt-1 flex-shrink-0"
                          />
                          {/* Label icon */}
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "bg-green-100" : "bg-gray-100"}`}>
                            <LabelIcon className={`w-4 h-4 ${isSelected ? "text-green-600" : "text-gray-400"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="font-bold text-gray-900 text-sm">{addr.name}</span>
                              {addr.label && (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{addr.label}</span>
                              )}
                              {addr.isDefault && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{fmtAddr(addr)}</p>
                            <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                          </div>
                          {isSelected && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />}
                        </label>
                      );
                    })
                  )}
                </div>

                {/* Order note */}
                <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Order Note (optional)</label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Special instructions, gate code, etc."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 2 — Review */}
            {step === 2 && (
              <div className="space-y-4">
                {/* Items */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-green-600" />
                      {cartItems.length} Order{cartItems.length > 1 ? "s" : ""} to Submit
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {cartItems.map((item, i) => (
                      <div key={item.productId} className="px-6 py-3 flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-mono w-5">{i + 1}</span>
                        <img
                          src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${item.imageCID}`}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                          <p className="text-xs text-gray-400">×{item.quantity} · #{item.productId}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {(Number(item.pricePerUnit) * item.quantity).toFixed(2)} AGT
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address + payment summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Delivery address */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Delivering To
                    </p>
                    {selectedAddr ? (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900 text-sm">{selectedAddr.name}</span>
                          {selectedAddr.label && (
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{selectedAddr.label}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{fmtAddr(selectedAddr)}</p>
                        <p className="text-xs text-gray-500 mt-1">{selectedAddr.phone}</p>
                        <p className="text-xs text-green-600 font-semibold mt-2">via {deliveryOpt?.label}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-400 italic">No address selected</p>
                    )}
                  </div>

                  {/* Payment */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                      <Wallet className="w-3 h-3" /> Payment
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">⛓️</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">AGT Token</p>
                        <p className="text-xs text-gray-400">On-chain via OrderManager</p>
                      </div>
                    </div>
                    {note && (
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2 text-xs text-yellow-800">
                        <span className="font-semibold">Note: </span>{note}
                      </div>
                    )}
                  </div>
                </div>

                {/* TX progress */}
                {submitting && (
                  <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      <p className="font-semibold text-gray-900">
                        Submitting orders ({submitProgress.done}/{submitProgress.total})
                      </p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: submitProgress.total ? `${(submitProgress.done / submitProgress.total) * 100}%` : "0%" }}
                      />
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {submitError}
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < 2 ? (
                <button
                  onClick={() => { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={(step === 0 && cartItems.length === 0) || (step === 1 && !selectedAddress)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={placeOrder}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    : <><Lock className="w-4 h-4" /> Confirm & Pay {total.toFixed(2)} AGT</>
                  }
                </button>
              )}
            </div>
          </div>

          {/* ── Sidebar ───────────────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Price breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">Price Breakdown</h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({totalQty} items)</span>
                  <span className="font-medium">{subtotal.toFixed(2)} AGT</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Platform fee (0.05%)</span>
                  <span>{platformFee.toFixed(4)} AGT</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Logistics ({cartItems.length} × 50 AGT)</span>
                  <span>{logisticsFee.toFixed(2)} AGT</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−{discount.toFixed(2)} AGT</span>
                  </div>
                )}
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-green-600 text-lg">{total.toFixed(2)} AGT</span>
                </div>
              </div>
              <div className="px-5 pb-4">
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-xs text-amber-700">
                  ⛓️ Final fees are enforced by the <strong>OrderManager</strong> smart contract on-chain.
                </div>
              </div>
            </div>

            {/* Selected address mini-card (shows on all steps after selection) */}
            {selectedAddr && step > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-green-600" /> Delivery Address
                </p>
                <p className="text-sm font-semibold text-gray-900">{selectedAddr.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{fmtAddr(selectedAddr)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{selectedAddr.phone}</p>
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-xs text-green-600 hover:text-green-700 font-semibold mt-2">
                    Change address
                  </button>
                )}
              </div>
            )}

            {/* Coupon */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" /> Coupon Code
              </p>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  <div>
                    <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                    <p className="text-xs text-green-600">{appliedCoupon.label}</p>
                  </div>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="Enter code" value={couponCode}
                      onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={e => e.key === "Enter" && applyCoupon()}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                    />
                    <button
                      onClick={applyCoupon} disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40"
                    >
                      {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              {[
                { e: "⛓️", t: "On-chain escrow — funds locked until delivery" },
                { e: "🔒", t: "ReentrancyGuard protected contract" },
                { e: "⚖️", t: "Dispute resolution by platform admin" },
                { e: "↩️", t: "Cancellation available before shipment" },
              ].map(({ e, t }) => (
                <div key={t} className="flex items-start gap-3 text-xs text-gray-500">
                  <span>{e}</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}