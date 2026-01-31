import React, { useState, useEffect } from "react";
import FilterCard from "../components/common/FilterCard.jsx";
import ProductCard from "../components/common/ProductCard.jsx";
import { getAllProducts } from "../services/productService.js";

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [rating, setRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // new loading state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
    (priceRange[0] === ""? true : p.pricePerUnit >= priceRange[0] ) &&
    (priceRange[1] === ""? true : p.pricePerUnit <= priceRange[1]) &&
    (category === "" ? true : p.category === category) &&
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
        <main className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-gray-500 col-span-full text-center mt-10">
              Loading products...
            </p>
          ) : filteredProducts.length ? (
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
