import React from "react";

const FilterCard = ({
  search,
  setSearch,
  category,
  setCategory,
  priceRange,
  setPriceRange,
  rating,
  setRating,
  inStockOnly,
  setInStockOnly,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4 sticky top-25">
      {/* Search */}
      <div>
        <h3 className="text-green-600 font-semibold mb-2">Search</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Category */}
      <div>
        <h3 className="text-green-600 font-semibold mb-2">Category</h3>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">All</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Grains">Grains</option>
          <option value="Dairy">Dairy</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-green-600 font-semibold mb-2">Price Range (AGT)</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
            placeholder="Min"
            className="w-1/2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
            placeholder="Max"
            className="w-1/2 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-green-600 font-semibold mb-2">Minimum Rating</h3>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value={0}>Any</option>
          <option value={1}>1 ⭐</option>
          <option value={2}>2 ⭐</option>
          <option value={3}>3 ⭐</option>
          <option value={4}>4 ⭐</option>
          <option value={5}>5 ⭐</option>
        </select>
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="w-4 h-4 accent-green-600"
          id="stock"
        />
        <label htmlFor="stock" className="text-gray-700 text-sm">
          In Stock Only
        </label>
      </div>
    </div>
  );
};

export default FilterCard;
