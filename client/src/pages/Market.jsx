import React, { useState, useEffect } from "react";
import FilterCard from "../components/common/FilterCard.jsx";
import ProductCard from "../components/common/ProductCard.jsx";
import { getAllProducts } from "../services/productService.js";
import Loader from "../components/common/Loader.jsx";
import { Outlet, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search } from "lucide-react";

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  const [category, setCategory]       = useState("");
  const [priceRange, setPriceRange]   = useState(["", ""]);
  const [rating, setRating]           = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showFilter, setShowFilter]   = useState(false); // mobile filter drawer

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        if (keyword) {
          setProducts(data.products.filter(p =>
            p.name.toLowerCase().includes(keyword.toLowerCase())
          ));
        } else {
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

  const filteredProducts = products.filter(p =>
    (priceRange[0] === "" ? true : p.pricePerUnit >= priceRange[0]) &&
    (priceRange[1] === "" ? true : p.pricePerUnit <= priceRange[1]) &&
    (category === "" ? true : p.category === category) &&
    (!inStockOnly || p.stock > 0)
  );

  const activeFilterCount = [
    category !== "",
    priceRange[0] !== "" || priceRange[1] !== "",
    rating > 0,
    inStockOnly,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className=" border-gray-100 px-4 py-4 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {keyword ? `Results for "${keyword}"` : "Marketplace"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? "Loading..." : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
            </p>
          </div>

          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilter(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold shadow-sm"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-green-600 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────────────────────────────── */}
      {showFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          {/* drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">Filters</h2>
              <button onClick={() => setShowFilter(false)} className="p-1.5 rounded-full hover:bg-gray-100">
                <X size={18} className="text-gray-600" />
              </button>
            </div>
            <FilterCard
              category={category} setCategory={setCategory}
              priceRange={priceRange} setPriceRange={setPriceRange}
              rating={rating} setRating={setRating}
              inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
            />
            <button
              onClick={() => setShowFilter(false)}
              className="mt-4 w-full py-3 bg-green-600 text-white font-bold rounded-xl text-sm"
            >
              Show {filteredProducts.length} Products
            </button>
          </div>
        </div>
      )}

      {/* ── Main layout ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex gap-5">

        {/* Sidebar — desktop only */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-[133px]">
            <FilterCard
              category={category} setCategory={setCategory}
              priceRange={priceRange} setPriceRange={setPriceRange}
              rating={rating} setRating={setRating}
              inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
            />
          </div>
        </aside>

        {/* Products grid */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Loader className="w-10" />
              <p className="text-sm">Loading products...</p>
            </div>
          ) : filteredProducts.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
              <Search size={40} className="text-gray-200" />
              <p className="text-base font-semibold text-gray-500">No products found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Marketplace;