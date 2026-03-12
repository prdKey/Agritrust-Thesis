import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService.js";
import { Eye, AlertTriangle, CheckCircle, XCircle, Package, Store, DollarSign } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setProducts(res.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagProduct = async (productId) => {
    const reason = window.prompt("Please provide a reason for flagging this product:");
    if (!reason) return;

    try {
      alert("Product flagging feature will be implemented. Reason: " + reason);
    } catch (err) {
      console.error("Failed to flag product:", err);
      alert("Failed to flag product");
    }
  };

  const formatAddress = (address) => {
    if (!address || address === "Unknown") return "N/A";
    if (typeof address === 'string') return address;
    const { houseNumber, street, barangay, city, postalCode } = address;
    return `#${houseNumber} ${street}, ${barangay}, ${city}, ${postalCode}`;
  };

  const toggleExpand = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  const getStatusBadge = (active) => {
    if (active) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-200 flex items-center gap-1 w-fit">
          <CheckCircle size={12} />
          ACTIVE
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1 w-fit">
        <XCircle size={12} />
        INACTIVE
      </span>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = 
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.id.toString().includes(search) ||
      product.sellerName.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === "ALL" || product.category === categoryFilter;
    
    const matchStatus = 
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && product.active) ||
      (statusFilter === "INACTIVE" && !product.active);

    return matchSearch && matchCategory && matchStatus;
  });

  const categories = ["ALL", ...new Set(products.map(p => p.category))];

  const totalInventoryValue = products.reduce((sum, p) => {
    return sum + (p.pricePerUnit * p.stock);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Product Monitoring</h1>
        <p className="text-gray-600 mt-2">Monitor marketplace activity and flag inappropriate products</p>
        <p className="text-sm text-yellow-600 mt-1">
          ⚠️ Note: Products are managed by sellers on the blockchain. Admin can only monitor and flag for violations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by product name, ID, or seller name..."
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <Package size={12} />
            Total Products
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <CheckCircle size={12} />
            Active
          </p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {products.filter(p => p.active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <XCircle size={12} />
            Inactive
          </p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {products.filter(p => !p.active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
            <DollarSign size={12} />
            Inventory Value
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {totalInventoryValue.toFixed(2)} AGT
          </p>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-5 lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Product ID</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">#{product.id}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {getStatusBadge(product.active)}
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Product Name</p>
                      <p className="text-lg font-bold text-gray-900 leading-tight">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                    </div>

                    <div className="pt-3 border-t border-gray-200 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-lg font-bold text-green-600">{product.pricePerUnit} AGT</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Stock</p>
                        <p className="text-lg font-bold text-gray-900">{product.stock} units</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                      <p className="text-xs text-gray-600">Total Value</p>
                      <p className="text-base font-bold text-blue-600">
                        {(product.pricePerUnit * product.stock).toFixed(2)} AGT
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-5">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <Store size={14} />
                        Seller Information
                      </p>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 space-y-2">
                        <div>
                          <span className="text-xs text-gray-600">Seller Name:</span>
                          <p className="text-sm font-mono text-gray-900 break-all">{product.sellerName}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Physical Address:</span>
                          <p className="text-sm text-gray-700">{formatAddress(product.ownerAddress)}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">IPFS Image</p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-700 font-mono break-all">{product.imageCID}</p>
                        <a 
                          href={`https://ipfs.io/ipfs/${product.imageCID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          View Image
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => handleFlagProduct(product.id)}
                        className="px-5 py-2.5 text-sm font-medium bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                      >
                        <AlertTriangle size={16} />
                        Flag Product
                      </button>

                      <button
                        onClick={() => toggleExpand(product.id)}
                        className="ml-auto px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-gray-300"
                      >
                        <span className="font-medium">
                          {expandedProductId === product.id ? "Hide" : "View"} Details
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedProductId === product.id ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {expandedProductId === product.id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                              <Package size={14} className="text-purple-600" />
                              Product Details
                            </h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-medium text-gray-900">{product.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Price per Unit:</span>
                                <span className="font-medium text-gray-900">{product.pricePerUnit} AGT</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Available Stock:</span>
                                <span className="font-medium text-gray-900">{product.stock} units</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Value:</span>
                                <span className="font-medium text-blue-600">
                                  {(product.pricePerUnit * product.stock).toFixed(2)} AGT
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Blockchain Info</h4>
                            <div className="space-y-2 text-xs">
                              <div>
                                <span className="text-gray-600 block mb-1">Seller Wallet:</span>
                                <span className="font-medium font-mono text-gray-900 break-all">{product.sellerAddress}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 block mb-1">IPFS CID:</span>
                                <span className="font-medium font-mono text-gray-900 break-all">{product.imageCID}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="text-gray-600">On-Chain Status:</span>
                                <span className={`font-medium ${product.active ? 'text-green-600' : 'text-gray-600'}`}>
                                  {product.active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}