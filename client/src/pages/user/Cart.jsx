import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  removeBulkCartItems,
} from "../../services/cartService.js";
import {
  ShoppingCart, Trash2, Plus, Minus, CheckSquare,
  Square, ShoppingBag, Loader2, AlertCircle, ArrowRight, X
} from "lucide-react";

const PINATA = "https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/";

// ── Standalone components (outside to avoid focus-loss bug) ──────────────────
const EmptyCart = ({ onShop }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
      <ShoppingCart className="w-10 h-10 text-gray-300" />
    </div>
    <p className="text-lg font-semibold text-gray-500">Your cart is empty</p>
    <p className="text-sm">Add products from the marketplace to get started</p>
    <button
      onClick={onShop}
      className="mt-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors"
    >
      Browse Marketplace
    </button>
  </div>
);

const ProductImage = ({ imageCID, name }) => (
  <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden">
    {imageCID ? (
      <img
        src={`${PINATA}${imageCID}`}
        alt={name}
        className="w-full h-full object-cover"
        onError={e => { e.target.style.display = "none"; }}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <ShoppingBag className="w-6 h-6 text-gray-300" />
      </div>
    )}
  </div>
);

// ── Main CartPage ─────────────────────────────────────────────────────────────
export default function CartPage() {
  const { user }  = useUserContext();
  const navigate  = useNavigate();

  const [items,      setItems]      = useState([]);
  const [selected,   setSelected]   = useState(new Set()); // Set of productIds
  const [loading,    setLoading]    = useState(true);
  const [updating,   setUpdating]   = useState(null);  // productId being updated
  const [removing,   setRemoving]   = useState(null);  // productId being removed
  const [clearing,   setClearing]   = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [error,      setError]      = useState("");

  // ── Fetch cart ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return navigate("/login");
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getCart();
        if (!cancelled) {
          setItems(data);
          // Auto-select all on first load
          setSelected(new Set(data.map(i => i.productId)));
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load cart.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  // ── Selection helpers ───────────────────────────────────────────────────────
  const allSelected  = items.length > 0 && selected.size === items.length;
  const toggleAll    = () => setSelected(allSelected ? new Set() : new Set(items.map(i => i.productId)));
  const toggleOne    = (pid) => setSelected(prev => {
    const next = new Set(prev);
    next.has(pid) ? next.delete(pid) : next.add(pid);
    return next;
  });

  // ── Quantity update ─────────────────────────────────────────────────────────
  const handleQty = async (productId, delta, currentQty, stock) => {
    const newQty = currentQty + delta;
    if (newQty < 1 || newQty > stock) return;
    setUpdating(productId);
    try {
      await updateCartItem(productId, newQty);
      setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: newQty } : i));
    } catch { setError("Failed to update quantity."); }
    finally  { setUpdating(null); }
  };

  // ── Remove single ───────────────────────────────────────────────────────────
  const handleRemove = async (productId) => {
    setRemoving(productId);
    try {
      await removeCartItem(productId);
      setItems(prev => prev.filter(i => i.productId !== productId));
      setSelected(prev => { const n = new Set(prev); n.delete(productId); return n; });
    } catch { setError("Failed to remove item."); }
    finally  { setRemoving(null); }
  };

  // ── Clear cart ──────────────────────────────────────────────────────────────
  const handleClear = async () => {
    setConfirmClear(false);
    setClearing(true);
    try {
      await clearCart();
      setItems([]);
      setSelected(new Set());
    } catch { setError("Failed to clear cart."); }
    finally  { setClearing(false); }
  };

  // ── Checkout selected ───────────────────────────────────────────────────────
  const handleCheckout = () => {
    const selectedItems = items.filter(i => selected.has(i.productId));
    if (selectedItems.length === 0) return;
    navigate("/checkout", { state: { items: selectedItems } });
  };

  // ── Pricing ─────────────────────────────────────────────────────────────────
  const selectedItems  = items.filter(i => selected.has(i.productId));
  const subtotal       = selectedItems.reduce((s, i) => s + Number(i.pricePerUnit) * i.quantity, 0);
  const platformFee    = subtotal * 0.0005;
  const logisticsFee   = selectedItems.length * 50;
  const total          = subtotal + platformFee + logisticsFee;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Confirm clear modal ─────────────────────────────────────────────── */}
      {confirmClear && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setConfirmClear(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-1">Clear Cart?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">All {items.length} items will be removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmClear(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleClear}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-green-600" /> My Cart
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              disabled={clearing}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium disabled:opacity-50"
            >
              {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* ── Error banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</span>
            <button onClick={() => setError("")}><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6">
        {items.length === 0 ? (
          <EmptyCart onShop={() => navigate("/")} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Cart items ───────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-3">

              {/* Select all row */}
              <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex items-center justify-between shadow-sm">
                <button onClick={toggleAll} className="flex items-center gap-2.5 text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors">
                  {allSelected
                    ? <CheckSquare className="w-5 h-5 text-green-600" />
                    : <Square className="w-5 h-5 text-gray-300" />
                  }
                  Select All ({items.length})
                </button>
                {selected.size > 0 && (
                  <span className="text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
                    {selected.size} selected
                  </span>
                )}
              </div>

              {/* Item rows */}
              {items.map(item => {
                const isSelected = selected.has(item.productId);
                const isUpdating = updating === item.productId;
                const isRemoving = removing === item.productId;

                return (
                  <div key={item.productId}
                    className={`bg-white rounded-2xl border-2 shadow-sm transition-all ${isSelected ? "border-green-400" : "border-gray-100"}`}
                  >
                    <div className="p-4 flex items-center gap-4">

                      {/* Checkbox */}
                      <button onClick={() => toggleOne(item.productId)} className="flex-shrink-0">
                        {isSelected
                          ? <CheckSquare className="w-5 h-5 text-green-600" />
                          : <Square className="w-5 h-5 text-gray-300" />
                        }
                      </button>

                      {/* Image */}
                      <ProductImage imageCID={item.imageCID} name={item.name} />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                        <p className="text-green-600 font-bold text-sm mt-1">
                          {Number(item.pricePerUnit).toFixed(2)} AGT / unit
                        </p>
                        {item.stock <= 5 && item.stock > 0 && (
                          <p className="text-xs text-orange-500 font-medium mt-0.5">
                            Only {item.stock} left!
                          </p>
                        )}
                      </div>

                      {/* Qty + remove */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        {/* Remove */}
                        <button
                          onClick={() => handleRemove(item.productId)}
                          disabled={isRemoving}
                          className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {isRemoving ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQty(item.productId, -1, item.quantity, item.stock)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 transition-colors"
                          >
                            <Minus className="w-3 h-3 text-gray-600" />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900 text-sm">
                            {isUpdating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : item.quantity}
                          </span>
                          <button
                            onClick={() => handleQty(item.productId, 1, item.quantity, item.stock)}
                            disabled={item.quantity >= item.stock || isUpdating}
                            className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>

                        {/* Line total */}
                        <p className="text-sm font-bold text-gray-900">
                          {(Number(item.pricePerUnit) * item.quantity).toFixed(2)} AGT
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order summary sidebar ─────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50">
                  <h3 className="font-bold text-gray-900">Order Summary</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Items ({selectedItems.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span>{subtotal.toFixed(2)} AGT</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Platform fee (0.05%)</span>
                    <span>{platformFee.toFixed(4)} AGT</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Logistics ({selectedItems.length} × 50)</span>
                    <span>{logisticsFee.toFixed(2)} AGT</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600 text-lg">{total.toFixed(2)} AGT</span>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <button
                    onClick={handleCheckout}
                    disabled={selected.size === 0}
                    className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Checkout ({selected.size} item{selected.size !== 1 ? "s" : ""})
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate("/")}
                    className="w-full mt-2 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Trust note */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 space-y-1.5">
                <p className="font-semibold">⛓️ AGT Token Payment</p>
                <p>Funds are locked in escrow by the OrderManager smart contract until delivery is confirmed.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}