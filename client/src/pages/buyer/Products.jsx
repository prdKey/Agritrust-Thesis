import { useState, useMemo, useEffect } from 'react';
import ProductCard from '../../components/ui/ProductCard';
import { mockProducts, mockCategories } from '../../mock/mockData';
import axios from "axios"

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);

 useEffect(() => {
  axios.get("http://localhost:3001/products")
    .then((res) => {
      setProducts(res.data);
      console.log(res.data)
    })
    .catch((err) => console.error("Axios error:", err));
}, []);


  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
          Browse Fresh Products
        </h1>
        <p className="text-gray-400">
          Discover organic products from trusted sellers
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={`lg:w-64 shrink-0 ${
            showFilters ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="sticky top-20 space-y-6 ">
            {/* Categories */}
            <div className="bg-white rounded-2xl p-5 shadow-2xs">
              <h1 className="font-semibold text-black mb-4 flex items-center gap-2">
                Categories
              </h1>
              <div className="space-y-2 ">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === ''
                      ? 'bg-green-600 text-white'
                      : 'hover:bg-green-200'
                  }`}
                >
                  All Products
                </button>
                {mockCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.name
                        ? 'bg-green-600 text-white'
                        : 'hover:bg-green-200'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl p-5 shadow-2xs">
              <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Min: {priceRange.min} AGT
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Max: {priceRange.max} AGT
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="bg-white rounded-2xl p-5 shadow-2xs">
              <h3 className="font-semibold text-foreground mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden mb-4 btn-secondary w-full py-2 flex items-center justify-center gap-2"
          >
          </button>

           <div className="grid grid-cols-1 items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            
            {products.map((value, key)=> {return <ProductCard title={value.name} priceAGT={value.price} />})}
          </div>
        </div>

       

      </div>
    </div>
  );
}
