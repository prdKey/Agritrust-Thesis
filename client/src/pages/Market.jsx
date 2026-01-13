import React, { useState } from "react";
import FilterCard from "../components/common/FilterCard.jsx";
import ProductCard from "../components/common/ProductCard.jsx";

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [rating, setRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);

  const productsData = [
    { id: 1, name: "Apple", farmer: "Juan", category: "Fruits", price: 50, stock: 20, rating: 4, image: "https://via.placeholder.com/400" },
    { id: 2, name: "Carrot", farmer: "Maria", category: "Vegetables", price: 30, stock: 0, rating: 5, image: "https://via.placeholder.com/400" },
    { id: 3, name: "Tomato", farmer: "Pedro", category: "Vegetables", price: 40, stock: 10, rating: 3, image: "https://via.placeholder.com/400" },
    { id: 4, name: "Appdwadle", farmer: "Juan", category: "Fruits", price: 50, stock: 20, rating: 4, image: "https://via.placeholder.com/400" },
  ];

  const filteredProducts = productsData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || p.category === category) &&
      p.price >= priceRange[0] &&
      p.price <= priceRange[1] &&
      p.rating >= rating &&
      (!inStockOnly || p.stock > 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <aside className="w-full md:w-1/4">
          <FilterCard
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            rating={rating}
            setRating={setRating}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
          />
        </aside>



        {/* Products */}
        <main className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center mt-10">
              No products found.
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
