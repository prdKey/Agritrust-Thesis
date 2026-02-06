import { MapPin, ShoppingCart } from "lucide-react";
import {useState} from "react"
import {addToCart} from "../../services/cartService.js"
import Notification from "./Notification.jsx";
import { useUserContext } from "../../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { buyProduct } from "../../services/orderService.js";

export default function ProductDetails({ product }) {
  const {user} = useUserContext();
  const rating = product.rating ?? 5;
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();



  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg, type) => {
    const id = Date.now();
    setNotifications([...notifications, { id, message: msg, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleAddToCart = async () =>
  { 
    await addToCart({...product, quantity});
    addNotification(`"${product.name}" added to your cart!`, "success")
  }

  const handleBuy = async () =>
  {
    
    await buyProduct(product.id, quantity);
  }
  const increment = () => setQuantity((q) => Math.min(q + 1, product.stock));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT – Image */}
        <div className="bg-gray-50 rounded-lg flex max-h-100 items-center justify-center">
          <img
            src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${product.imageCID}`}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* RIGHT – Info */}
        <div className="flex flex-col justify-between h-full">
        
            <div>
                
                <div className="flex items-center mt-2 gap-2">
                  {/* Title */}
                  <h1 className="text-lg sm:text-xl font-semibold">{product.name}</h1>
                  {/* Rating */}
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                      key={i}
                      className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.97z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">{rating}.0</span>
                  </div>
                </div>

                {/* Price */}
                <p className="text-green-600 text-2xl font-bold">{product.pricePerUnit} AGT</p>

                {/* Stock */}
                <p className="text-gray-500 text-sm mt-1">Stock available: {product.stock}</p>

                {/* Category */}
                <p className="text-gray-500 text-sm mt-1">Category: {product.category}</p>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                <MapPin className="w-4 h-4" />
                Dagupan, Pangasinan
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-3 mt-5">
                <span className="text-sm font-medium text-gray-500">Quantity</span>
                <div className="flex items-center justify-center border border-gray-500 rounded-lg overflow-hidden">
                    <button onClick={decrement} className="cursor-pointer px-3 py-1 hover:bg-gray-100 text-gray-500">-</button>
                    <span className="px-4 py-1 text-sm text-gray-500">{quantity}</span>
                    <button onClick={increment} className="cursor-pointer px-3 py-1 hover:bg-gray-100 text-gray-500  ">+</button>
                </div>
                </div>
            </div>

            {/* Actions – always at bottom */}
            {user && user.walletAddress.toLowerCase() === product.sellerAddress.toLowerCase() ? 
              <div className="flex mt-6">
                <button disabled={true} className="flex-1 border border-gray-500 text-gray-500 rounded-lg py-2">
                    You cannot purchase your own product.
                </button>
              </div> :
              <div className="flex gap-3 mt-6">
                <button onClick={() => user ? handleAddToCart() : navigate("/login")} className="cursor-pointer flex-1 border border-green-600 text-green-600 rounded-lg py-2 hover:bg-green-50 transition">
                  Add to Cart
                </button>

                <button onClick={() => user ? handleBuy() : navigate("/login")} className="cursor-pointer flex-1 bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
            </div>
            }
            
            
        </div>
      </div>

      {/* Notifications container */}
      {notifications.map((n) => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}

    </div>
  );
}
