import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const rating = product.rating ?? 5;
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/products/${product.id}`)} className="group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-green-600 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden w-full">
      
      {/* Image */}
      <div className="w-full h-40 sm:h-48 md:h-20 lg:h-40 bg-gray-50 overflow-hidden">
        <img
          src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${product.imageCID}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        
        {/* Top */}
        <div>
          <h3 className="text-sm sm:text-[20px] md:text-[18px]  font-semibold line-clamp-2">
            {product.name}
          </h3>

          <p className="text-green-600 font-bold mt-1 text-sm sm:text-base">
            {product.pricePerUnit} AGT
          </p>

          <p className="text-gray-500 text-xs sm:text-sm">
            Stock: {product.stock}
          </p>
        </div>

        {/* Bottom (locked to bottom) */}
        <div className="mt-auto pt-3">
          
          {/* Rating */}
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.97z" />
              </svg>
            ))}
            <span className="text-gray-500 text-xs ml-2">
              {rating}.0
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 sm:gap-2 text-gray-500 text-[9px] mt-1">
            <MapPin className="w-3 h-3" />
            {  product.ownerAddress.barangay + ", " + product.ownerAddress.city}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
