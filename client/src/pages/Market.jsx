import React, { useState, useEffect } from "react";
import FilterCard from "../components/common/FilterCard.jsx";
import ProductCard from "../components/common/ProductCard.jsx";
import { getAllProducts } from "../services/productService.js";
import Loader from "../components/common/Loader.jsx";
import { Outlet , useSearchParams } from "react-router-dom";

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState(["", ""]);
  const [rating, setRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // new loading state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await getAllProducts();
        if(keyword){
          const filteredProducts = data.products.filter(p => p.name.includes(keyword))
          setProducts(filteredProducts)
        } else{
          setProducts(data.products);
        }
        
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  const filteredProducts = products.filter(
    (p) =>
    (priceRange[0] === ""? true : p.pricePerUnit >= priceRange[0] ) &&
    (priceRange[1] === ""? true : p.pricePerUnit <= priceRange[1]) &&
    (category === "" ? true : p.category === category) &&
      (!inStockOnly || p.stock > 0)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      <Outlet/>
      <div className="flex flex-col justify-between md:flex-row gap-6">
        {/* Filters */}
        <aside className="w-full md:w-64">
          <FilterCard
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
        <main className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {loading ? (
            <div className="text-gray-500 col-span-full text-center mt-10">
              <Loader className="w-10"/> Loading products...
            </div>
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
