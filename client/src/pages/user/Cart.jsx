import { useEffect, useState } from "react";
import CartProductCard from "../../components/common/CartProductCard";
import {
  getBuyerCarts,
  updateCartQuantity,
} from "../../services/cartService.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchCartItems = async () => {
      const data = await getBuyerCarts();
      setCartItems(data.carts);
    };

    fetchCartItems();
  }, [user?.id]);

  const increment = async (productId, quantity) => {
    setLoading(true);
    const data = await updateCartQuantity({
      productId,
      quantity: quantity + 1,
    });
    setCartItems(data.carts);
    setLoading(false);
  };

  const decrement = async (productId, quantity) => {
    if (quantity <= 1) return;

    setLoading(true);
    const data = await updateCartQuantity({
      productId,
      quantity: quantity - 1,
    });
    setCartItems(data.carts);
    setLoading(false);
  };

  return (
    <div className="w-full mt-6 px-4 md:px-6">
      <div className="bg-white rounded-lg p-6 mb-4 hidden md:block shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-green-600">Your Cart</h1>
        <div className="grid grid-cols-[6fr_1fr_1fr_1fr_1fr] text-gray-600 font-semibold">
          <span>Product</span>
          <span className="text-center">Unit Price</span>
          <span className="text-center">Quantity</span>
          <span className="text-center">Total Price</span>
          <span className="text-center">Actions</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {cartItems.map((item) => (
          <CartProductCard
            key={item.id}
            item={item}
            increment={increment}
            decrement={decrement}
            disabled={loading}
          />
        ))}
      </div>

      <div className="sticky bottom-0 bg-white rounded-lg p-6 mt-4 shadow-md flex justify-between">
        <div className="flex items-center gap-2">
          <input type="checkbox" className="w-5 h-5" />
          <p>Select all products</p>
        </div>
        <button
          disabled={loading}
          className="px-6 bg-green-600 text-white rounded-lg py-2 hover:bg-green-500 transition disabled:opacity-50"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
