import { useEffect, useState } from "react";
import { getBuyerCarts, updateCartQuantity, removeFromCart } from "../../services/cartService.js";
import { useUserContext } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, Package } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) return;
    fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const data = await getBuyerCarts();
      setCartItems(data.carts || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const increment = async (productId, quantity) => {
    setLoading(true);
    try {
      const data = await updateCartQuantity({
        productId,
        quantity: quantity + 1,
      });
      setCartItems(data.carts || []);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const decrement = async (productId, quantity) => {
    if (quantity <= 1) return;
    setLoading(true);
    try {
      const data = await updateCartQuantity({
        productId,
        quantity: quantity - 1,
      });
      setCartItems(data.carts || []);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    setLoading(true);
    try {
      const data = await removeFromCart(productId);
      setCartItems(data.carts || []);
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.productId));
    }
  };

  const getSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.productId))
      .reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }
    
    const selectedCartItems = cartItems.filter(item => 
      selectedItems.includes(item.productId)
    );
    
    // Navigate to checkout with selected items
    navigate('/checkout', { state: { items: selectedCartItems } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="w-20 h-20 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="text-green-600" size={32} />
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} item(s) in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 font-semibold text-gray-700 text-sm">
                <div className="col-span-1 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                </div>
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    selected={selectedItems.includes(item.productId)}
                    onSelect={() => toggleSelect(item.productId)}
                    onIncrement={() => increment(item.productId, item.quantity)}
                    onDecrement={() => decrement(item.productId, item.quantity)}
                    onRemove={() => handleRemove(item.productId)}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-600" />
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Selected Items:</span>
                  <span className="font-semibold text-gray-900">{selectedItems.length}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">{getSelectedTotal().toFixed(2)} AGT</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-xl text-green-600">{getSelectedTotal().toFixed(2)} AGT</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || selectedItems.length === 0}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Continue Shopping
              </button>

              {selectedItems.length === 0 && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Select items to proceed with checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Item Component
function CartItem({ item, selected, onSelect, onIncrement, onDecrement, onRemove, disabled }) {
  const total = (item.pricePerUnit * item.quantity).toFixed(2);

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      {/* Desktop Layout */}
      <div className="hidden md:grid grid-cols-12 gap-4 items-center">
        {/* Checkbox */}
        <div className="col-span-1 flex items-center justify-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="w-4 h-4 accent-green-600 cursor-pointer"
          />
        </div>

        {/* Product Info */}
        <div className="col-span-5 flex items-center gap-3">
          <img
            src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${item.imageCID}`}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
          />
          <div>
            <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
            <p className="text-sm text-gray-500">{item.category}</p>
          </div>
        </div>

        {/* Price */}
        <div className="col-span-2 text-center">
          <p className="font-semibold text-gray-900">{item.pricePerUnit} AGT</p>
        </div>

        {/* Quantity */}
        <div className="col-span-2 flex items-center justify-center gap-2">
          <button
            onClick={onDecrement}
            disabled={disabled || item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Minus size={16} className="text-gray-600" />
          </button>
          <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
          <button
            onClick={onIncrement}
            disabled={disabled}
            className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Plus size={16} className="text-green-600" />
          </button>
        </div>

        {/* Total */}
        <div className="col-span-2 flex items-center justify-between">
          <p className="font-bold text-green-600">{total} AGT</p>
          <button
            onClick={onRemove}
            disabled={disabled}
            className="text-red-600 hover:text-red-700 disabled:text-gray-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
            className="w-4 h-4 accent-green-600 cursor-pointer mt-1"
          />
          
          <img
            src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${item.imageCID}`}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
          />
          
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
            <p className="text-sm text-gray-500 mb-2">{item.category}</p>
            <p className="font-semibold text-gray-900 mb-3">{item.pricePerUnit} AGT</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={onDecrement}
                  disabled={disabled || item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 rounded-lg"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={onIncrement}
                  disabled={disabled}
                  className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 rounded-lg"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <p className="font-bold text-green-600">{total} AGT</p>
                <button
                  onClick={onRemove}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}