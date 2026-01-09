const ProductCard = ({
  image,
  title,
  category,
  rating,
  reviews,
  seller,
  priceAGT,
  onAddToCart,
}) => {
  return (
    <div className="w-55 bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
      <div className="w-full p-4 space-y-2">
        <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-44 object-cover"
        />

        {/* Category Badge */}
        <span className="absolute top-3 right-3 bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow">
          {category}
        </span>
      </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-sm">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < rating ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="ml-2 text-gray-500">
            ({reviews})
          </span>
        </div>

        {/* Seller */}
        <p className="text-sm text-gray-500">
          by <span className="text-gray-700 font-medium">{seller}</span>
        </p>

        {/* Price */}
        <div>
          <p className="text-green-600 font-bold text-lg">
            {priceAGT} AGT
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onAddToCart}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
