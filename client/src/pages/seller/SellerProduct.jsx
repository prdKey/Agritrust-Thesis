import { useState, useEffect } from "react";
import { getProductsByUser, listProduct, updateProduct, deleteProduct } from "../../services/productService.js";
import { uploadImageToPinata } from "../../services/uploadImgService.js";
import { useUserContext } from "../../context/UserContext.jsx";
import Notification from "../../components/common/Notification.jsx";
import { Package, Plus, Search, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user) return;
    
    const fetchProducts = async () => {
      try {
        const data = await getProductsByUser(user.id);
        setProducts(data.products);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } 
    };
    fetchProducts();
  }, [user]);

  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg, type) => {
    const id = Date.now();
    setNotifications([...notifications, { id, message: msg, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };
  
  const [form, setForm] = useState({
    id: null,
    name: "",
    pricePerUnit: "",
    stock: "",
    category: "",
    imageCID: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.pricePerUnit || !form.stock || !form.category || !form.imageCID) {
      addNotification("Please fill all fields", "error");
      return;
    }
    setSaving(true);
    setLoading(true);
    
    try {
      const cid = await uploadImageToPinata(form.imageCID);
      const data = await listProduct({
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        stock: Number(form.stock),
        imageCID: cid
      });
      setProducts(data.products);
      addNotification(`Product "${form.name}" added successfully!`, "success");
      resetForm();
    } catch (err) {
      addNotification("Failed to add product", "error");
      console.error(err);
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setForm({ ...product, imageCID: "" });
    setImagePreview(`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${product.imageCID}`);
  };

  const handleUpdate = async () => {
    if (!form.name || !form.pricePerUnit || !form.stock || !form.category) {
      addNotification("Please fill all fields", "error");
      return;
    }
    setLoading(true);
    setSaving(true);
    
    try {
      let cid = form.imageCID;
      if (form.imageCID && typeof form.imageCID === 'object') {
        cid = await uploadImageToPinata(form.imageCID);
      }
      
      const data = await updateProduct({
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        stock: Number(form.stock),
        imageCID: cid
      });
      setProducts(data.products);
      addNotification(`Product "${form.name}" updated successfully!`, "success");
      setIsEditing(false);
      resetForm();
    } catch (err) {
      addNotification("Failed to update product", "error");
      console.error(err);
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const data = await deleteProduct(id);
      setProducts(data.products);
      addNotification("Product deleted successfully", "success");
      setIsEditing(false);
      resetForm();
    } catch (err) {
      addNotification("Failed to delete product", "error");
      console.error(err);
    }
  };

  const resetForm = () => {
    setForm({ id: null, name: "", pricePerUnit: "", stock: "", category: "", imageCID: "" });
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, imageCID: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = searchId ? p.id === Number(searchId) : true;
    const matchCategory = categoryFilter === "ALL" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <p className="text-gray-600 mt-2">Manage your product inventory</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Stock</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {products.filter(p => p.active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Inactive</p>
          <p className="text-2xl font-bold text-gray-600 mt-1">
            {products.filter(p => !p.active).length}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="number"
            placeholder="Search by Product ID..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="ALL">All Categories</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Grains">Grains</option>
          <option value="Dairy">Dairy</option>
        </select>
      </div>

      {/* Form */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {isEditing ? <Edit2 size={20} className="text-green-600" /> : <Plus size={20} className="text-blue-600" />}
          {isEditing ? "Edit Product" : "Add New Product"}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Category</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Grains">Grains</option>
            <option value="Dairy">Dairy</option>
          </select>
          <input
            name="pricePerUnit"
            type="number"
            value={form.pricePerUnit}
            onChange={handleChange}
            placeholder="Price per unit (AGT)"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock quantity"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ImageIcon size={16} />
              Product Image
            </label>
            <input
              name="imageCID"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {imagePreview && (
              <div className="mt-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-40 rounded-lg object-cover border-2 border-gray-200"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex gap-3">
            {!isEditing ? (
              <button
                onClick={handleAdd}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                {saving ? "Adding product..." : "Add Product"}
              </button>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  {saving ? "Updating..." : "Update Product"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    resetForm();
                  }}
                  disabled={loading}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchId || categoryFilter !== "ALL"
              ? "Try adjusting your search or filters"
              : "Start by adding your first product"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Notifications */}
      {notifications.map((n) => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onEdit, onDelete }) {
  const [imgError, setImgError] = useState(false);
  
  const getImageUrl = () => {
    if (imgError || !product.imageCID) {
      return 'https://via.placeholder.com/400x400?text=No+Image';
    }
    return `https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${product.imageCID}`;
  };

  return (
    <div className="group bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          src={getImageUrl()}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {!product.active && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            INACTIVE
          </div>
        )}
        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
          ID: {product.id}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-900 mb-1">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-3">
            {product.category}
          </p>

          <p className="text-xl font-bold text-green-600 mb-2">
            {product.pricePerUnit} AGT
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Stock:</span>
            <span className={`font-bold ${product.stock > 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {product.stock} units
            </span>
          </div>
        </div>

        {/* Actions - Simple text buttons */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-4">
          <button
            onClick={() => onEdit(product)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}