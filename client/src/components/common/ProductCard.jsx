import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Product Image */}
      <img
        src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${product.imageCID}`}
        alt={product.name}
        className="w-full h-60 md:h-35 object-cover"
      />

      {/* Product Details */}
      <div className=" flex flex-col grow">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-500 text-sm">Seller: {product.sellerName}</p>
        <p className="text-gray-500 text-sm">Category: {product.category}</p>
        <p className="text-green-600 font-bold mt-1">{product.pricePerUnit} AGT</p>
        <p className="text-gray-600 text-sm mt-1">Stock: {product.stock}</p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${
                i < product.rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.176c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.049 9.397c-.783-.57-.38-1.81.588-1.81h4.176a1 1 0 00.95-.69l1.286-3.97z" />
            </svg>
          ))}
          <span className="text-gray-500 text-sm ml-2">{product.rating}.0</span>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <button className="text-xl sm:text-sm flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Add to Cart
          </button>
          <button className="text-xl sm:text-sm flex-1 border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
